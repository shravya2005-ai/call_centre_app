import React, { useState } from 'react';
import { CheckCircle2, Calendar, Sparkles, X, FileText } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const CallDispositionModal = () => {
  const {
    isDispositionOpen,
    activeContact,
    callDuration,
    submitDisposition,
    closeDisposition
  } = useCall();

  const [outcome, setOutcome] = useState('Follow-up Scheduled');
  const [dealValue, setDealValue] = useState('46000');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-20T14:30');

  if (!isDispositionOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleAiSummarize = () => {
    const aiDrafts = [
      `Shopper confirmed high interest in ${activeContact?.product || 'mattress'}. Agreed to review 100-night trial terms and requested payment link for 0% EMI.`,
      `Discussed specifications and warranty. Shopper requested a callback tomorrow afternoon to confirm with spouse.`,
      `Shopper had questions about delivery timeline. Confirmed expedited 5-day dispatch with store warehouse.`
    ];
    setNotes(aiDrafts[Math.floor(Math.random() * aiDrafts.length)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitDisposition({
      outcome,
      notes: notes || `Call completed with outcome: ${outcome}`,
      dealValue: outcome === 'Order Closed' ? dealValue : null,
      nextFollowUpDate: outcome === 'Follow-up Scheduled' || outcome === 'Callback Requested' ? followUpDate : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8E0D6] text-[#39342F] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#62564C] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B69A78]" />
              <h3 className="text-base font-bold text-white">Call Wrap-Up & Disposition</h3>
            </div>
            <p className="text-xs text-[#E8E0D6] mt-0.5">
              Logged with {activeContact?.name || 'Contact'} ({formatTimer(callDuration)})
            </p>
          </div>
          <button
            onClick={closeDisposition}
            className="p-1.5 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Outcome Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#736B63] uppercase tracking-wider mb-1.5">
              Call Outcome <span className="text-[#934938]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Order Closed / Won', val: 'Order Closed' },
                { label: 'Follow-up Scheduled', val: 'Follow-up Scheduled' },
                { label: 'Callback Requested', val: 'Callback Requested' },
                { label: 'Left Voicemail', val: 'Left Voicemail' },
                { label: 'Not Interested', val: 'Not Interested' },
                { label: 'Wrong Number', val: 'Wrong Number' }
              ].map(({ label, val }) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setOutcome(val)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition ${
                    outcome === val
                      ? 'bg-[#62564C] text-white border-[#62564C] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#39342F] border-[#E8E0D6] hover:bg-[#F2ECE3]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Deal Value if Closed */}
          {outcome === 'Order Closed' && (
            <div className="p-3 bg-[#F7F2EC] rounded-xl border border-[#E8E0D6] animate-in fade-in">
              <label className="block text-xs font-semibold text-[#39342F] mb-1">
                Closed Deal Revenue Value (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#8E7252] font-semibold text-sm">₹</span>
                <input
                  type="number"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  placeholder="e.g. 46000"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-[#E8E0D6] rounded-lg text-[#39342F] font-semibold focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
                />
              </div>
              <p className="text-[11px] text-[#8E7252] mt-1 font-medium">
                +₹{Math.round(Number(dealValue || 0) * 0.03 + 500)} agent incentive added to your shift earnings!
              </p>
            </div>
          )}

          {/* Schedule Next Action if Follow-up */}
          {(outcome === 'Follow-up Scheduled' || outcome === 'Callback Requested') && (
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D6] animate-in fade-in">
              <label className="block text-xs font-semibold text-[#39342F] mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#B69A78]" />
                <span>Next Follow-up Date & Time (Syncs to Calendar)</span>
              </label>
              <input
                type="datetime-local"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
              />
            </div>
          )}

          {/* Notes with AI summarize */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#736B63] uppercase tracking-wider flex items-center gap-1">
                <FileText size={13} />
                <span>Call Notes & Store SOP Feedback</span>
              </label>
              <button
                type="button"
                onClick={handleAiSummarize}
                className="text-xs text-[#62564C] hover:text-[#39342F] font-medium flex items-center gap-1 bg-[#F5EFE8] hover:bg-[#EFE8DE] px-2 py-0.5 rounded-md border border-[#E8E0D6] transition"
              >
                <Sparkles size={12} className="text-[#B69A78]" />
                <span>✨ AI Draft Note</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record customer objections, financing queries, or next steps..."
              className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] placeholder:text-[#938A82] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8E0D6]/60">
            <button
              type="button"
              onClick={closeDisposition}
              className="px-4 py-2 text-xs font-medium text-[#736B63] hover:text-[#39342F] rounded-lg hover:bg-[#FAF7F2] transition"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#62564C] hover:bg-[#52473E] rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Save & Log to Recent Calls</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
