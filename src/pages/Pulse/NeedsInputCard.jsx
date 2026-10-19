import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Send, CornerDownLeft } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const NeedsInputCard = ({ card, channelId }) => {
  const { answerPinnedInputCard } = useAppData();
  const [replyText, setReplyText] = useState('');

  if (!card) return null;

  const handleActionClick = (actionValue, actionLabel) => {
    answerPinnedInputCard(channelId, replyText, actionLabel);
    setReplyText('');
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    answerPinnedInputCard(channelId, replyText, 'Custom instruction entered');
    setReplyText('');
  };

  return (
    <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 md:p-5 shadow-xs text-xs space-y-3">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-500 text-white">
            <AlertCircle size={15} />
          </span>
          <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
            Needs Your Input (Pinned Exception)
          </span>
        </div>
        <span className="text-[10px] text-amber-800 font-medium">{card.timestamp}</span>
      </div>

      {/* Issue Title & Store */}
      <div>
        <h4 className="text-sm font-bold text-slate-900">{card.title}</h4>
        <p className="text-[11px] text-slate-600 mt-0.5">{card.store}</p>
      </div>

      {/* Issue Details & AI Suggested Resolution */}
      <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-2">
        <p className="text-slate-700 leading-relaxed">{card.details}</p>
        <div className="pt-2 border-t border-amber-100 flex items-start gap-1.5 text-amber-900">
          <Sparkles size={13} className="text-amber-600 shrink-0 mt-0.5" />
          <span className="text-[11px] font-medium italic">
            Suggested SOP Resolution: {card.suggestedResolution}
          </span>
        </div>
      </div>

      {/* If Resolved */}
      {card.resolved ? (
        <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <div>
            <span className="font-bold block">Exception Resolved</span>
            <span className="text-[11px]">{card.resolutionText}</span>
          </div>
        </div>
      ) : (
        /* Action Buttons and Reply Box */
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {card.actions?.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => handleActionClick(act.value, act.label)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition active:scale-95 ${
                  act.primary
                    ? 'bg-[#0e3025] hover:bg-[#164235] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 border border-amber-300 text-amber-950'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleReplySubmit} className="relative">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Or write custom instructions for the floor executive..."
              className="w-full pl-3 pr-10 py-2 text-xs bg-white border border-amber-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e3025]"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-[#0e3025] text-white hover:bg-[#164235] disabled:opacity-30 transition"
              title="Submit reply"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
