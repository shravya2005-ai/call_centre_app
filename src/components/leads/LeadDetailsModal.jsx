import React, { useState } from 'react';
import {
  X,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building,
  CreditCard,
  ShieldCheck,
  Receipt,
  AlertCircle,
  ExternalLink,
  Target,
  Clock
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useCall } from '../../context/CallContext';

export const LeadDetailsModal = () => {
  const { leads, activeLeadModalId, closeLeadModal, navigateLeadModal } = useAppData();
  const { startCall } = useCall();

  const [expandedSignals, setExpandedSignals] = useState({
    'Financing Related': true,
    'Quotation Demanded': true,
    'Warranty Related': false,
    'Competitor Mentioned': false
  });

  if (!activeLeadModalId) return null;

  const currentLead = leads.find((l) => l.id === activeLeadModalId) || leads[0];
  const currentIndex = leads.findIndex((l) => l.id === currentLead.id);

  const toggleSignal = (cat) => {
    setExpandedSignals((prev) => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleInAppCall = () => {
    closeLeadModal();
    startCall(currentLead, 'demo');
  };

  const handleTelCall = () => {
    window.location.href = `tel:${currentLead.phone.replace(/\s+/g, '')}`;
  };

  const getSignalIcon = (iconName) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard size={15} className="text-[#8E7252]" />;
      case 'Receipt':
        return <Receipt size={15} className="text-[#8E7252]" />;
      case 'ShieldCheck':
        return <ShieldCheck size={15} className="text-[#47634B]" />;
      default:
        return <AlertCircle size={15} className="text-[#8E7252]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8E0D6] text-[#39342F] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#62564C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B69A78]" />
            <h3 className="text-base font-bold text-white tracking-tight">Leads Detail & SOP Guide</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#52473E] text-[#E8E0D6] border border-[#76675B] font-mono">
              Lead {currentIndex + 1} of {leads.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Paging navigation controls */}
            <div className="flex items-center bg-[#52473E] rounded-lg p-0.5 border border-[#76675B]">
              <button
                onClick={() => navigateLeadModal('prev')}
                className="p-1 text-[#D4C9BD] hover:text-white hover:bg-white/10 rounded transition"
                title="Previous lead"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => navigateLeadModal('next')}
                className="p-1 text-[#D4C9BD] hover:text-white hover:bg-white/10 rounded transition"
                title="Next lead"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <button
              onClick={closeLeadModal}
              className="p-1.5 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 divide-y divide-[#E8E0D6]/60">
          {/* Top Info Bar */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#39342F]">{currentLead.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    currentLead.priority === 'Hot'
                      ? 'bg-[#F9ECE7] text-[#934938] border-[#EDD3CB]'
                      : 'bg-[#F5EFE8] text-[#8E7252] border-[#E8E0D6]'
                  }`}
                >
                  {currentLead.priority} Priority
                </span>
              </div>
              <p className="text-xs text-[#938A82] font-mono mt-1">{currentLead.phone} • {currentLead.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#736B63]">
                <span className="inline-flex items-center gap-1 font-medium bg-[#FAF7F2] px-2.5 py-1 rounded-md text-[#39342F] border border-[#E8E0D6]">
                  <Building size={13} className="text-[#8E7252]" />
                  {currentLead.brand}
                </span>
                <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8E0D6]">
                  {currentLead.product}
                </span>
                <span className="text-[#D4C9BD]">•</span>
                <span className="inline-flex items-center gap-1 text-[#736B63]">
                  <Clock size={12} />
                  {currentLead.visitedAt}
                </span>
              </div>
            </div>

            {/* Value at Stake Badge */}
            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#938A82] uppercase tracking-wider block">
                Value at Stake
              </span>
              <span className="text-lg font-bold text-[#39342F] font-mono">{currentLead.valueAtStake}</span>
            </div>
          </div>

          {/* Scores Matrix */}
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D6] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#39342F] block">ICP Fit Score</span>
                <span className="text-[11px] text-[#736B63]">Ideal Customer Profile</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#39342F] font-mono">{currentLead.icpScore}%</span>
                <div className="w-16 h-1.5 bg-[#E8E0D6] rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#62564C] rounded-full"
                    style={{ width: `${currentLead.icpScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D6] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#39342F] block">Lead Intent Score</span>
                <span className="text-[11px] text-[#736B63]">Propensity to purchase</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#8E7252] font-mono">{currentLead.intentScore}%</span>
                <div className="w-16 h-1.5 bg-[#E8E0D6] rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#B69A78] rounded-full"
                    style={{ width: `${currentLead.intentScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Store Walkout Context & SOP Script */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#39342F] uppercase tracking-wider">
              <Target size={14} className="text-[#8E7252]" />
              <span>Recommended Telecaller SOP Pitch</span>
            </div>
            <div className="p-3 bg-[#F7F2EC] border border-[#E8E0D6] rounded-xl text-xs text-[#39342F] leading-relaxed">
              <div className="flex items-center gap-1 font-semibold text-[#8E7252] mb-1">
                <Sparkles size={13} className="text-[#B69A78]" />
                <span>On-Ground Pitch Rule: Name the shopper (+23.6pp lift)</span>
              </div>
              <p className="italic font-medium text-[#554D46]">"{currentLead.recommendedPitch}"</p>
            </div>
          </div>

          {/* Collapsible Buying Signals */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#39342F] uppercase tracking-wider">
                Collapsible Buying Signals ({currentLead.signals.length})
              </span>
              <span className="text-[11px] text-[#938A82]">Extracted from offline store conversation</span>
            </div>

            <div className="space-y-2">
              {currentLead.signals.map((sig, idx) => {
                const isExpanded = expandedSignals[sig.category] ?? true;
                return (
                  <div
                    key={idx}
                    className="border border-[#E8E0D6] rounded-xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSignal(sig.category)}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F5EFE8] flex items-center justify-between text-left transition"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#39342F]">
                        {getSignalIcon(sig.icon)}
                        <span>{sig.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                            sig.severity === 'high'
                              ? 'bg-[#F9ECE7] text-[#934938] border-[#EDD3CB]'
                              : 'bg-white text-[#736B63] border-[#E8E0D6]'
                          }`}
                        >
                          {sig.severity} impact
                        </span>
                        {isExpanded ? <ChevronUp size={14} className="text-[#938A82]" /> : <ChevronDown size={14} className="text-[#938A82]" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 py-2.5 bg-white text-xs text-[#554D46] leading-relaxed border-t border-[#E8E0D6]">
                        {sig.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Calling Actions */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8E0D6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateLeadModal('prev')}
              className="px-3 py-1.5 text-xs font-medium text-[#736B63] hover:text-[#39342F] bg-white border border-[#E8E0D6] rounded-lg hover:bg-[#FAF7F2] transition flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => navigateLeadModal('next')}
              className="px-3 py-1.5 text-xs font-medium text-[#736B63] hover:text-[#39342F] bg-white border border-[#E8E0D6] rounded-lg hover:bg-[#FAF7F2] transition flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTelCall}
              className="px-3.5 py-2 text-xs font-semibold text-[#39342F] bg-white border border-[#E8E0D6] hover:bg-[#FAF7F2] rounded-xl transition flex items-center gap-1.5"
              title="Open device native dialer"
            >
              <ExternalLink size={14} />
              <span>Phone Call (tel:)</span>
            </button>

            <button
              onClick={handleInAppCall}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#62564C] hover:bg-[#52473E] rounded-xl shadow-xs transition flex items-center gap-2 active:scale-95"
            >
              <Phone size={15} className="text-[#B69A78]" />
              <span>In-App Call Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
