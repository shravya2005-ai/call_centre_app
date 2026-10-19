import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Send } from 'lucide-react';
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
    <div className="bg-[#F7F2EC] border border-[#E8E0D6] rounded-2xl p-4 md:p-5 shadow-xs text-xs space-y-3">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#B69A78] text-white">
            <AlertCircle size={15} />
          </span>
          <span className="font-bold text-[#39342F] uppercase tracking-wider text-[11px]">
            Needs Your Input (Pinned Exception)
          </span>
        </div>
        <span className="text-[10px] text-[#938A82] font-medium">{card.timestamp}</span>
      </div>

      {/* Issue Title & Store */}
      <div>
        <h4 className="text-sm font-bold text-[#39342F]">{card.title}</h4>
        <p className="text-[11px] text-[#736B63] mt-0.5">{card.store}</p>
      </div>

      {/* Issue Details & AI Suggested Resolution */}
      <div className="bg-white p-3 rounded-xl border border-[#E8E0D6] space-y-2">
        <p className="text-[#554D46] leading-relaxed">{card.details}</p>
        <div className="pt-2 border-t border-[#E8E0D6]/60 flex items-start gap-1.5 text-[#8E7252]">
          <Sparkles size={13} className="text-[#B69A78] shrink-0 mt-0.5" />
          <span className="text-[11px] font-medium italic">
            Suggested SOP Resolution: {card.suggestedResolution}
          </span>
        </div>
      </div>

      {/* If Resolved */}
      {card.resolved ? (
        <div className="p-3 bg-[#EFF3EE] border border-[#D4DFD5] rounded-xl text-[#47634B] flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#8EAA91] shrink-0" />
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
                    ? 'bg-[#62564C] hover:bg-[#52473E] text-white shadow-xs'
                    : 'bg-white hover:bg-[#FAF7F2] border border-[#E8E0D6] text-[#39342F]'
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
              className="w-full pl-3 pr-10 py-2 text-xs bg-white border border-[#E8E0D6] rounded-xl text-[#39342F] placeholder:text-[#938A82] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-[#62564C] text-white hover:bg-[#52473E] disabled:opacity-30 transition"
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
