/**
 * ExotelCallModal.jsx
 *
 * Professional real phone calling interface using Exotel for On-Ground.ai.
 *
 * Call flow:
 *  1. Agent enters their mobile number + customer mobile number + customer name
 *  2. Clicks "Call" -> backend initiates call via Exotel API (POST /api/calls/initiate)
 *  3. Agent's physical mobile rings first -> agent answers
 *  4. Exotel bridges customer leg -> customer phone rings
 *  5. Status transitions:
 *     Ready -> Initiating -> Agent ringing -> Customer ringing -> Connected -> Completed / Busy / No answer / Failed
 *  6. Connected timer ticks until call terminates
 *  7. Call result and notes form lets agent select outcome, enter deal value/notes, and persist to history
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone,
  PhoneOff,
  X,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Smartphone,
  PhoneCall,
  Info,
  RefreshCw,
  Shield,
  FileText,
  Sparkles,
  Mic,
} from 'lucide-react';
import {
  initiateExotelCall,
  getCallStatus,
  requestHangup,
  updateCallStatus,
  checkBackendHealth,
  isValidIndianMobile,
  formatPhoneDisplay,
} from '../../services/exotelApi';

// ─── Status configuration (strictly aligned with hiring task requirements) ────
const STATUS_CONFIG = {
  ready: {
    label: 'Ready',
    color: 'text-[#736B63]',
    bg: 'bg-[#F5EFE8]',
    border: 'border-[#E8E0D6]',
    pulse: false,
  },
  initiating: {
    label: 'Initiating',
    color: 'text-[#8E7252]',
    bg: 'bg-[#FEF3C7]',
    border: 'border-[#FDE68A]',
    pulse: true,
  },
  'agent-ringing': {
    label: 'Agent ringing',
    color: 'text-[#1D4ED8]',
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#BFDBFE]',
    pulse: true,
  },
  'customer-ringing': {
    label: 'Customer ringing',
    color: 'text-[#9333EA]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]',
    pulse: true,
  },
  ringing: {
    label: 'Customer ringing',
    color: 'text-[#9333EA]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]',
    pulse: true,
  },
  connected: {
    label: 'Connected',
    color: 'text-[#047857]',
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    pulse: false,
  },
  completed: {
    label: 'Completed',
    color: 'text-[#047857]',
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    pulse: false,
  },
  failed: {
    label: 'Failed',
    color: 'text-[#DC2626]',
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FECACA]',
    pulse: false,
  },
  busy: {
    label: 'Busy',
    color: 'text-[#D97706]',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    pulse: false,
  },
  'no-answer': {
    label: 'No answer',
    color: 'text-[#6B7280]',
    bg: 'bg-[#F9FAFB]',
    border: 'border-[#E5E7EB]',
    pulse: false,
  },
  canceled: {
    label: 'Canceled',
    color: 'text-[#6B7280]',
    bg: 'bg-[#F9FAFB]',
    border: 'border-[#E5E7EB]',
    pulse: false,
  },
  ended: {
    label: 'Completed',
    color: 'text-[#047857]',
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    pulse: false,
  },
};

// Terminal statuses where active call has ended
const TERMINAL_STATUSES = new Set(['completed', 'failed', 'busy', 'no-answer', 'canceled', 'ended']);

export const ExotelCallModal = ({ isOpen, onClose, prefillCustomer, onCallComplete }) => {
  // Form inputs
  const [agentNumber, setAgentNumber] = useState(() => localStorage.getItem('og_agent_number') || '');
  const [customerNumber, setCustomerNumber] = useState(prefillCustomer?.phone || '');
  const [customerName, setCustomerName] = useState(prefillCustomer?.name || '');

  // Call state
  const [callPhase, setCallPhase] = useState('ready');
  const [callId, setCallId] = useState(null);
  const [exotelSid, setExotelSid] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [finalRecord, setFinalRecord] = useState(null);

  // Post-call disposition & notes form
  const [outcome, setOutcome] = useState('Order Closed');
  const [notes, setNotes] = useState('');
  const [dealValue, setDealValue] = useState('46000');
  const [isSavingDisposition, setIsSavingDisposition] = useState(false);

  // Backend health
  const [backendHealth, setBackendHealth] = useState(null);

  // Refs
  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const callStartedRef = useRef(false);

  // ── Backend health check on open ───────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setBackendHealth(null);
    setCallPhase('ready');
    setErrorMsg('');
    setInfoMsg('');
    setCallId(null);
    setExotelSid(null);
    setCallDuration(0);
    setFinalRecord(null);
    setNotes('');
    setOutcome('Order Closed');
    callStartedRef.current = false;

    checkBackendHealth().then(setBackendHealth);
  }, [isOpen]);

  // Update prefill when prop changes
  useEffect(() => {
    if (prefillCustomer) {
      setCustomerNumber(prefillCustomer.phone || '');
      setCustomerName(prefillCustomer.name || '');
    }
  }, [prefillCustomer]);

  // ── Call duration timer ───────────────────────────────────────────────────
  // Note: Only ticks when Connected is confirmed by provider
  useEffect(() => {
    if (callPhase === 'connected') {
      timerRef.current = setInterval(() => setCallDuration((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callPhase]);

  // ── Status polling ────────────────────────────────────────────────────────
  const startPolling = useCallback((id) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const result = await getCallStatus(id);
        if (!result.success) return;

        const status = result.status;

        if (status === 'connected') {
          setCallPhase('connected');
          setInfoMsg('Call connected. Both parties are speaking on the live telephone network.');
        } else if (status === 'ringing' || status === 'customer-ringing') {
          setCallPhase('customer-ringing');
          setInfoMsg(`Agent answered. Exotel is now ringing customer (${formatPhoneDisplay(customerNumber)})...`);
        } else if (TERMINAL_STATUSES.has(status)) {
          setCallPhase(status);
          setFinalRecord(result);
          if (result.durationSeconds) {
            setCallDuration(result.durationSeconds);
          }
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);

          // Default notes based on outcome
          if (status === 'busy') setOutcome('Customer Busy');
          else if (status === 'no-answer') setOutcome('No Answer');
          else if (status === 'failed') setOutcome('Call Failed');
          else setOutcome('Order Closed');
        }
      } catch (e) {
        console.warn('Status poll error:', e.message);
      }
    }, 2500);
  }, [customerNumber]);

  // Cleanup on unmount/close
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────
  const agentError = agentNumber && !isValidIndianMobile(agentNumber)
    ? 'Enter a valid 10-digit Indian mobile number'
    : '';
  const customerError = customerNumber && !isValidIndianMobile(customerNumber)
    ? 'Enter a valid 10-digit Indian mobile number'
    : '';
  const canCall = isValidIndianMobile(agentNumber)
    && isValidIndianMobile(customerNumber)
    && customerName.trim()
    && callPhase === 'ready'
    && backendHealth?.ok;

  // ── Initiate call ──────────────────────────────────────────────────────────
  const handleCall = async () => {
    if (!canCall) return;
    setErrorMsg('');
    setInfoMsg('');
    setCallPhase('initiating');
    setCallDuration(0);

    localStorage.setItem('og_agent_number', agentNumber);

    try {
      const result = await initiateExotelCall({
        agentNumber,
        customerNumber,
        customerName: customerName.trim(),
        agentName: 'Akshat Rajan',
        notes,
      });

      if (!result.success) {
        setCallPhase('ready');
        setErrorMsg(result.message || result.error || 'Failed to initiate call via Exotel.');
        return;
      }

      setCallId(result.callId);
      setExotelSid(result.exotelCallSid);
      setCallPhase('agent-ringing');
      setInfoMsg(`Your phone (${formatPhoneDisplay(agentNumber)}) is ringing! Answer your handset to connect with ${customerName}.`);
      callStartedRef.current = true;

      // Start polling for real provider status updates
      startPolling(result.callId);

    } catch (err) {
      setCallPhase('ready');
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setErrorMsg('Cannot reach backend server. Make sure the backend is running on port 3001.');
      } else {
        setErrorMsg(err.message || 'Network error. Please try again.');
      }
    }
  };

  // ── End call ───────────────────────────────────────────────────────────────
  const handleEndCall = async () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);

    if (callId) {
      try {
        await requestHangup(callId);
      } catch {
        // Handled gracefully
      }
    }

    setCallPhase('ended');
    setInfoMsg('Call ended. Please enter call notes and save the disposition below.');
  };

  // ── Save call disposition & finalize ──────────────────────────────────────
  const handleSaveDisposition = async (e) => {
    e?.preventDefault();
    setIsSavingDisposition(true);

    try {
      if (callId) {
        await updateCallStatus(callId, {
          outcome,
          notes: notes || `Call completed with status: ${outcome}`,
          status: 'completed',
          durationSeconds: callDuration,
        });
      }
    } catch (err) {
      console.warn('Could not sync status to backend:', err.message);
    } finally {
      setIsSavingDisposition(false);
    }

    if (onCallComplete && (callStartedRef.current || callId)) {
      onCallComplete({
        callId,
        exotelCallSid: exotelSid,
        status: callPhase === 'ended' ? 'completed' : callPhase,
        outcome,
        notes: notes || `Call disposition: ${outcome}`,
        customerName: customerName.trim(),
        customerNumber,
        agentNumber,
        durationSeconds: callDuration,
        dealValue: outcome === 'Order Closed' ? dealValue : null,
      });
    }

    onClose();
  };

  // ── Reset for new call ─────────────────────────────────────────────────────
  const handleReset = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
    setCallPhase('ready');
    setCallId(null);
    setExotelSid(null);
    setErrorMsg('');
    setInfoMsg('');
    setCallDuration(0);
    setFinalRecord(null);
    setNotes('');
    setOutcome('Order Closed');
    callStartedRef.current = false;
  };

  const handleAiDraftNote = () => {
    const drafts = [
      `Spoke with ${customerName}. Confirmed interest in product specifications and warranty terms. Ready to proceed with checkout.`,
      `Customer requested a callback tomorrow afternoon to confirm sizing and delivery logistics with family.`,
      `Addressed price comparison question. Offered festive instant discount; customer satisfied.`,
    ];
    setNotes(drafts[Math.floor(Math.random() * drafts.length)]);
  };

  if (!isOpen) return null;

  const statusCfg = STATUS_CONFIG[callPhase] || STATUS_CONFIG.ready;
  const isCallActive = ['initiating', 'agent-ringing', 'customer-ringing', 'ringing', 'connected'].includes(callPhase);
  const isTerminal = TERMINAL_STATUSES.has(callPhase);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8E0D6] text-[#39342F] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* ── Header ── */}
        <div className="px-6 py-4 bg-[#62564C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#52473E] border border-[#76675B] flex items-center justify-center">
              <PhoneCall size={18} className="text-[#B69A78]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Exotel Real Phone Calling</h3>
              <p className="text-[11px] text-[#E8E0D6]">Live PSTN Telephony • India Cluster</p>
            </div>
          </div>
          {!isCallActive && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10 transition"
              title="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* ── Backend Health Banner ── */}
          {backendHealth !== null && !backendHealth.ok && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2 text-xs text-[#DC2626]">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Backend server not reachable.</span>
                <br />
                Run <code className="bg-[#FEE2E2] px-1 py-0.5 rounded font-mono">cd server && node index.js</code> or use <code className="bg-[#FEE2E2] px-1 py-0.5 rounded font-mono">start-backend.bat</code>.
              </div>
            </div>
          )}

          {backendHealth?.ok && !backendHealth.exotelConfigured && (
            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-start gap-2 text-xs text-[#92400E]">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Exotel credentials required for real calls.</span>
                <br />
                Copy <code className="bg-[#FEF3C7] px-1 rounded font-mono">server/.env.example</code> to <code className="bg-[#FEF3C7] px-1 rounded font-mono">server/.env</code> and enter your Exotel API Key, Token, Account SID, and ExoPhone.
                {backendHealth.missingConfig && (
                  <div className="mt-1 font-mono text-[10px]">Missing: {backendHealth.missingConfig.join(', ')}</div>
                )}
              </div>
            </div>
          )}

          {/* ── Calling Status Badge ── */}
          <div className={`p-3 ${statusCfg.bg} border ${statusCfg.border} rounded-xl flex items-center justify-between`}>
            <div className={`flex items-center gap-2 text-sm font-semibold ${statusCfg.color}`}>
              {statusCfg.pulse && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusCfg.bg} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusCfg.color.replace('text-', 'bg-')}`} />
                </span>
              )}
              {!statusCfg.pulse && callPhase === 'connected' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <span>Status: <strong>{statusCfg.label}</strong></span>
            </div>

            {callPhase === 'connected' && (
              <span className="font-mono font-bold text-emerald-800 text-sm bg-emerald-100 px-3 py-0.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                <Clock size={13} />
                {formatTimer(callDuration)}
              </span>
            )}
          </div>

          {/* ── Info / Error Messages ── */}
          {infoMsg && (
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-start gap-2 text-xs text-[#1D4ED8]">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2 text-xs text-[#DC2626]">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── Architectural Call Note ── */}
          {callPhase === 'ready' && (
            <div className="p-3 bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl text-xs text-[#736B63] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#39342F]">
                <Shield size={13} className="text-[#B69A78]" />
                <span>Exotel Two-Leg Bridged PSTN Call</span>
              </div>
              <p className="leading-relaxed">
                1. Exotel calls <strong>your mobile</strong> first.
                <br />
                2. When you answer, Exotel bridges to <strong>the customer's phone</strong>.
                <br />
                3. Both parties see your virtual ExoPhone number for privacy.
              </p>
            </div>
          )}

          {/* ── Inputs ── */}
          <div className="space-y-3">
            {/* Agent Number */}
            <div>
              <label className="block text-xs font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1.5">
                  <Smartphone size={13} className="text-[#B69A78]" />
                  Agent Phone Number
                  <span className="text-[#DC2626]">*</span>
                </span>
              </label>
              <input
                type="tel"
                value={agentNumber}
                onChange={(e) => setAgentNumber(e.target.value)}
                placeholder="9876543210 or +919876543210"
                disabled={isCallActive || isTerminal}
                className={`w-full px-3 py-2 text-sm bg-[#FAF7F2] border rounded-xl text-[#39342F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B69A78] disabled:opacity-60 transition ${
                  agentError ? 'border-[#FECACA]' : 'border-[#E8E0D6]'
                }`}
              />
              {agentError && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {agentError}
                </p>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-[#B69A78]" />
                  Customer Name
                  <span className="text-[#DC2626]">*</span>
                </span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Mukunda Dwarkanath"
                disabled={isCallActive || isTerminal}
                className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78] disabled:opacity-60 transition"
              />
            </div>

            {/* Customer Number */}
            <div>
              <label className="block text-xs font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#B69A78]" />
                  Customer Phone Number
                  <span className="text-[#DC2626]">*</span>
                </span>
              </label>
              <input
                type="tel"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                placeholder="9123456789 or +919123456789"
                disabled={isCallActive || isTerminal}
                className={`w-full px-3 py-2 text-sm bg-[#FAF7F2] border rounded-xl text-[#39342F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B69A78] disabled:opacity-60 transition ${
                  customerError ? 'border-[#FECACA]' : 'border-[#E8E0D6]'
                }`}
              />
              {customerError && (
                <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {customerError}
                </p>
              )}
            </div>
          </div>

          {/* Exotel Call SID badge */}
          {exotelSid && (
            <div className="p-2 bg-[#F5EFE8] border border-[#E8E0D6] rounded-lg text-[11px] text-[#736B63] font-mono flex items-center justify-between">
              <span className="text-[#938A82]">Exotel SID:</span>
              <span className="font-semibold text-[#39342F]">{exotelSid}</span>
            </div>
          )}

          {/* Notice on Audio / Mute Control */}
          {isCallActive && (
            <div className="p-2.5 bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl text-[11px] text-[#736B63] flex items-center gap-2">
              <Mic size={14} className="text-[#B69A78] shrink-0" />
              <span>
                Call is bridged over the physical cellular network. Use your mobile phone's native buttons to mute or control volume.
              </span>
            </div>
          )}

          {/* ── Call Result & Notes Form (Post-call disposition) ── */}
          {isTerminal && (
            <div className="p-4 bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#39342F] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-[#B69A78]" />
                  Call Result & Notes Form
                </span>
                <span className="text-xs font-mono font-semibold text-[#8E7252]">
                  Duration: {formatTimer(callDuration)}
                </span>
              </div>

              {/* Outcome Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-[#736B63] uppercase mb-1">
                  Call Outcome
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Order Closed',
                    'Follow-up Scheduled',
                    'Callback Requested',
                    'Call Completed',
                    'Customer Busy',
                    'No Answer',
                    'Not Interested',
                  ].map((o) => (
                    <button
                      type="button"
                      key={o}
                      onClick={() => setOutcome(o)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border text-left transition ${
                        outcome === o
                          ? 'bg-[#62564C] text-white border-[#62564C] shadow-xs'
                          : 'bg-white text-[#39342F] border-[#E8E0D6] hover:bg-[#F2ECE3]'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Closed Deal Value */}
              {outcome === 'Order Closed' && (
                <div className="p-2.5 bg-[#F7F2EC] rounded-lg border border-[#E8E0D6]">
                  <label className="block text-xs font-semibold text-[#39342F] mb-1">
                    Closed Deal Revenue (₹)
                  </label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="e.g. 46000"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-[#E8E0D6] rounded-md font-mono font-semibold text-[#39342F]"
                  />
                </div>
              )}

              {/* Notes with AI Draft */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#736B63] uppercase">
                    Call Notes & Observations
                  </label>
                  <button
                    type="button"
                    onClick={handleAiDraftNote}
                    className="text-[11px] text-[#62564C] hover:text-[#39342F] font-medium flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#E8E0D6]"
                  >
                    <Sparkles size={11} className="text-[#B69A78]" />
                    <span>AI Draft Note</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record customer objections, interest, next steps..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
                />
              </div>

              {/* Save & Log to Recent Calls Button */}
              <button
                type="button"
                onClick={handleSaveDisposition}
                disabled={isSavingDisposition}
                className="w-full py-2.5 rounded-xl bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <CheckCircle2 size={15} />
                <span>Save & Log to Recent Calls</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E0D6] flex items-center gap-3 shrink-0">
          {!isTerminal && (
            <>
              {!isCallActive ? (
                <button
                  onClick={handleCall}
                  disabled={!canCall || backendHealth === null}
                  className="w-full py-3 rounded-xl bg-[#B69A78] hover:bg-[#A48968] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                >
                  {backendHealth === null ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Checking backend...</span>
                    </>
                  ) : (
                    <>
                      <Phone size={18} />
                      <span>Call {customerName ? customerName.split(' ')[0] : 'Customer'}</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full flex items-center gap-3">
                  <div className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#E8E0D6] flex items-center justify-center gap-2 text-xs text-[#736B63]">
                    <Loader2 size={14} className="animate-spin text-[#B69A78]" />
                    <span>
                      {callPhase === 'initiating' && 'Initiating with Exotel...'}
                      {callPhase === 'agent-ringing' && 'Ringing agent phone...'}
                      {callPhase === 'customer-ringing' && 'Ringing customer phone...'}
                      {callPhase === 'ringing' && 'Ringing customer phone...'}
                      {callPhase === 'connected' && `In Call (${formatTimer(callDuration)})`}
                    </span>
                  </div>
                  <button
                    onClick={handleEndCall}
                    className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98"
                  >
                    <PhoneOff size={16} />
                    <span>End</span>
                  </button>
                </div>
              )}
            </>
          )}

          {isTerminal && (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-[#F2ECE3] border border-[#E8E0D6] text-[#39342F] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw size={13} />
                <span>New Call</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE3] border border-[#E8E0D6] text-[#736B63] text-xs font-medium transition"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
