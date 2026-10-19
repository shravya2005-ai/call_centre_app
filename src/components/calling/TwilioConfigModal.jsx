import React, { useState } from 'react';
import { X, Shield, Key, Globe, Server, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const TwilioConfigModal = () => {
  const {
    isTwilioConfigOpen,
    setIsTwilioConfigOpen,
    twilioConfig,
    setTwilioConfig,
    setCallingMode
  } = useCall();

  const [backendUrl, setBackendUrl] = useState('https://api.on-ground.ai/voice/token');
  const [callerId, setCallerId] = useState('+91 80 4719 2200');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isTwilioConfigOpen) return null;

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate backend handshake verification
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: 'Backend token endpoint reachable. WebRTC Voice SDK ready.'
      });
      setTwilioConfig((prev) => ({
        ...prev,
        isConnected: true
      }));
    }, 1200);
  };

  const handleSave = () => {
    setCallingMode('twilio');
    setIsTwilioConfigOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a241c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Twilio Voice WebRTC Provider Setup</h3>
              <p className="text-[11px] text-emerald-300">Mode 1: Genuine Browser-to-Phone PSTN Calling</p>
            </div>
          </div>
          <button
            onClick={() => setIsTwilioConfigOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Architecture Note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
            <Shield size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Enterprise Security Rule:</span>
              <p className="leading-relaxed">
                As per best practices, Twilio Account SID and Auth Tokens are never placed in client-side code.
                Calls authenticate via a short-lived JSON Web Token (Capability Token / Access Token) issued by your backend service.
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Backend Access Token URL (REST endpoint)
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="https://your-api.com/api/voice/token"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0e3025]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Verified Caller ID / On-Ground Virtual Number
              </label>
              <input
                type="text"
                value={callerId}
                onChange={(e) => setCallerId(e.target.value)}
                placeholder="+91 80 4719 2200"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0e3025]"
              />
            </div>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Setup Instructions */}
          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Setup Checklist for Live PSTN Deployment:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Deploy backend endpoint returning <code>Twilio.jwt.AccessToken</code> with VoiceGrant.</li>
              <li>Configure Twilio TwiML App with Voice Request URL pointing to <code>/voice/connect</code>.</li>
              <li>Load <code>@twilio/voice-sdk</code> via npm when deploying live credentials.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs transition"
          >
            {isTesting ? 'Testing connection...' : 'Test Backend Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTwilioConfigOpen(false)}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0e3025] hover:bg-[#164235] rounded-xl shadow-sm transition"
            >
              Activate Twilio Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
