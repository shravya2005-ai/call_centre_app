import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { CallReviewDrawer } from './CallReviewDrawer';

export const RecentTab = () => {
  const { recentCalls } = useAppData();
  const [selectedCall, setSelectedCall] = useState(null);
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredCalls = recentCalls.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.brand.toLowerCase().includes(search.toLowerCase());

    const matchesOutcome = outcomeFilter === 'All' ? true : c.outcome === outcomeFilter;
    const matchesType = typeFilter === 'All' ? true : c.type.includes(typeFilter);

    return matchesSearch && matchesOutcome && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recent calls by name, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e3025]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Outcomes</option>
            <option value="Order Closed">Order Closed</option>
            <option value="Follow-up Scheduled">Follow-up Scheduled</option>
            <option value="Callback Requested">Callback Requested</option>
            <option value="Not Interested">Not Interested</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Outbound">Outbound</option>
            <option value="Inbound">Inbound</option>
          </select>
        </div>
      </div>

      {/* Calls List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <span>Caller & Conversation Time</span>
          <span className="hidden sm:inline">Outcome & SOP Score</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCalls.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No recent calls match the filters.</div>
          ) : (
            filteredCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 cursor-pointer transition group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      call.outcome === 'Order Closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <PhoneCall size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                        {call.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                        {call.phone}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {call.type}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-700">{call.brand}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {call.duration}
                      </span>
                      <span>•</span>
                      <span>{call.dateTime}</span>
                    </div>
                  </div>
                </div>

                {/* Outcome & Review action */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        call.outcome === 'Order Closed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {call.outcome}
                    </span>
                    {call.valueClosed && call.valueClosed !== '₹0' && (
                      <span className="block text-xs font-mono font-bold text-emerald-700 mt-1">
                        +{call.valueClosed}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCall(call);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 group-hover:bg-[#0e3025] group-hover:text-white group-hover:border-[#0e3025] text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Headphones size={13} />
                    <span>Review</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Slide-over Panel */}
      {selectedCall && (
        <CallReviewDrawer
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
};
