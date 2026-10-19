import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Building,
  User,
  Calendar,
  ExternalLink,
  Target,
  BarChart3,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useAppData } from '../../context/AppDataContext';
import { useCall } from '../../context/CallContext';

export const DashboardPage = () => {
  const { kpis, leads, openLeadModal, chartData } = useAppData();
  const { startCall, setIsDialPadOpen } = useCall();
  const [chartMetric, setChartMetric] = useState('calls'); // 'calls' | 'revenue'

  // Top waiting leads (Score > 85 and status Pending or In Progress)
  const waitingLeads = leads.filter((l) => l.score >= 85 && l.status !== 'Closed').slice(0, 3);

  // Actionable task items
  const taskLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Shift Greeting & Target Progress Header */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Shift Live • 4h 12m elapsed
              </span>
              <span className="text-xs text-slate-500 font-mono">Queue: The Sleep Company & Furnishka</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Good morning, Akshat
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              You have <span className="font-semibold text-amber-700">{waitingLeads.length} high-intent walk-outs</span> waiting for follow-up before competitor quotes expire.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDialPadOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5"
            >
              <Phone size={14} className="text-emerald-700" />
              <span>Dial Pad</span>
            </button>
            <button
              onClick={() => openLeadModal(waitingLeads[0]?.id || leads[0]?.id)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0e3025] hover:bg-[#164235] text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Start Priority Queue</span>
            </button>
          </div>
        </div>

        {/* Daily Target Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Daily Shift Incentive Milestone</span>
              <span className="text-amber-700 font-bold font-mono">
                {kpis.myEarningsToday} / {kpis.targetGoal}
              </span>
            </div>
            <span className="text-slate-500 font-medium">
              {kpis.targetProgressPercent}% achieved ({kpis.conversionsToday} sales closed)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-amber-500 to-amber-600 rounded-full transition-all duration-700"
              style={{ width: `${kpis.targetProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Leads</span>
            <Target size={15} className="text-emerald-700" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {kpis.totalLeadsAssigned}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span>{kpis.contactedToday} contacted today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Calls Made</span>
            <PhoneCall size={15} className="text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {kpis.callsMadeToday}
          </div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">
            {kpis.connectRate} connect rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Conversions</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {kpis.conversionsToday}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-bold">
            {kpis.conversionLift} naming lift
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tasks Pending</span>
            <Clock size={15} className="text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {kpis.pendingTasksCount}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            3 urgent walkouts
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Today's Incentive</span>
            <Flame size={15} className="text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700 font-mono">
            {kpis.myEarningsToday}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Monthly: {kpis.monthlyEarnings}
          </div>
        </div>
      </div>

      {/* "Who is Waiting / Needs Attention" Section */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500 text-white">
              <AlertTriangle size={15} />
            </span>
            <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Who is Waiting — High-Intent Walk-Outs (Next 30 Mins)
            </h2>
          </div>
          <span className="text-xs text-amber-800 font-medium">
            Offline store exit detected by On-Ground Sensor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {waitingLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{lead.name}</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {lead.score} pts
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building size={12} className="text-slate-400" />
                  <span>{lead.brand}</span>
                  <span>•</span>
                  <span>{lead.product}</span>
                </div>
                <p className="text-[11px] text-amber-900 mt-2 bg-amber-50 p-2 rounded-lg leading-relaxed line-clamp-2">
                  {lead.signals[0]?.content || lead.timeline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openLeadModal(lead.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                >
                  View Details & SOP
                </button>
                <button
                  onClick={() => startCall(lead, 'demo')}
                  className="px-3 py-1.5 rounded-lg bg-[#0e3025] hover:bg-[#164235] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Phone size={12} />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Actionable Tasks List & 7-Day Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Actionable Tasks (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Priority Task Queue</h2>
              <p className="text-xs text-slate-500">Ranked by Lead Intent & ICP Score</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click task to view modal</span>
          </div>

          <div className="divide-y divide-slate-100">
            {taskLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => openLeadModal(lead.id)}
                className="py-3.5 px-3 -mx-3 rounded-xl hover:bg-slate-50/80 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#0e3025] group-hover:text-white transition flex items-center justify-center font-bold text-xs text-slate-700">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-900 transition">
                        {lead.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                          lead.priority === 'Hot'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{lead.brand}</span>
                      <span>•</span>
                      <span className="text-slate-400">{lead.visitedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 font-mono">{lead.valueAtStake}</span>
                    <div className="text-[10px] text-emerald-700 font-medium">ICP: {lead.icpScore}%</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startCall(lead, 'demo');
                    }}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition"
                    title="Call directly"
                  >
                    <Phone size={14} />
                  </button>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Earnings Summary & 7-Day Performance Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Earnings & Deal Summary Card (Matching PDF page 4 screenshot) */}
          <div className="bg-gradient-to-br from-[#0e3025] to-[#09221a] text-white rounded-2xl p-5 border border-[#1b4d3c] shadow-md">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-2">
              <span>My Earnings & Targets</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Oct 2026
              </span>
            </div>

            <div className="text-3xl font-bold font-mono text-amber-400">
              {kpis.myEarningsToday}
            </div>
            <p className="text-xs text-slate-300 mt-1">Earned during current shift so far</p>

            <div className="mt-4 pt-4 border-t border-[#1b4d3c] grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#143d30] p-2.5 rounded-xl border border-[#225544]">
                <span className="text-slate-400 block text-[11px]">Closed Deals</span>
                <span className="text-sm font-bold text-white font-mono">{kpis.conversionsToday} sales</span>
              </div>
              <div className="bg-[#143d30] p-2.5 rounded-xl border border-[#225544]">
                <span className="text-slate-400 block text-[11px]">Revenue Closed</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">{kpis.revenueClosedToday}</span>
              </div>
            </div>
          </div>

          {/* Interactive 7-Day Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">7-Day Performance</h3>
                <p className="text-xs text-slate-500">Daily calls & conversion trends</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setChartMetric('calls')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    chartMetric === 'calls'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Calls
                </button>
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    chartMetric === 'revenue'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sales (₹)
                </button>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMetric === 'calls' ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0e3025',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="calls" fill="#0e3025" radius={[4, 4, 0, 0]} name="Total Calls" />
                    <Bar dataKey="connected" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Connected" />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: '#0e3025',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#059669"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
