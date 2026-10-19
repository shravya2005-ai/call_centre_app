import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Building,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  CartesianGrid
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
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E8E0D6] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F5EFE8] text-[#8E7252] border border-[#E8E0D6]">
                Shift Live • 4h 12m elapsed
              </span>
              <span className="text-xs text-[#736B63] font-mono">Queue: The Sleep Company & Furnishka</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#39342F] tracking-tight mt-1.5">
              Good morning, Akshat
            </h1>
            <p className="text-xs md:text-sm text-[#736B63] mt-0.5">
              You have <span className="font-semibold text-[#8E7252]">{waitingLeads.length} high-intent walk-outs</span> waiting for follow-up before competitor quotes expire.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDialPadOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE3] text-[#39342F] border border-[#E8E0D6] transition flex items-center gap-1.5"
            >
              <Phone size={14} className="text-[#8E7252]" />
              <span>Dial Pad</span>
            </button>
            <button
              onClick={() => openLeadModal(waitingLeads[0]?.id || leads[0]?.id)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#62564C] hover:bg-[#52473E] text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-[#B69A78]" />
              <span>Start Priority Queue</span>
            </button>
          </div>
        </div>

        {/* Daily Target Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#E8E0D6]/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#39342F]">Daily Shift Incentive Milestone</span>
              <span className="text-[#8E7252] font-bold font-mono">
                {kpis.myEarningsToday} / {kpis.targetGoal}
              </span>
            </div>
            <span className="text-[#736B63] font-medium">
              {kpis.targetProgressPercent}% achieved ({kpis.conversionsToday} sales closed)
            </span>
          </div>
          <div className="w-full bg-[#F2ECE3] h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B69A78] rounded-full transition-all duration-700"
              style={{ width: `${kpis.targetProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-xs">
          <div className="flex items-center justify-between text-[#736B63] text-xs font-medium">
            <span>Total Leads</span>
            <Target size={15} className="text-[#B69A78]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#39342F] font-mono">
            {kpis.totalLeadsAssigned}
          </div>
          <div className="mt-1 text-[11px] text-[#736B63] font-medium">
            {kpis.contactedToday} contacted today
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-xs">
          <div className="flex items-center justify-between text-[#736B63] text-xs font-medium">
            <span>Calls Made</span>
            <PhoneCall size={15} className="text-[#8E7252]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#39342F] font-mono">
            {kpis.callsMadeToday}
          </div>
          <div className="mt-1 text-[11px] text-[#736B63] font-medium">
            {kpis.connectRate} connect rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-xs">
          <div className="flex items-center justify-between text-[#736B63] text-xs font-medium">
            <span>Conversions</span>
            <CheckCircle2 size={15} className="text-[#8EAA91]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#39342F] font-mono">
            {kpis.conversionsToday}
          </div>
          <div className="mt-1 text-[11px] text-[#8E7252] font-semibold">
            {kpis.conversionLift} naming lift
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-xs">
          <div className="flex items-center justify-between text-[#736B63] text-xs font-medium">
            <span>Tasks Pending</span>
            <Clock size={15} className="text-[#8E7252]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#39342F] font-mono">
            {kpis.pendingTasksCount}
          </div>
          <div className="mt-1 text-[11px] text-[#736B63] font-medium">
            3 urgent walkouts
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#736B63] text-xs font-medium">
            <span>Today's Incentive</span>
            <Flame size={15} className="text-[#B69A78]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#8E7252] font-mono">
            {kpis.myEarningsToday}
          </div>
          <div className="mt-1 text-[11px] text-[#736B63]">
            Monthly: {kpis.monthlyEarnings}
          </div>
        </div>
      </div>

      {/* "Who is Waiting / Needs Attention" Section */}
      <div className="bg-[#F7F2EC] border border-[#E8E0D6] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#B69A78] text-white">
              <AlertTriangle size={15} />
            </span>
            <h2 className="text-sm font-bold text-[#39342F] uppercase tracking-wider">
              Who is Waiting — High-Intent Walk-Outs (Next 30 Mins)
            </h2>
          </div>
          <span className="text-xs text-[#736B63] font-medium hidden sm:inline">
            Offline store exit detected by On-Ground Sensor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {waitingLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl p-4 border border-[#E8E0D6] shadow-xs hover:border-[#B69A78]/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#39342F]">{lead.name}</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#F5EFE8] text-[#8E7252] border border-[#E8E0D6]">
                    {lead.score} pts
                  </span>
                </div>
                <div className="text-xs text-[#736B63] mt-1 flex items-center gap-1.5">
                  <Building size={12} className="text-[#938A82]" />
                  <span>{lead.brand}</span>
                  <span>•</span>
                  <span>{lead.product}</span>
                </div>
                <p className="text-[11px] text-[#554D46] mt-2 bg-[#FAF7F2] p-2 rounded-lg leading-relaxed line-clamp-2 border border-[#E8E0D6]/60">
                  {lead.signals[0]?.content || lead.timeline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E0D6]/60 flex items-center justify-between">
                <button
                  onClick={() => openLeadModal(lead.id)}
                  className="text-xs font-semibold text-[#736B63] hover:text-[#39342F] transition"
                >
                  View Details & SOP
                </button>
                <button
                  onClick={() => startCall(lead, 'demo')}
                  className="px-3 py-1.5 rounded-lg bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Phone size={12} className="text-[#B69A78]" />
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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#39342F]">Priority Task Queue</h2>
              <p className="text-xs text-[#736B63]">Ranked by Lead Intent & ICP Score</p>
            </div>
            <span className="text-xs text-[#938A82] font-medium">Click task to view modal</span>
          </div>

          <div className="divide-y divide-[#E8E0D6]/60">
            {taskLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => openLeadModal(lead.id)}
                className="py-3.5 px-3 -mx-3 rounded-xl hover:bg-[#FAF7F2] cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F5EFE8] group-hover:bg-[#62564C] group-hover:text-white transition flex items-center justify-center font-bold text-xs text-[#62564C]">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#39342F] group-hover:text-[#62564C] transition">
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
                    </div>
                    <div className="text-xs text-[#736B63] flex items-center gap-2 mt-0.5">
                      <span>{lead.brand}</span>
                      <span>•</span>
                      <span className="text-[#938A82]">{lead.visitedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-[#39342F] font-mono">{lead.valueAtStake}</span>
                    <div className="text-[10px] text-[#736B63] font-medium">ICP: {lead.icpScore}%</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startCall(lead, 'demo');
                    }}
                    className="p-2 rounded-lg bg-[#FAF7F2] text-[#62564C] hover:bg-[#62564C] hover:text-white border border-[#E8E0D6] transition"
                    title="Call directly"
                  >
                    <Phone size={14} />
                  </button>
                  <ArrowRight size={14} className="text-[#B69A78] group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Earnings Summary & 7-Day Performance Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Earnings & Deal Summary Card */}
          <div className="bg-[#62564C] text-white rounded-2xl p-5 border border-[#52473E] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#D4C9BD] mb-2">
              <span>My Earnings & Targets</span>
              <span className="px-2 py-0.5 rounded-full bg-[#52473E] text-[#FAF7F2] border border-[#76675B]">
                Oct 2026
              </span>
            </div>

            <div className="text-3xl font-bold font-mono text-[#FAF7F2]">
              {kpis.myEarningsToday}
            </div>
            <p className="text-xs text-[#D4C9BD] mt-1">Earned during current shift so far</p>

            <div className="mt-4 pt-4 border-t border-[#76675B] grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#52473E] p-2.5 rounded-xl border border-[#6B5E53]">
                <span className="text-[#D4C9BD] block text-[11px]">Closed Deals</span>
                <span className="text-sm font-bold text-white font-mono">{kpis.conversionsToday} sales</span>
              </div>
              <div className="bg-[#52473E] p-2.5 rounded-xl border border-[#6B5E53]">
                <span className="text-[#D4C9BD] block text-[11px]">Revenue Closed</span>
                <span className="text-sm font-bold text-[#B69A78] font-mono">{kpis.revenueClosedToday}</span>
              </div>
            </div>
          </div>

          {/* Interactive 7-Day Chart */}
          <div className="bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#39342F]">7-Day Performance</h3>
                <p className="text-xs text-[#736B63]">Daily calls & conversion trends</p>
              </div>
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-0.5 rounded-lg text-xs border border-[#E8E0D6]">
                <button
                  onClick={() => setChartMetric('calls')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    chartMetric === 'calls'
                      ? 'bg-white text-[#39342F] shadow-xs'
                      : 'text-[#736B63] hover:text-[#39342F]'
                  }`}
                >
                  Calls
                </button>
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    chartMetric === 'revenue'
                      ? 'bg-white text-[#39342F] shadow-xs'
                      : 'text-[#736B63] hover:text-[#39342F]'
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E0D6" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#736B63' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#736B63' }} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#62564C',
                        border: '1px solid #76675B',
                        borderRadius: '8px',
                        color: '#FAF7F2',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="calls" fill="#62564C" radius={[4, 4, 0, 0]} name="Total Calls" />
                    <Bar dataKey="connected" fill="#B69A78" radius={[4, 4, 0, 0]} name="Connected" />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B69A78" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#B69A78" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E0D6" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#736B63' }} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#736B63' }}
                      axisLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: '#62564C',
                        border: '1px solid #76675B',
                        borderRadius: '8px',
                        color: '#FAF7F2',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8E7252"
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
