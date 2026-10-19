import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CallModal } from '../calling/CallModal';
import { DialPadModal } from '../calling/DialPadModal';
import { CallDispositionModal } from '../calling/CallDispositionModal';
import { TwilioConfigModal } from '../calling/TwilioConfigModal';
import { LeadDetailsModal } from '../leads/LeadDetailsModal';

export const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f5f6f3] text-slate-800">
      {/* Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar toggleMobile={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Persistent Calling & Modals Layer */}
      <CallModal />
      <DialPadModal />
      <CallDispositionModal />
      <TwilioConfigModal />
      <LeadDetailsModal />
    </div>
  );
};
