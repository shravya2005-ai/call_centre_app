import React from 'react';
import {
  Sparkles,
  Bot,
  Hash,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const PulseHome = ({ onSelectChannel }) => {
  const { aiAgents, channels } = useAppData();

  const kudosList = [
    {
      id: 'k-1',
      recipient: 'Akshat Rajan (You)',
      author: 'Rashmi Sehgal (CEO)',
      badge: '🎯 Naming Shopper Champion',
      text: 'Superb conversion lift today! Closed ₹92,000 Elev8 Recliner with zero price discounting.',
      time: '1h ago'
    },
    {
      id: 'k-2',
      recipient: 'Priya Sharma',
      author: 'Mukunda Dwarkanath (Co-founder)',
      badge: '⚡ Speed Callback Hero',
      text: 'Recovered a Furnishka dining room walk-out within 7 minutes of store exit.',
      time: '3h ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AvaniBot Hero Banner */}
      <div className="bg-[#62564C] text-white rounded-2xl p-6 border border-[#52473E] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52473E] text-[#FAF7F2] border border-[#76675B] text-xs font-semibold">
              <Sparkles size={14} className="text-[#B69A78]" />
              <span>AvaniBot • Autonomous Store Intelligence</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              One AI Agent that creates the role agents every offline store needs.
            </h1>
            <p className="text-xs text-[#D4C9BD] max-w-2xl leading-relaxed">
              Monitoring floor walk-outs, calculating real-time shopper intent, enforcing telecaller SOP adherence, and syncing store inventory across enterprise partners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#52473E] px-4 py-3 rounded-xl border border-[#6B5E53] text-center">
              <span className="text-xs text-[#D4C9BD] block">Enterprise Impact</span>
              <span className="text-xl font-bold text-[#B69A78] font-mono">+23.6pp</span>
              <span className="text-[10px] text-[#E8E0D6] block">Shopper name lift</span>
            </div>
            <div className="bg-[#52473E] px-4 py-3 rounded-xl border border-[#6B5E53] text-center">
              <span className="text-xs text-[#D4C9BD] block">Active AI Agents</span>
              <span className="text-xl font-bold text-white font-mono">5 Roles</span>
              <span className="text-[10px] text-[#E8E0D6] block">Autonomous</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Role Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#39342F] uppercase tracking-wider flex items-center gap-2">
            <Bot size={16} className="text-[#62564C]" />
            <span>AI Role Agents & Task Automation</span>
          </h2>
          <span className="text-xs text-[#736B63]">Real-time status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs flex flex-col justify-between hover:border-[#B69A78]/50 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#62564C] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E8E0D6]">
                    {agent.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF3EE] text-[#47634B] border border-[#D4DFD5] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8EAA91] animate-pulse" />
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#39342F]">{agent.name}</h3>
                <p className="text-xs text-[#736B63] mt-1.5 leading-relaxed">{agent.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E0D6]/60 flex items-center justify-between text-xs">
                <span className="text-[#736B63] font-medium">{agent.metrics}</span>
                <span className="font-semibold text-[#8E7252] font-mono">{agent.efficiency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Channels & Kudos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Channels List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#39342F]">Collaboration Channels</h3>
              <p className="text-xs text-[#736B63]">Cross-store telecaller discussions and escalations</p>
            </div>
            <span className="text-xs text-[#938A82]">Click to enter chat</span>
          </div>

          <div className="space-y-3">
            {channels.map((chan) => (
              <div
                key={chan.id}
                onClick={() => onSelectChannel(chan.id)}
                className="p-4 rounded-xl border border-[#E8E0D6] hover:border-[#62564C] hover:bg-[#FAF7F2] cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] group-hover:bg-[#62564C] group-hover:text-[#FAF7F2] transition flex items-center justify-center text-[#62564C] font-bold border border-[#E8E0D6]">
                    <Hash size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#39342F] group-hover:text-[#62564C] transition">
                        {chan.name}
                      </span>
                      {chan.pinnedInputCard && !chan.pinnedInputCard.resolved && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9ECE7] text-[#934938] font-bold border border-[#EDD3CB]">
                          Needs Input
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#736B63] mt-0.5 line-clamp-1">{chan.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {chan.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#62564C] text-white text-[10px] font-bold">
                      {chan.unreadCount} unread
                    </span>
                  )}
                  <ArrowRight size={14} className="text-[#B69A78] group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Kudos & Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#B69A78]" />
              <h3 className="text-sm font-bold text-[#39342F]">Kudos & Team Recognition</h3>
            </div>
            <span className="text-xs text-[#938A82]">Shift Feed</span>
          </div>

          <div className="space-y-3">
            {kudosList.map((k) => (
              <div
                key={k.id}
                className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D6] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#39342F]">{k.recipient}</span>
                  <span className="text-[10px] text-[#938A82] font-mono">{k.time}</span>
                </div>
                <div className="inline-block px-2 py-0.5 rounded-md bg-white border border-[#E8E0D6] text-[#62564C] font-semibold text-[11px]">
                  {k.badge}
                </div>
                <p className="text-[#554D46] italic">"{k.text}"</p>
                <div className="text-[10px] text-[#938A82] text-right">From: {k.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
