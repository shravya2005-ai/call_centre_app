import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Building,
  FileText,
  DollarSign
} from 'lucide-react';

export const CallReviewDrawer = ({ call, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2 * playbackSpeed;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  if (!call) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0e3025] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-bold text-white">Call Quality & AI Review</h3>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {call.name} • {call.dateTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 divide-y divide-slate-100 flex-1">
          {/* Top Call Info */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">{call.name}</h2>
                <p className="text-xs text-slate-500 font-mono">{call.phone}</p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  call.outcome === 'Order Closed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {call.outcome}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-800">{call.brand}</span>
              <span>•</span>
              <span>{call.duration}</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">{call.type}</span>
            </div>
          </div>

          {/* Audio Recording Mock Player */}
          <div className="pt-4 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Audio Recording & Waveform
            </span>

            <div className="bg-[#0e3025] text-white rounded-xl p-4 shadow-sm space-y-3">
              {/* Waveform Visualization */}
              <div className="h-10 flex items-center justify-between gap-1 px-1">
                {[30, 60, 45, 90, 75, 40, 85, 95, 60, 30, 80, 50, 70, 40, 90, 65, 45, 80, 30].map(
                  (h, i) => {
                    const barPercent = (i / 19) * 100;
                    const isPlayed = barPercent <= playbackProgress;
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayed ? 'bg-amber-400' : 'bg-emerald-800/60'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    );
                  }
                )}
              </div>

              {/* Scrubber Bar */}
              <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-200"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition active:scale-95"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-slate-300 hover:text-white"
                    title="Reset to start"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <span className="font-mono text-emerald-300 text-[11px]">
                    {call.duration}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span>Speed:</span>
                  {[1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        playbackSpeed === spd
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Sentiment & SOP Score */}
          <div className="pt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[11px] text-emerald-800 font-medium block">SOP Adherence</span>
              <span className="text-xl font-bold text-emerald-900 font-mono">{call.sopScore || 94}%</span>
              <p className="text-[10px] text-emerald-700 mt-1">Named shopper + pitched trial</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[11px] text-blue-800 font-medium block">Shopper Sentiment</span>
              <span className="text-xl font-bold text-blue-900 font-mono">{call.sentiment || 'Positive'}</span>
              <p className="text-[10px] text-blue-700 mt-1">High purchase confidence</p>
            </div>
          </div>

          {/* Call Notes */}
          <div className="pt-4 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Telecaller Disposition Notes
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
              {call.notes || 'No call notes available.'}
            </div>
          </div>

          {/* Transcript Snippet */}
          {call.transcript && call.transcript.length > 0 && (
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-600" />
                <span>AI Call Transcript</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {call.transcript.map((line, idx) => (
                  <div key={idx} className="text-xs leading-relaxed">
                    <span
                      className={`font-semibold ${
                        line.speaker === 'Agent' ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {line.speaker}:
                    </span>{' '}
                    <span className="text-slate-600">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0e3025] hover:bg-[#164235] rounded-xl transition"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
