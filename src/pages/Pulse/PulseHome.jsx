import React from 'react';
import {
  Sparkles,
  Bot,
  Hash,
  Award,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  Users,
  Shield,
  MessageSquare
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
      <div className="bg-gradient-to-br from-[#0e3025] to-[#09221a] text-white rounded-2xl p-6 border border-[#1b4d3c] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Sparkles size={14} className="text-amber-400" />
              <span>AvaniBot • Autonomous Store Intelligence</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              One AI Agent that creates the role agents every offline store needs.
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Monitoring floor walk-outs, calculating real-time shopper intent, enforcing telecaller SOP adherence, and syncing store inventory across enterprise partners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#143d30] px-4 py-3 rounded-xl border border-[#225544] text-center">
              <span className="text-xs text-slate-400 block">Enterprise Impact</span>
              <span className="text-xl font-bold text-amber-400 font-mono">+23.6pp</span>
              <span className="text-[10px] text-emerald-300 block">Shopper name lift</span>
            </div>
            <div className="bg-[#143d30] px-4 py-3 rounded-xl border border-[#225544] text-center">
              <span className="text-xs text-slate-400 block">Active AI Agents</span>
              <span className="text-xl font-bold text-white font-mono">5 Roles</span>
              <span className="text-[10px] text-emerald-300 block">Autonomous</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Role Agents Grid (1 Walk-out Recovery, 2 Pitch Coach, 3 ASM Agent, 4 Tele-caller, 5 Follow-up) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bot size={16} className="text-emerald-700" />
            <span>AI Role Agents & Task Automation</span>
          </h2>
          <span className="text-xs text-slate-500">Real-time status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {agent.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{agent.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{agent.metrics}</span>
                <span className="font-semibold text-amber-700 font-mono">{agent.efficiency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Channels & Kudos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Channels List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Collaboration Channels</h3>
              <p className="text-xs text-slate-500">Cross-store telecaller discussions and escalations</p>
            </div>
            <span className="text-xs text-slate-400">Click to enter chat</span>
          </div>

          <div className="space-y-3">
            {channels.map((chan) => (
              <div
                key={chan.id}
                onClick={() => onSelectChannel(chan.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0e3025] hover:bg-slate-50/80 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#0e3025] group-hover:text-amber-400 transition flex items-center justify-center text-slate-700 font-bold">
                    <Hash size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition">
                        {chan.name}
                      </span>
                      {chan.pinnedInputCard && !chan.pinnedInputCard.resolved && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold animate-pulse">
                          Needs Input
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{chan.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {chan.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#0e3025] text-white text-[10px] font-bold">
                      {chan.unreadCount} unread
                    </span>
                  )}
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Kudos & Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Kudos & Team Recognition</h3>
            </div>
            <span className="text-xs text-slate-400">Shift Feed</span>
          </div>

          <div className="space-y-3">
            {kudosList.map((k) => (
              <div
                key={k.id}
                className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{k.recipient}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{k.time}</span>
                </div>
                <div className="inline-block px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 font-semibold text-[11px]">
                  {k.badge}
                </div>
                <p className="text-slate-600 italic">"{k.text}"</p>
                <div className="text-[10px] text-slate-400 text-right">From: {k.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
