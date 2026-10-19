import React, { useState } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Grid,
  Minimize2,
  Maximize2,
  Sparkles,
  User,
  Building
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const CallModal = () => {
  const {
    callState,
    activeContact,
    callDuration,
    isMuted,
    isOnHold,
    isSpeakerOn,
    isKeypadVisible,
    setIsKeypadVisible,
    liveTranscript,
    audioWaveformActive,
    callingMode,
    isPracticeMode,
    endCall,
    toggleMute,
    toggleHold,
    toggleSpeaker,
    playDtmf
  } = useCall();

  const [isMinimized, setIsMinimized] = useState(false);

  if (callState === 'idle') return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Minimized floating call widget in bottom right
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 bg-[#62564C] text-white border border-[#76675B] rounded-xl shadow-2xl p-4 flex items-center gap-4 animate-in fade-in duration-200">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#B69A78] flex items-center justify-center font-bold text-white shadow-xs">
            {activeContact?.name ? activeContact.name.charAt(0) : 'C'}
          </div>
          {callState === 'connected' && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8EAA91] border-2 border-[#62564C] rounded-full animate-ping" />
          )}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{activeContact?.name || 'In Call'}</div>
          <div className="text-xs text-[#E8E0D6] flex items-center gap-2 font-mono">
            <span>{callState.toUpperCase()}</span>
            {callState === 'connected' && <span>• {formatTimer(callDuration)}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg text-xs transition ${
              isMuted ? 'bg-[#934938] text-white' : 'bg-white/10 text-[#FAF7F2] hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF7F2]"
            title="Expand call screen"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={endCall}
            className="p-2 rounded-lg bg-[#934938] hover:bg-[#833E2F] text-white"
            title="Hang up"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </div>
    );
  }

  const dtmfKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#62564C] border border-[#76675B] text-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Call Header */}
        <div className="px-6 py-4 border-b border-[#52473E] flex items-center justify-between bg-[#52473E]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B69A78] animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#E8E0D6]">
              {isPracticeMode ? 'AI Pitch Coach Simulator' : 'Live Calling Engine'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#62564C] text-[#FAF7F2] border border-[#76675B]">
              {callingMode === 'demo' ? 'Local HD Audio Demo' : 'WebRTC Provider'}
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-[#D4C9BD] hover:text-white hover:bg-white/10 transition"
            title="Minimize to floating window"
          >
            <Minimize2 size={18} />
          </button>
        </div>

        {/* Contact Info and Status */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="relative inline-block mb-4">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                callState === 'connected'
                  ? 'bg-[#52473E] text-white ring-4 ring-[#B69A78]/40 border border-[#76675B] shadow-lg animate-soft-pulse'
                  : callState === 'ringing'
                  ? 'bg-[#52473E] text-[#B69A78] ring-4 ring-[#B69A78]/30 border border-[#76675B] animate-soft-pulse'
                  : 'bg-[#52473E] text-[#D4C9BD]'
              }`}
            >
              {activeContact?.name ? activeContact.name.charAt(0) : <User size={32} />}
            </div>
            {callState === 'connected' && (
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#8EAA91] border-2 border-[#62564C] rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {activeContact?.name || 'Unknown Contact'}
          </h2>
          <p className="text-sm text-[#D4C9BD] font-mono mt-0.5">{activeContact?.phone}</p>

          {activeContact?.brand && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#52473E] border border-[#6B5E53] text-xs text-[#FAF7F2]">
              <Building size={13} className="text-[#B69A78]" />
              <span>{activeContact.brand}</span>
              {activeContact.product && <span className="text-[#D4C9BD]">• {activeContact.product}</span>}
            </div>
          )}

          {/* Status and Timer */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                callState === 'connected'
                  ? 'bg-[#52473E] text-[#FAF7F2] border-[#76675B]'
                  : callState === 'ringing'
                  ? 'bg-[#52473E] text-[#B69A78] border-[#76675B] animate-pulse'
                  : 'bg-[#52473E] text-[#D4C9BD] border-[#6B5E53]'
              }`}
            >
              {callState === 'connecting' && 'Connecting route...'}
              {callState === 'ringing' && 'Ringing customer phone...'}
              {callState === 'connected' && (isOnHold ? 'Call On Hold' : 'Connected')}
              {callState === 'ended' && 'Call Disconnected'}
            </span>

            {callState === 'connected' && (
              <span className="text-sm font-mono font-semibold text-[#B69A78] bg-[#453C34] px-3 py-0.5 rounded-md border border-[#6B5E53]">
                {formatTimer(callDuration)}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Waveform Visualizer */}
        {callState === 'connected' && (
          <div className="px-6 py-2 flex items-center justify-center gap-1">
            {[40, 65, 85, 45, 95, 70, 50, 90, 60, 30, 75, 40].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#B69A78] rounded-full transition-all duration-200"
                style={{
                  height: audioWaveformActive && !isOnHold ? `${h * (0.3 + (i % 3) * 0.25)}px` : '4px',
                  opacity: isOnHold ? 0.3 : 0.9
                }}
              />
            ))}
          </div>
        )}

        {/* Live Conversation Cues & Real-time AI Transcript */}
        <div className="px-6 py-3 mx-6 my-2 rounded-xl bg-[#52473E] border border-[#6B5E53] max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2]">
              <Sparkles size={14} className="text-[#B69A78]" />
              <span>AvaniBot Pitch Assist (+23.6pp lift rule)</span>
            </div>
            <span className="text-[10px] text-[#D4C9BD]">Live Guidance</span>
          </div>

          {liveTranscript.length === 0 ? (
            <p className="text-xs text-[#D4C9BD] italic">
              {callState === 'ringing'
                ? 'Waiting for customer to pick up...'
                : 'Tip: Address customer by their full name to build immediate offline rapport.'}
            </p>
          ) : (
            <div className="space-y-1.5">
              {liveTranscript.map((line, idx) => (
                <div key={idx} className="text-xs leading-relaxed flex items-start gap-1.5">
                  <span
                    className={`font-semibold shrink-0 ${
                      line.speaker === 'Customer'
                        ? 'text-[#B69A78]'
                        : line.speaker === 'Agent'
                        ? 'text-[#FAF7F2]'
                        : 'text-[#D4C9BD]'
                    }`}
                  >
                    {line.speaker}:
                  </span>
                  <span className="text-[#E8E0D6]">{line.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Keypad Drawer for in-call DTMF tones */}
        {isKeypadVisible && (
          <div className="px-6 py-2.5 bg-[#453C34] border-t border-[#6B5E53] grid grid-cols-3 gap-2">
            {dtmfKeys.map((key) => (
              <button
                key={key}
                onClick={() => playDtmf(key)}
                className="h-10 rounded-lg bg-[#52473E] hover:bg-[#62564C] active:scale-95 text-sm font-bold text-white transition flex items-center justify-center border border-[#6B5E53] shadow-xs"
              >
                {key}
              </button>
            ))}
          </div>
        )}

        {/* Call Action Controls */}
        <div className="p-6 bg-[#52473E] border-t border-[#6B5E53] flex items-center justify-around">
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition active:scale-95 ${
              isMuted
                ? 'bg-[#934938] text-white border border-[#A75443]'
                : 'bg-[#62564C] text-[#FAF7F2] hover:bg-[#6F6257] border border-[#76675B]'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            <span className="text-[11px] font-medium">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setIsKeypadVisible(!isKeypadVisible)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition active:scale-95 ${
              isKeypadVisible
                ? 'bg-[#B69A78] text-white border border-[#C5AA89]'
                : 'bg-[#62564C] text-[#FAF7F2] hover:bg-[#6F6257] border border-[#76675B]'
            }`}
            title="Toggle DTMF keypad"
          >
            <Grid size={20} />
            <span className="text-[11px] font-medium">Keypad</span>
          </button>

          <button
            onClick={toggleHold}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition active:scale-95 ${
              isOnHold
                ? 'bg-[#B69A78] text-white border border-[#C5AA89]'
                : 'bg-[#62564C] text-[#FAF7F2] hover:bg-[#6F6257] border border-[#76675B]'
            }`}
            title={isOnHold ? 'Resume call' : 'Put on hold'}
          >
            {isOnHold ? <Play size={20} /> : <Pause size={20} />}
            <span className="text-[11px] font-medium">{isOnHold ? 'Resume' : 'Hold'}</span>
          </button>

          <button
            onClick={toggleSpeaker}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition active:scale-95 ${
              isSpeakerOn
                ? 'bg-[#B69A78] text-white border border-[#C5AA89]'
                : 'bg-[#62564C] text-[#FAF7F2] hover:bg-[#6F6257] border border-[#76675B]'
            }`}
            title="Toggle Speaker"
          >
            {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-[11px] font-medium">Speaker</span>
          </button>

          <button
            onClick={endCall}
            className="flex flex-col items-center gap-1.5 p-3.5 rounded-full bg-[#934938] hover:bg-[#833E2F] text-white shadow-lg transition active:scale-90"
            title="End call"
          >
            <PhoneOff size={22} />
            <span className="text-[11px] font-semibold">End</span>
          </button>
        </div>
      </div>
    </div>
  );
};
