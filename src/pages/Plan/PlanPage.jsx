import React from 'react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D6] pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#39342F] tracking-tight">
            Outbound & Inbound Call Planner
          </h1>
          <p className="text-xs md:text-sm text-[#736B63] mt-0.5">
            Manage your daily calling queue, incoming walk-out callbacks, and recent call reviews.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-[#F2ECE3] p-1 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none border border-[#E8E0D6]">
          <button
            onClick={() => setTab('calls')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'calls'
                ? 'bg-white text-[#39342F] shadow-xs'
                : 'text-[#736B63] hover:text-[#39342F]'
            }`}
          >
            <PhoneCall size={14} className={currentTab === 'calls' ? 'text-[#B69A78]' : ''} />
            <span>Calls to Make</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] font-mono text-[#736B63] border border-[#E8E0D6]">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setTab('incoming')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'incoming'
                ? 'bg-white text-[#39342F] shadow-xs'
                : 'text-[#736B63] hover:text-[#39342F]'
            }`}
          >
            <PhoneIncoming size={14} className={currentTab === 'incoming' ? 'text-[#934938]' : ''} />
            <span>Incoming</span>
            {pendingIncomingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F9ECE7] text-[#934938] font-bold border border-[#EDD3CB]">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('recent')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'recent'
                ? 'bg-white text-[#39342F] shadow-xs'
                : 'text-[#736B63] hover:text-[#39342F]'
            }`}
          >
            <Clock size={14} className={currentTab === 'recent' ? 'text-[#62564C]' : ''} />
            <span>Recent</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] font-mono text-[#736B63] border border-[#E8E0D6]">
              {recentCalls.length}
            </span>
          </button>

          <button
            onClick={() => setTab('practise')}
            className={`px-3.5 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1.5 ${
              currentTab === 'practise'
                ? 'bg-white text-[#39342F] shadow-xs'
                : 'text-[#736B63] hover:text-[#39342F]'
            }`}
          >
            <Sparkles size={14} className="text-[#B69A78]" />
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
