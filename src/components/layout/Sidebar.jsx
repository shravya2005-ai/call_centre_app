import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  Sparkles,
  Phone,
  Bot,
  TrendingUp,
  Flame,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { useAppData } from '../../context/AppDataContext';

export const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const location = useLocation();
  const { setIsDialPadOpen, callState } = useCall();
  const { kpis, incomingCalls } = useAppData();

  const pendingIncomingCount = incomingCalls.filter((c) => c.status !== 'Resolved').length;

  const navLinks = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/plan',
      label: 'Plan',
      icon: PhoneCall,
      badge: pendingIncomingCount > 0 ? `${pendingIncomingCount} new` : null,
      badgeColor: 'bg-amber-500 text-amber-950 font-bold'
    },
    {
      to: '/calendar',
      label: 'Calendar',
      icon: CalendarDays,
      badge: null
    },
    {
      to: '/pulse',
      label: 'Pulse AI',
      icon: Sparkles,
      badge: '5 Bots',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0e3025] border-r border-[#1a4a3a] text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="px-6 py-5 border-b border-[#184435] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <span className="font-extrabold text-[#0e3025] text-lg">₹</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-white tracking-tight leading-none">On-Ground<span className="text-amber-400">.ai</span></h1>
                </div>
                <p className="text-[10px] text-emerald-300/80 font-medium tracking-wider uppercase mt-1">
                  Call Centre Operations
                </p>
              </div>
            </div>
          </div>

          {/* Shift Target Status Mini-Widget */}
          <div className="mx-4 my-4 p-3 rounded-xl bg-[#09221a] border border-[#174334]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Flame size={13} className="text-amber-400" />
                <span>Today's Incentive</span>
              </span>
              <span className="font-bold text-amber-400 font-mono">{kpis.myEarningsToday}</span>
            </div>
            <div className="w-full bg-[#163f31] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${kpis.targetProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Goal: ₹8,000</span>
              <span>{kpis.targetProgressPercent}% cleared</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold text-emerald-400/70 tracking-wider">
              Workspace
            </div>
            {navLinks.map(({ to, label, icon: Icon, badge, badgeColor }) => {
              const isActive =
                to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#184838] text-white shadow-sm border border-[#235d48]'
                      : 'text-slate-300 hover:text-white hover:bg-[#133a2e]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={`transition-colors ${
                        isActive ? 'text-amber-400' : 'text-emerald-400/80 group-hover:text-emerald-300'
                      }`}
                    />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        badgeColor || 'bg-[#09221a] text-slate-300'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Calling Trigger */}
          <div className="px-4 mt-6">
            <button
              onClick={() => {
                closeMobile && closeMobile();
                setIsDialPadOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition active:scale-98"
            >
              <Phone size={15} />
              <span>Open Outbound Dialer</span>
            </button>
          </div>
        </div>

        {/* Footer Agent Shift Profile */}
        <div className="p-4 border-t border-[#184435] bg-[#09221a]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-xs flex items-center justify-center shadow">
                AR
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#09221a] rounded-full"></span>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Akshat Rajan</div>
              <div className="text-[11px] text-emerald-300/80 truncate">Telecaller #4 • Indiranagar</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
