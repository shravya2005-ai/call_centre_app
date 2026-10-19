import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PhoneCall, PhoneIncoming, Clock, Sparkles } from 'lucide-react';
import { CallsToMakeTab } from './CallsToMakeTab';
import { IncomingTab } from './IncomingTab';
import { RecentTab } from './RecentTab';
import { PractiseCallTab } from './PractiseCallTab';
import { useAppData } from '../../context/AppDataContext';

export const PlanPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'calls';
  const { incomingCalls, recentCalls, leads } = useAppData();

  const pendingIncomingCount = incomingCalls.filter((c) => c.status !== 'Resolved').length;

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="space-y-6">
      {/* Plan Header with Sub-tabs navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Outbound & Inbound Call Planner
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage your daily calling queue, incoming walk-out callbacks, and recent call reviews.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setTab('calls')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'calls'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall size={14} className={currentTab === 'calls' ? 'text-emerald-700' : ''} />
            <span>Calls to Make</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 font-mono text-slate-700">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setTab('incoming')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'incoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneIncoming size={14} className={currentTab === 'incoming' ? 'text-rose-600' : ''} />
            <span>Incoming</span>
            {pendingIncomingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('recent')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'recent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={14} className={currentTab === 'recent' ? 'text-blue-600' : ''} />
            <span>Recent</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 font-mono text-slate-700">
              {recentCalls.length}
            </span>
          </button>

          <button
            onClick={() => setTab('practise')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'practise'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Practise Call</span>
          </button>
        </div>
      </div>

      {/* Tab View Render */}
      <div>
        {currentTab === 'calls' && <CallsToMakeTab />}
        {currentTab === 'incoming' && <IncomingTab />}
        {currentTab === 'recent' && <RecentTab />}
        {currentTab === 'practise' && <PractiseCallTab />}
      </div>
    </div>
  );
};
