import React from 'react';
import { PhoneIncoming, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useCall } from '../../context/CallContext';

export const IncomingTab = () => {
  const { incomingCalls } = useAppData();
  const { startCall } = useCall();

  const handleCallBack = (item) => {
    startCall(
      {
        name: item.name,
        phone: item.phone,
        brand: item.brand,
        product: item.product,
        incomingId: item.id,
        isCallback: true
      },
      'demo'
    );
  };

  const pendingCalls = incomingCalls.filter((c) => c.status !== 'Resolved');
  const resolvedCalls = incomingCalls.filter((c) => c.status === 'Resolved');

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E0D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#934938] text-white">
              <PhoneIncoming size={16} />
            </span>
            <h2 className="text-base font-bold text-[#39342F]">Incoming & Missed Calls Queue</h2>
          </div>
          <p className="text-xs text-[#736B63] mt-1">
            Shoppers who rang after visiting physical experience stores. Priority given to high-stake basket sizes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-[#F9ECE7] text-[#934938] font-semibold border border-[#EDD3CB]">
            {pendingCalls.length} Pending Callbacks
          </span>
          <span className="px-3 py-1 rounded-full bg-[#EFF3EE] text-[#47634B] font-semibold border border-[#D4DFD5]">
            {resolvedCalls.length} Resolved
          </span>
        </div>
      </div>

      {/* Missed Calls Table */}
      <div className="bg-white rounded-2xl border border-[#E8E0D6] shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-[#FAF7F2] border-b border-[#E8E0D6] flex items-center justify-between text-xs font-semibold text-[#736B63] uppercase tracking-wider">
          <span>Caller & Store Context</span>
          <span>Value at Stake & Callback Action</span>
        </div>

        {incomingCalls.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 size={36} className="text-[#8EAA91] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#39342F]">All missed calls cleared!</h4>
            <p className="text-xs text-[#736B63] mt-1">Great job! No pending customer callbacks.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E0D6]/60">
            {incomingCalls.map((item) => {
              const isResolved = item.status === 'Resolved';
              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isResolved ? 'bg-[#FAF7F2]/40 opacity-70' : 'hover:bg-[#FAF7F2]/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isResolved
                          ? 'bg-[#F2ECE3] text-[#736B63]'
                          : 'bg-[#F9ECE7] text-[#934938] animate-soft-pulse'
                      }`}
                    >
                      <PhoneIncoming size={18} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#39342F]">{item.name}</span>
                        <span className="text-xs font-mono text-[#938A82]">{item.phone}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            item.status === 'High Urgency'
                              ? 'bg-[#F9ECE7] text-[#934938] border-[#EDD3CB]'
                              : item.status === 'Resolved'
                              ? 'bg-[#EFF3EE] text-[#47634B] border-[#D4DFD5]'
                              : 'bg-[#F5EFE8] text-[#8E7252] border-[#E8E0D6]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#736B63] flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-semibold text-[#62564C]">{item.brand}</span>
                        <span className="text-[#D4C9BD]">•</span>
                        <span>{item.product}</span>
                        <span className="text-[#D4C9BD]">•</span>
                        <span className="text-[#938A82] text-[11px] flex items-center gap-1">
                          <Clock size={11} /> Missed {item.time}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-[#554D46] mt-1.5 bg-[#FAF7F2] p-2 rounded-md border border-[#E8E0D6]/60">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Value and Working Call Back Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right sm:mr-3">
                      <span className="text-[10px] uppercase font-bold text-[#938A82] block tracking-wider">
                        Value at Stake
                      </span>
                      <span className="text-sm font-bold font-mono text-[#39342F]">
                        {item.valueAtStake}
                      </span>
                    </div>

                    {!isResolved ? (
                      <button
                        onClick={() => handleCallBack(item)}
                        className="px-4 py-2 rounded-xl bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                      >
                        <Phone size={13} className="text-[#B69A78]" />
                        <span>Call Back</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#47634B] font-semibold flex items-center gap-1 px-3 py-1.5 bg-[#EFF3EE] rounded-xl border border-[#D4DFD5]">
                        <CheckCircle2 size={14} /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
