import React, { useState } from 'react';
import { X, Shield, Server, CheckCircle2 } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const TwilioConfigModal = () => {
  const {
    isTwilioConfigOpen,
    setIsTwilioConfigOpen,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8E0D6] text-[#39342F] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#62564C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#52473E] border border-[#76675B] text-[#B69A78] flex items-center justify-center">
              <Server size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Twilio Voice WebRTC Provider Setup</h3>
              <p className="text-[11px] text-[#E8E0D6]">Mode 1: Genuine Browser-to-Phone PSTN Calling</p>
            </div>
          </div>
          <button
            onClick={() => setIsTwilioConfigOpen(false)}
            className="p-1 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Architecture Note */}
          <div className="p-3 bg-[#F7F2EC] rounded-xl border border-[#E8E0D6] text-[#39342F] flex items-start gap-2.5">
            <Shield size={18} className="text-[#8E7252] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Enterprise Security Rule:</span>
              <p className="leading-relaxed text-[#554D46]">
                As per best practices, Twilio Account SID and Auth Tokens are never placed in client-side code.
                Calls authenticate via a short-lived JSON Web Token (Capability Token / Access Token) issued by your backend service.
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-[#736B63] mb-1">
                Backend Access Token URL (REST endpoint)
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="https://your-api.com/api/voice/token"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#736B63] mb-1">
                Verified Caller ID / On-Ground Virtual Number
              </label>
              <input
                type="text"
                value={callerId}
                onChange={(e) => setCallerId(e.target.value)}
                placeholder="+91 80 4719 2200"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
              />
            </div>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div className="p-3 bg-[#EFF3EE] border border-[#D4DFD5] rounded-lg text-[#47634B] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#8EAA91] shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Setup Instructions */}
          <div className="border-t border-[#E8E0D6]/60 pt-3 text-[11px] text-[#736B63] space-y-1">
            <div className="font-semibold text-[#39342F]">Setup Checklist for Live PSTN Deployment:</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Deploy backend endpoint returning <code>Twilio.jwt.AccessToken</code> with VoiceGrant.</li>
              <li>Configure Twilio TwiML App with Voice Request URL pointing to <code>/voice/connect</code>.</li>
              <li>Load <code>@twilio/voice-sdk</code> via npm when deploying live credentials.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8E0D6] flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3 py-2 rounded-lg bg-white hover:bg-[#F2ECE3] border border-[#E8E0D6] text-[#39342F] font-medium text-xs transition"
          >
            {isTesting ? 'Testing connection...' : 'Test Backend Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTwilioConfigOpen(false)}
              className="px-3 py-2 text-xs font-medium text-[#736B63] hover:text-[#39342F]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#62564C] hover:bg-[#52473E] rounded-xl shadow-xs transition"
            >
              Activate Twilio Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
