import React, { useState } from 'react';
import {
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight
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
      <div className="bg-white p-4 rounded-2xl border border-[#E8E0D6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-[#938A82]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search leads by name, phone, product..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl text-[#39342F] placeholder:text-[#938A82] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-[#F2ECE3] p-0.5 rounded-lg border border-[#E8E0D6]">
            {['All', 'Hot', 'Warm', 'Cold'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPriorityFilter(p);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  priorityFilter === p
                    ? 'bg-white text-[#39342F] shadow-xs'
                    : 'text-[#736B63] hover:text-[#39342F]'
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
            className="px-2.5 py-1 text-xs bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
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
      <div className="bg-white rounded-2xl border border-[#E8E0D6] shadow-xs overflow-hidden">
        <div className="divide-y divide-[#E8E0D6]/60">
          {paginatedLeads.length === 0 ? (
            <div className="p-8 text-center text-[#736B63] text-xs">
              No leads match your search criteria.
            </div>
          ) : (
            paginatedLeads.map((lead) => {
              const isExpanded = expandedLeadId === lead.id;
              return (
                <div key={lead.id} className="transition hover:bg-[#FAF7F2]/60">
                  {/* Lead Main Row */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Score Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-[#F5EFE8] border border-[#E8E0D6] shrink-0">
                        <span className="text-sm font-bold text-[#62564C] font-mono leading-none">
                          {lead.score}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-[#8E7252] mt-0.5">
                          Score
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => openLeadModal(lead.id)}
                            className="text-sm font-bold text-[#39342F] hover:text-[#62564C] hover:underline cursor-pointer"
                          >
                            {lead.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                              lead.priority === 'Hot'
                                ? 'bg-[#F9ECE7] text-[#934938] border-[#EDD3CB]'
                                : 'bg-[#F5EFE8] text-[#8E7252] border-[#E8E0D6]'
                            }`}
                          >
                            {lead.priority}
                          </span>
                          <span className="text-xs text-[#938A82] font-mono hidden md:inline">
                            {lead.phone}
                          </span>
                        </div>

                        <div className="text-xs text-[#736B63] flex flex-wrap items-center gap-2 mt-1">
                          <span className="font-semibold text-[#62564C]">{lead.brand}</span>
                          <span className="text-[#D4C9BD]">•</span>
                          <span>{lead.product}</span>
                          <span className="text-[#D4C9BD]">•</span>
                          <span className="text-[#736B63] text-[11px] flex items-center gap-1">
                            <Clock size={11} /> {lead.visitedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Value */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right sm:mr-2">
                        <span className="text-xs font-bold text-[#39342F] font-mono block">
                          {lead.valueAtStake}
                        </span>
                        <span className="text-[10px] text-[#736B63] font-medium">
                          ICP: {lead.icpScore}%
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpand(lead.id)}
                        className="p-2 rounded-lg text-[#736B63] hover:bg-[#FAF7F2] transition text-xs flex items-center gap-1"
                        title="Expand visit notes"
                      >
                        <span className="text-[11px] hidden lg:inline">
                          {isExpanded ? 'Less' : 'Context'}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <button
                        onClick={() => openLeadModal(lead.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#E8E0D6] text-[#39342F] hover:bg-[#FAF7F2] text-xs font-semibold transition"
                      >
                        SOP Guide
                      </button>

                      <button
                        onClick={() => startCall(lead, 'demo')}
                        className="px-4 py-1.5 rounded-xl bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                      >
                        <Phone size={13} className="text-[#B69A78]" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Context Row */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 bg-[#FAF7F2] border-t border-[#E8E0D6] text-xs space-y-2 animate-in fade-in">
                      <div className="p-3 bg-[#F7F2EC] border border-[#E8E0D6] rounded-xl text-[#39342F]">
                        <div className="font-semibold text-[#8E7252] flex items-center gap-1 mb-1">
                          <Sparkles size={12} className="text-[#B69A78]" />
                          <span>Offline Store Walk-Out Context</span>
                        </div>
                        <p className="text-[#554D46]">{lead.agentNotes}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#39342F]">
                        <div className="bg-white p-2.5 rounded-lg border border-[#E8E0D6]">
                          <span className="font-semibold text-[#39342F] block mb-0.5">Top Buying Signal</span>
                          <p className="text-[#736B63]">{lead.signals[0]?.content}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#E8E0D6]">
                          <span className="font-semibold text-[#39342F] block mb-0.5">Recommended Pitch</span>
                          <p className="text-[#62564C] italic">"{lead.recommendedPitch}"</p>
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
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E0D6] flex items-center justify-between text-xs text-[#736B63]">
          <div>
            Showing <span className="font-semibold text-[#39342F]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-[#39342F]">
              {Math.min(currentPage * pageSize, filteredLeads.length)}
            </span>{' '}
            of <span className="font-semibold text-[#39342F]">{filteredLeads.length}</span> ranked leads
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E0D6] hover:bg-[#F2ECE3] disabled:opacity-40 disabled:hover:bg-white text-[#39342F] font-medium transition flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="font-mono font-medium px-2 text-[#39342F]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E0D6] hover:bg-[#F2ECE3] disabled:opacity-40 disabled:hover:bg-white text-[#39342F] font-medium transition flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
