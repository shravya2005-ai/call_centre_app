import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Headphones,
  CheckCircle2,
  ChevronDown,
  Phone,
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
    <header className="sticky top-0 z-30 h-14 bg-[#574C43] border-b border-[#6B5E53] px-4 md:px-6 flex items-center justify-between text-[#FAF7F2]">
      {/* Left Breadcrumb & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="p-1.5 rounded-lg text-[#D4C9BD] hover:text-white hover:bg-white/10 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#D4C9BD]">On-Ground.ai</span>
          <span className="text-[#8F8479] text-xs">/</span>
          <h2 className="text-xs font-bold text-white tracking-wide">{getBreadcrumb()}</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Calling Mode Switcher Pill */}
        <button
          onClick={() => setIsTwilioConfigOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4B4139] hover:bg-[#52473E] border border-[#685B50] text-[11px] font-medium text-[#FAF7F2] transition"
          title="Configure Calling Provider"
        >
          <span className="w-2 h-2 rounded-full bg-[#B69A78] animate-pulse" />
          <span>Mode: {callingMode === 'demo' ? 'HD Audio Demo' : 'Twilio Voice'}</span>
          <Settings size={12} className="text-[#D4C9BD]" />
        </button>

        {/* Audio Mic Status */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#4B4139] border border-[#685B50] text-[11px] text-[#D4C9BD]"
          title="Default Audio Headset connected"
        >
          <Headphones size={13} className="text-[#B69A78]" />
          <span>Jabra Evolve 20</span>
        </div>

        {/* Agent Shift Status Selector */}
        <div className="relative">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4B4139] hover:bg-[#52473E] border border-[#685B50] text-xs font-medium text-[#FAF7F2] transition"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                agentStatus === 'Available'
                  ? 'bg-[#8EAA91]'
                  : agentStatus === 'In Call'
                  ? 'bg-[#B69A78]'
                  : 'bg-[#C7857C]'
              }`}
            />
            <span className="hidden sm:inline">{agentStatus}</span>
            <ChevronDown size={13} className="text-[#D4C9BD]" />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-[#E8E0D6] rounded-xl shadow-xl py-1 text-xs text-[#39342F] z-50 animate-in fade-in">
              {['Available', 'In Call', 'Wrap-up', 'On Break'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setAgentStatus(status);
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-[#FAF7F2] flex items-center justify-between transition"
                >
                  <span>{status}</span>
                  {agentStatus === status && <CheckCircle2 size={13} className="text-[#B69A78]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-[#D4C9BD] hover:text-white hover:bg-white/10 relative transition"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B69A78] text-[#39342F] text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E8E0D6] rounded-2xl shadow-xl overflow-hidden z-50 text-[#39342F] animate-in fade-in">
              <div className="px-4 py-3 bg-[#62564C] text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">Live Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#B69A78] text-[#39342F] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#E8E0D6] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E8E0D6]/60">
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
                    className={`p-3 text-xs cursor-pointer hover:bg-[#FAF7F2] transition ${
                      !n.read ? 'bg-[#F5EFE8]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#39342F]">{n.title}</span>
                      <span className="text-[10px] text-[#736B63]">{n.time}</span>
                    </div>
                    <p className="text-[#736B63] leading-relaxed text-[11px]">{n.message}</p>
                    {n.leadId && (
                      <span className="mt-1.5 inline-block text-[10px] text-[#B69A78] font-semibold hover:underline">
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
          className="p-2 rounded-lg bg-[#B69A78] hover:bg-[#A48968] text-white transition shadow-xs active:scale-95"
          title="Open Dial Pad"
        >
          <Phone size={16} />
        </button>
      </div>
    </header>
  );
};
