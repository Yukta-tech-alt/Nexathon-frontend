import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RouteWiseProvider } from './context/RouteWiseContext';
import ToastContainer from './components/common/ToastContainer';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import PassengerLayout from './components/layouts/PassengerLayout';
import EmployerLayout from './components/layouts/EmployerLayout';
import AuthorityLayout from './components/layouts/AuthorityLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import RoleSelectionPage from './pages/public/RoleSelectionPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import HelpPage from './pages/public/HelpPage';

// Passenger Pages
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import PassengerRoutePlanner from './pages/passenger/PassengerRoutePlanner';
import PassengerAlerts from './pages/passenger/PassengerAlerts';
import PassengerReport from './pages/passenger/PassengerReport';
import PassengerJourneys from './pages/passenger/PassengerJourneys';
import PassengerVerification from './pages/passenger/PassengerVerification';
import PassengerSettings from './pages/passenger/PassengerSettings';
import PassengerHelp from './pages/passenger/PassengerHelp';
import PassengerData from './pages/passenger/PassengerData';

// Employer Pages
import EmployerOverview from './pages/employer/EmployerOverview';
import EmployerEmployees from './pages/employer/EmployerEmployees';
import EmployerJourneys from './pages/employer/EmployerJourneys';
import EmployerDelays from './pages/employer/EmployerDelays';
import EmployerAnalytics from './pages/employer/EmployerAnalytics';
import EmployerReports from './pages/employer/EmployerReports';
import EmployerPrivacy from './pages/employer/EmployerPrivacy';
import EmployerData from './pages/employer/EmployerData';
import EmployerSettings from './pages/employer/EmployerSettings';

// Authority Pages
import AuthorityOverview from './pages/authority/AuthorityOverview';
import AuthorityIncidents from './pages/authority/AuthorityIncidents';
import AuthorityHotspots from './pages/authority/AuthorityHotspots';
import AuthorityRecurring from './pages/authority/AuthorityRecurring';
import AuthorityAnalytics from './pages/authority/AuthorityAnalytics';
import AuthorityReports from './pages/authority/AuthorityReports';
import AuthorityInvestigation from './pages/authority/AuthorityInvestigation';
import AuthorityData from './pages/authority/AuthorityData';
import AuthoritySettings from './pages/authority/AuthoritySettings';

// Admin Page
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <RouteWiseProvider>
      <BrowserRouter>
        {/* Global Toast Container */}
        <ToastContainer />

        <Routes>
          {/* PUBLIC WEBSITE ROUTES */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>

          {/* DEDICATED PASSENGER PORTAL */}
          <Route path="/passenger" element={<PassengerLayout />}>
            <Route index element={<PassengerDashboard />} />
            <Route path="dashboard" element={<Navigate to="/passenger" replace />} />
            <Route path="route" element={<PassengerRoutePlanner />} />
            <Route path="alerts" element={<PassengerAlerts />} />
            <Route path="report" element={<PassengerReport />} />
            <Route path="journeys" element={<PassengerJourneys />} />
            <Route path="verification" element={<PassengerVerification />} />
            <Route path="data" element={<PassengerData />} />
            <Route path="settings" element={<PassengerSettings />} />
            <Route path="help" element={<PassengerHelp />} />
          </Route>

          {/* DEDICATED EMPLOYER PORTAL */}
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerOverview />} />
            <Route path="overview" element={<Navigate to="/employer" replace />} />
            <Route path="employees" element={<EmployerEmployees />} />
            <Route path="journeys" element={<EmployerJourneys />} />
            <Route path="delays" element={<EmployerDelays />} />
            <Route path="analytics" element={<EmployerAnalytics />} />
            <Route path="reports" element={<EmployerReports />} />
            <Route path="privacy" element={<EmployerPrivacy />} />
            <Route path="data" element={<EmployerData />} />
            <Route path="settings" element={<EmployerSettings />} />
          </Route>

          {/* DEDICATED TRAFFIC AUTHORITY PORTAL */}
          <Route path="/authority" element={<AuthorityLayout />}>
            <Route index element={<AuthorityOverview />} />
            <Route path="overview" element={<Navigate to="/authority" replace />} />
            <Route path="incidents" element={<AuthorityIncidents />} />
            <Route path="hotspots" element={<AuthorityHotspots />} />
            <Route path="recurring" element={<AuthorityRecurring />} />
            <Route path="analytics" element={<AuthorityAnalytics />} />
            <Route path="reports" element={<AuthorityReports />} />
            <Route path="investigation" element={<AuthorityInvestigation />} />
            <Route path="data" element={<AuthorityData />} />
            <Route path="settings" element={<AuthoritySettings />} />
          </Route>

          {/* SEPARATE SYSTEM ADMIN AREA */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Legacy / Direct Route Compatibility Redirects */}
          <Route path="/dashboard" element={<Navigate to="/passenger" replace />} />
          <Route path="/routes" element={<Navigate to="/passenger/route" replace />} />
          <Route path="/report" element={<Navigate to="/passenger/report" replace />} />
          <Route path="/journeys" element={<Navigate to="/passenger/journeys" replace />} />
          <Route path="/employees" element={<Navigate to="/employer/employees" replace />} />
          <Route path="/intelligence" element={<Navigate to="/authority" replace />} />
          <Route path="/reports" element={<Navigate to="/employer/reports" replace />} />
          <Route path="/settings" element={<Navigate to="/passenger/settings" replace />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RouteWiseProvider>
  );
}
