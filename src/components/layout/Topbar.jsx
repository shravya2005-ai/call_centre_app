import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Headphones,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Phone,
  Flame,
  Volume2,
  Settings
} from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { useAppData } from '../../context/AppDataContext';

export const Topbar = ({ toggleMobile }) => {
  const location = useLocation();
  const { callingMode, setIsDialPadOpen, setIsTwilioConfigOpen } = useCall();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openLeadModal
  } = useAppData();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState('Available');
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/plan')) return 'Plan / Outbound Operations';
    if (path.startsWith('/calendar')) return 'Calendar / Follow-ups';
    if (path.startsWith('/pulse')) return 'Pulse / AI Role Agents Workspace';
    return 'Call Centre App';
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0a241c] border-b border-[#184435] px-4 md:px-6 flex items-center justify-between text-slate-200">
      {/* Left Breadcrumb & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400/80">On-Ground.ai</span>
          <span className="text-slate-500 text-xs">/</span>
          <h2 className="text-xs font-bold text-white tracking-wide">{getBreadcrumb()}</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Calling Mode Switcher Pill */}
        <button
          onClick={() => setIsTwilioConfigOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#143d30] hover:bg-[#1b4e3e] border border-[#235845] text-[11px] font-medium text-amber-300 transition"
          title="Configure Calling Provider"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mode: {callingMode === 'demo' ? 'HD Audio Demo' : 'Twilio Voice'}</span>
          <Settings size={12} className="text-slate-400" />
        </button>

        {/* Audio Mic Status */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0e3025] border border-[#1b4d3c] text-[11px] text-slate-300"
          title="Default Audio Headset connected"
        >
          <Headphones size={13} className="text-emerald-400" />
          <span>Jabra Evolve 20</span>
        </div>

        {/* Agent Shift Status Selector */}
        <div className="relative">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e3025] hover:bg-[#164235] border border-[#1b4d3c] text-xs font-medium text-slate-200 transition"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                agentStatus === 'Available'
                  ? 'bg-emerald-400'
                  : agentStatus === 'In Call'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            <span className="hidden sm:inline">{agentStatus}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-800 z-50 animate-in fade-in">
              {['Available', 'In Call', 'Wrap-up', 'On Break'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setAgentStatus(status);
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>{status}</span>
                  {agentStatus === status && <CheckCircle2 size={13} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 relative transition"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-amber-950 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-800 animate-in fade-in">
              <div className="px-4 py-3 bg-[#0e3025] text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">Live Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-amber-500 text-amber-950 font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-emerald-300 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.leadId) {
                        openLeadModal(n.leadId);
                        setIsNotifOpen(false);
                      }
                    }}
                    className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                      !n.read ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                    {n.leadId && (
                      <span className="mt-1.5 inline-block text-[10px] text-emerald-700 font-semibold underline">
                        View Lead Details & Call →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Dialpad trigger in topbar */}
        <button
          onClick={() => setIsDialPadOpen(true)}
          className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm active:scale-95"
          title="Open Dial Pad"
        >
          <Phone size={16} />
        </button>
      </div>
    </header>
  );
};
