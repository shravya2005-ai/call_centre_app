import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  Sparkles,
  Phone,
  Flame
} from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { useAppData } from '../../context/AppDataContext';

export const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const location = useLocation();
  const { setIsDialPadOpen } = useCall();
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
      badgeColor: 'bg-[#B69A78] text-[#39342F] font-bold'
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
      badgeColor: 'bg-[#52473E] text-[#E8E0D6] border border-[#76675B]'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#62564C] border-r border-[#52473E] text-[#FAF7F2] flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="px-6 py-5 border-b border-[#52473E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#52473E] border border-[#76675B] flex items-center justify-center shadow-xs">
                <span className="font-bold text-[#B69A78] text-base">₹</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-white tracking-tight leading-none">
                    On-Ground<span className="text-[#B69A78]">.ai</span>
                  </h1>
                </div>
                <p className="text-[10px] text-[#E8E0D6]/80 font-medium tracking-wider uppercase mt-1">
                  Call Centre Operations
                </p>
              </div>
            </div>
          </div>

          {/* Shift Target Status Mini-Widget */}
          <div className="mx-4 my-4 p-3.5 rounded-xl bg-[#52473E] border border-[#73655A]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#FAF7F2]/90 font-medium flex items-center gap-1.5">
                <Flame size={13} className="text-[#B69A78]" />
                <span>Today's Incentive</span>
              </span>
              <span className="font-bold text-[#B69A78] font-mono">{kpis.myEarningsToday}</span>
            </div>
            <div className="w-full bg-[#453C34] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B69A78] rounded-full transition-all duration-500"
                style={{ width: `${kpis.targetProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#D4C9BD] mt-1.5">
              <span>Goal: ₹8,000</span>
              <span>{kpis.targetProgressPercent}% cleared</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold text-[#D4C9BD] tracking-wider">
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
                      ? 'bg-[#52473E] text-white shadow-xs border border-[#76675B]'
                      : 'text-[#FAF7F2]/80 hover:text-white hover:bg-[#6F6257]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={17}
                      className={`transition-colors ${
                        isActive ? 'text-[#B69A78]' : 'text-[#D4C9BD] group-hover:text-white'
                      }`}
                    />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        badgeColor || 'bg-[#52473E] text-[#D4C9BD]'
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
                if (closeMobile) closeMobile();
                setIsDialPadOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#B69A78] hover:bg-[#A48968] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
            >
              <Phone size={14} />
              <span>Open Outbound Dialer</span>
            </button>
          </div>
        </div>

        {/* Footer Agent Shift Profile */}
        <div className="p-4 border-t border-[#52473E] bg-[#52473E]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#B69A78] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AR
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#8EAA91] border-2 border-[#52473E] rounded-full"></span>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Akshat Rajan</div>
              <div className="text-[11px] text-[#D4C9BD] truncate">Telecaller #4 • Indiranagar</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
