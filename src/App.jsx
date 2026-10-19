import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { CallProvider } from './context/CallContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { PlanPage } from './pages/Plan/PlanPage';
import { CalendarPage } from './pages/Calendar/CalendarPage';
import { PulsePage } from './pages/Pulse/PulsePage';

function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <CallProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="plan" element={<PlanPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="pulse" element={<PulsePage />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CallProvider>
      </AppDataProvider>
    </BrowserRouter>
  );
}

export default App;
