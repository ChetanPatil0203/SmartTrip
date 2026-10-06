import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AiCopilotPage from './pages/AiCopilotPage';
import UsersPage from './pages/UsersPage';
import TravelManagementPage from './pages/TravelManagementPage';
import BookingsPage from './pages/BookingsPage';
import PaymentsRefundsPage from './pages/PaymentsRefundsPage';
import OffersCouponsPage from './pages/OffersCouponsPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import SafetyPage from './pages/SafetyPage';
import ReviewsPage from './pages/ReviewsPage';
import TrackingDelaysPage from './pages/TrackingDelaysPage';
import ReportsAnalyticsPage from './pages/ReportsAnalyticsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoutes() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Super Admin Protected Application */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ai-copilot" element={<AiCopilotPage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* Travel Management */}
        <Route path="/travel" element={<Navigate to="/travel/bus" replace />} />
        <Route path="/travel/:mode" element={<TravelManagementPage />} />

        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/payments" element={<PaymentsRefundsPage />} />
        <Route path="/offers" element={<OffersCouponsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/tracking" element={<TrackingDelaysPage />} />
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}
