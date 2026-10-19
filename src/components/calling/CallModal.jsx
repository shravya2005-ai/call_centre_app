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
  Bot,
  User,
  ShieldAlert,
  ChevronDown,
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
    practiceScenario,
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
      <div className="fixed bottom-5 right-5 z-50 bg-[#0e3025] text-white border border-[#235845] rounded-xl shadow-2xl p-4 flex items-center gap-4 animate-in fade-in duration-200">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
            {activeContact?.name ? activeContact.name.charAt(0) : 'C'}
          </div>
          {callState === 'connected' && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0e3025] rounded-full animate-ping" />
          )}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">{activeContact?.name || 'In Call'}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-2 font-mono">
            <span>{callState.toUpperCase()}</span>
            {callState === 'connected' && <span>• {formatTimer(callDuration)}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg text-xs transition ${
              isMuted ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
            title="Expand call screen"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={endCall}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e3025] border border-[#235845] text-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Call Header */}
        <div className="px-6 py-4 border-b border-[#1b4d3c] flex items-center justify-between bg-[#0a241c]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
              {isPracticeMode ? 'AI Pitch Coach Simulator' : 'Live Calling Engine'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {callingMode === 'demo' ? 'Local HD Audio Demo' : 'WebRTC Provider'}
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
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
                  ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-500/30 animate-soft-pulse'
                  : callState === 'ringing'
                  ? 'bg-amber-600 text-white ring-4 ring-amber-500/30 animate-soft-pulse'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {activeContact?.name ? activeContact.name.charAt(0) : <User size={32} />}
            </div>
            {callState === 'connected' && (
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-[#0e3025] rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {activeContact?.name || 'Unknown Contact'}
          </h2>
          <p className="text-sm text-slate-300 font-mono mt-0.5">{activeContact?.phone}</p>

          {activeContact?.brand && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#164235] border border-[#235845] text-xs text-amber-200">
              <Building size={13} className="text-amber-400" />
              <span>{activeContact.brand}</span>
              {activeContact.product && <span className="text-slate-400">• {activeContact.product}</span>}
            </div>
          )}

          {/* Status and Timer */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                callState === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : callState === 'ringing'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  : 'bg-slate-700/50 text-slate-300'
              }`}
            >
              {callState === 'connecting' && 'Connecting route...'}
              {callState === 'ringing' && 'Ringing customer phone...'}
              {callState === 'connected' && (isOnHold ? 'Call On Hold' : 'Connected')}
              {callState === 'ended' && 'Call Disconnected'}
            </span>

            {callState === 'connected' && (
              <span className="text-sm font-mono font-semibold text-emerald-400 bg-black/30 px-3 py-0.5 rounded-md border border-emerald-500/20">
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
                className="w-1 bg-emerald-400/80 rounded-full transition-all duration-200"
                style={{
                  height: audioWaveformActive && !isOnHold ? `${h * (0.3 + (i % 3) * 0.25)}px` : '4px',
                  opacity: isOnHold ? 0.3 : 0.85
                }}
              />
            ))}
          </div>
        )}

        {/* Live Conversation Cues & Real-time AI Transcript */}
        <div className="px-6 py-3 mx-6 my-2 rounded-xl bg-[#0a241c] border border-[#1b4d3c] max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Sparkles size={14} />
              <span>AvaniBot Pitch Assist (+23.6pp lift rule)</span>
            </div>
            <span className="text-[10px] text-slate-400">Live Guidance</span>
          </div>

          {liveTranscript.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
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
                        ? 'text-amber-300'
                        : line.speaker === 'Agent'
                        ? 'text-emerald-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {line.speaker}:
                  </span>
                  <span className="text-slate-200">{line.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Keypad Drawer for in-call DTMF tones */}
        {isKeypadVisible && (
          <div className="px-6 py-2 bg-[#092019] border-t border-[#1b4d3c] grid grid-cols-3 gap-2">
            {dtmfKeys.map((key) => (
              <button
                key={key}
                onClick={() => playDtmf(key)}
                className="h-10 rounded-lg bg-[#164235] hover:bg-[#1f5947] active:scale-95 text-sm font-bold text-white transition flex items-center justify-center shadow"
              >
                {key}
              </button>
            ))}
          </div>
        )}

        {/* Call Action Controls */}
        <div className="p-6 bg-[#0a241c] border-t border-[#1b4d3c] flex items-center justify-around">
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-full transition active:scale-95 ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-[#164235] text-slate-200 hover:bg-[#1f5947]'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#164235] text-slate-200 hover:bg-[#1f5947]'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#164235] text-slate-200 hover:bg-[#1f5947]'
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
                ? 'bg-[#164235] text-emerald-300 hover:bg-[#1f5947]'
                : 'bg-slate-700 text-slate-400'
            }`}
            title="Toggle Speaker"
          >
            {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-[11px] font-medium">Speaker</span>
          </button>

          <button
            onClick={endCall}
            className="flex flex-col items-center gap-1.5 p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50 transition active:scale-90"
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
