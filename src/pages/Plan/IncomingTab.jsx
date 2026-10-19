import React from 'react';
import { PhoneIncoming, Phone, Clock, AlertTriangle, CheckCircle2, Building, ArrowUpRight } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useCall } from '../../context/CallContext';

export const IncomingTab = () => {
  const { incomingCalls, resolveIncomingCall } = useAppData();
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
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-rose-500 text-white">
              <PhoneIncoming size={16} />
            </span>
            <h2 className="text-base font-bold text-slate-900">Incoming & Missed Calls Queue</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Shoppers who rang after visiting physical experience stores. Priority given to high-stake basket sizes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200">
            {pendingCalls.length} Pending Callbacks
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
            {resolvedCalls.length} Resolved
          </span>
        </div>
      </div>

      {/* Missed Calls Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <span>Caller & Store Context</span>
          <span>Value at Stake & Callback Action</span>
        </div>

        {incomingCalls.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">All missed calls cleared!</h4>
            <p className="text-xs text-slate-500 mt-1">Great job! No pending customer callbacks.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {incomingCalls.map((item) => {
              const isResolved = item.status === 'Resolved';
              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isResolved ? 'bg-slate-50/40 opacity-70' : 'hover:bg-amber-50/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isResolved
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-rose-100 text-rose-700 animate-soft-pulse'
                      }`}
                    >
                      <PhoneIncoming size={18} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{item.name}</span>
                        <span className="text-xs font-mono text-slate-500">{item.phone}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            item.status === 'High Urgency'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-semibold text-emerald-900">{item.brand}</span>
                        <span className="text-slate-300">•</span>
                        <span>{item.product}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock size={11} /> Missed {item.time}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-1.5 rounded-md">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Value and Working Call Back Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right sm:mr-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Value at Stake
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-800">
                        {item.valueAtStake}
                      </span>
                    </div>

                    {!isResolved ? (
                      <button
                        onClick={() => handleCallBack(item)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <Phone size={13} />
                        <span>Call Back</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-xl">
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
