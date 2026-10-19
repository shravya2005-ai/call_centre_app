import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles
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
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E0D6] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-[#62564C] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B69A78]" />
              <h3 className="text-sm font-bold text-white">Call Quality & AI Review</h3>
            </div>
            <p className="text-xs text-[#E8E0D6] mt-0.5">
              {call.name} • {call.dateTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 divide-y divide-[#E8E0D6]/60 flex-1">
          {/* Top Call Info */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#39342F]">{call.name}</h2>
                <p className="text-xs text-[#938A82] font-mono">{call.phone}</p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  call.outcome === 'Order Closed'
                    ? 'bg-[#EFF3EE] text-[#47634B] border-[#D4DFD5]'
                    : 'bg-[#F5EFE8] text-[#8E7252] border-[#E8E0D6]'
                }`}
              >
                {call.outcome}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-[#736B63] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E0D6]">
              <span className="font-semibold text-[#39342F]">{call.brand}</span>
              <span className="text-[#D4C9BD]">•</span>
              <span>{call.duration}</span>
              <span className="text-[#D4C9BD]">•</span>
              <span className="text-[#62564C] font-medium">{call.type}</span>
            </div>
          </div>

          {/* Audio Recording Mock Player */}
          <div className="pt-4 space-y-2">
            <span className="text-xs font-bold text-[#736B63] uppercase tracking-wider block">
              Audio Recording & Waveform
            </span>

            <div className="bg-[#52473E] text-white rounded-xl p-4 shadow-xs space-y-3">
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
                          isPlayed ? 'bg-[#B69A78]' : 'bg-[#73655A]'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    );
                  }
                )}
              </div>

              {/* Scrubber Bar */}
              <div className="w-full bg-[#453C34] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#B69A78] h-full transition-all duration-200"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-[#B69A78] hover:bg-[#A48968] text-white font-bold transition active:scale-95"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-[#D4C9BD] hover:text-white"
                    title="Reset to start"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <span className="font-mono text-[#E8E0D6] text-[11px]">
                    {call.duration}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#D4C9BD]">
                  <span>Speed:</span>
                  {[1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        playbackSpeed === spd
                          ? 'bg-[#B69A78] text-white font-bold'
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
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D6]">
              <span className="text-[11px] text-[#736B63] font-medium block">SOP Adherence</span>
              <span className="text-xl font-bold text-[#39342F] font-mono">{call.sopScore || 94}%</span>
              <p className="text-[10px] text-[#8E7252] mt-1 font-medium">Named shopper + pitched trial</p>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D6]">
              <span className="text-[11px] text-[#736B63] font-medium block">Shopper Sentiment</span>
              <span className="text-xl font-bold text-[#39342F] font-mono">{call.sentiment || 'Positive'}</span>
              <p className="text-[10px] text-[#736B63] mt-1">High purchase confidence</p>
            </div>
          </div>

          {/* Call Notes */}
          <div className="pt-4 space-y-1.5">
            <span className="text-xs font-bold text-[#736B63] uppercase tracking-wider block">
              Telecaller Disposition Notes
            </span>
            <div className="p-3 bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl text-xs text-[#39342F] leading-relaxed">
              {call.notes || 'No call notes available.'}
            </div>
          </div>

          {/* Transcript Snippet */}
          {call.transcript && call.transcript.length > 0 && (
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#39342F] uppercase tracking-wider">
                <Sparkles size={14} className="text-[#B69A78]" />
                <span>AI Call Transcript</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {call.transcript.map((line, idx) => (
                  <div key={idx} className="text-xs leading-relaxed">
                    <span
                      className={`font-semibold ${
                        line.speaker === 'Agent' ? 'text-[#62564C]' : 'text-[#8E7252]'
                      }`}
                    >
                      {line.speaker}:
                    </span>{' '}
                    <span className="text-[#736B63]">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E0D6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#62564C] hover:bg-[#52473E] rounded-xl transition"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
