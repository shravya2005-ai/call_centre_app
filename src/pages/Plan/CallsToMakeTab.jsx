import React, { useState } from 'react';
import {
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  Building,
  Target,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useCall } from '../../context/CallContext';

export const CallsToMakeTab = () => {
  const { leads, openLeadModal } = useAppData();
  const { startCall } = useCall();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [expandedLeadId, setExpandedLeadId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter leads
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.product.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        priorityFilter === 'All' ? true : lead.priority === priorityFilter;

      const matchesBrand =
        brandFilter === 'All' ? true : lead.brand === brandFilter;

      return matchesSearch && matchesPriority && matchesBrand;
    })
    .sort((a, b) => b.score - a.score); // Ranked by score

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleExpand = (leadId) => {
    setExpandedLeadId((prev) => (prev === leadId ? null : leadId));
  };

  const brands = ['All', 'The Sleep Company', 'Furnishka', 'Duroflex', 'Tractor Junction', 'Nestasia'];

  return (
    <div className="space-y-4">
      {/* Controls: Search, Filters, Stats */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search leads by name, phone, product..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e3025]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {['All', 'Hot', 'Warm', 'Cold'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPriorityFilter(p);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  priorityFilter === p
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Brand select */}
          <select
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Brands' : b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {paginatedLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No leads match your search criteria.
            </div>
          ) : (
            paginatedLeads.map((lead) => {
              const isExpanded = expandedLeadId === lead.id;
              return (
                <div key={lead.id} className="transition hover:bg-slate-50/50">
                  {/* Lead Main Row */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Score Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 shrink-0">
                        <span className="text-sm font-bold text-emerald-800 font-mono leading-none">
                          {lead.score}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-emerald-600 mt-0.5">
                          Score
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => openLeadModal(lead.id)}
                            className="text-sm font-bold text-slate-900 hover:text-emerald-800 hover:underline cursor-pointer"
                          >
                            {lead.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                              lead.priority === 'Hot'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {lead.priority}
                          </span>
                          <span className="text-xs text-slate-400 font-mono hidden md:inline">
                            {lead.phone}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 mt-1">
                          <span className="font-semibold text-emerald-900">{lead.brand}</span>
                          <span className="text-slate-300">•</span>
                          <span>{lead.product}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 text-[11px] flex items-center gap-1">
                            <Clock size={11} /> {lead.visitedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Value */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right sm:mr-2">
                        <span className="text-xs font-bold text-slate-900 font-mono block">
                          {lead.valueAtStake}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          ICP: {lead.icpScore}%
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpand(lead.id)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition text-xs flex items-center gap-1"
                        title="Expand visit notes"
                      >
                        <span className="text-[11px] hidden lg:inline">
                          {isExpanded ? 'Less' : 'Context'}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <button
                        onClick={() => openLeadModal(lead.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                      >
                        SOP Guide
                      </button>

                      <button
                        onClick={() => startCall(lead, 'demo')}
                        className="px-4 py-1.5 rounded-xl bg-[#0e3025] hover:bg-[#164235] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Context Row */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 bg-slate-50/80 border-t border-slate-100 text-xs space-y-2 animate-in fade-in">
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-950">
                        <div className="font-semibold text-amber-800 flex items-center gap-1 mb-1">
                          <Sparkles size={12} />
                          <span>Offline Store Walk-Out Context</span>
                        </div>
                        <p>{lead.agentNotes}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-900 block mb-0.5">Top Buying Signal</span>
                          <p className="text-slate-600">{lead.signals[0]?.content}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-900 block mb-0.5">Recommended Pitch</span>
                          <p className="text-emerald-900 italic">"{lead.recommendedPitch}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Working Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * pageSize, filteredLeads.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{filteredLeads.length}</span> ranked leads
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium transition flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="font-mono font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium transition flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
