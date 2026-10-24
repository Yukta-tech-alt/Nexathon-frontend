import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RouteWiseProvider } from './context/RouteWiseContext';
import ToastContainer from './components/common/ToastContainer';
import { checkBackend, getAuthToken, setStoredUser, authApi } from './services/api';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import PassengerLayout from './components/layouts/PassengerLayout';
import EmployerLayout from './components/layouts/EmployerLayout';
import AuthorityLayout from './components/layouts/AuthorityLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import RoleSelectionPage from './pages/public/RoleSelectionPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import HelpPage from './pages/public/HelpPage';
import TrafficIntelligencePage from './pages/TrafficIntelligencePage';
import PassengerRoutePlanner from './pages/passenger/PassengerRoutePlanner';

// Passenger Pages
import PassengerDashboard from './pages/passenger/PassengerDashboard';
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

  // --------------------------------------------------
  // BACKEND CONNECTION & SESSION VERIFICATION
  // --------------------------------------------------
  useEffect(() => {
    checkBackend()
      .then((data) => {
        console.log('✅ RouteWise AI backend connected:', data);
      })
      .catch((error) => {
        console.error('❌ RouteWise AI backend connection failed:', error);
      });

    // Verify session validity on page load / refresh
    const token = getAuthToken();
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res?.user) {
            setStoredUser(res.user);
          }
        })
        .catch((err) => {
          console.warn('Session verification notice (clearing expired session):', err);
          authApi.logout();
        });
    }
  }, []);

  return (
    <RouteWiseProvider>
      <BrowserRouter>

        {/* Global Toast Container */}
        <ToastContainer />

        <Routes>

          {/* ==========================================
              PUBLIC WEBSITE ROUTES (No Login Required)
          ========================================== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            {/* Route planning and traffic intelligence require authentication */}
            <Route path="/route" element={<Navigate to="/passenger/route" replace />} />
            <Route path="/routes" element={<Navigate to="/passenger/route" replace />} />
            <Route path="/intelligence" element={<Navigate to="/authority/analytics" replace />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/get-started" element={<Navigate to="/select-role" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>


          {/* ==========================================
              PASSENGER PORTAL (Protected: Citizen/Passenger)
          ========================================== */}
          <Route 
            path="/passenger" 
            element={
              <ProtectedRoute allowedRoles={['citizen', 'passenger']}>
                <PassengerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PassengerDashboard />} />

            <Route
              path="dashboard"
              element={<Navigate to="/passenger" replace />}
            />

            <Route
              path="route"
              element={<PassengerRoutePlanner />}
            />

            <Route
              path="alerts"
              element={<PassengerAlerts />}
            />

            <Route
              path="report"
              element={<PassengerReport />}
            />

            <Route
              path="journeys"
              element={<PassengerJourneys />}
            />

            <Route
              path="verification"
              element={<PassengerVerification />}
            />

            <Route
              path="data"
              element={<PassengerData />}
            />

            <Route
              path="settings"
              element={<PassengerSettings />}
            />

            <Route
              path="help"
              element={<PassengerHelp />}
            />
          </Route>


          {/* ==========================================
              EMPLOYER PORTAL (Protected: Employer)
          ========================================== */}
          <Route 
            path="/employer" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={<EmployerOverview />}
            />

            <Route
              path="overview"
              element={<Navigate to="/employer" replace />}
            />

            <Route
              path="employees"
              element={<EmployerEmployees />}
            />

            <Route
              path="journeys"
              element={<EmployerJourneys />}
            />

            <Route
              path="delays"
              element={<EmployerDelays />}
            />

            <Route
              path="analytics"
              element={<EmployerAnalytics />}
            />

            <Route
              path="reports"
              element={<EmployerReports />}
            />

            <Route
              path="privacy"
              element={<EmployerPrivacy />}
            />

            <Route
              path="data"
              element={<EmployerData />}
            />

            <Route
              path="settings"
              element={<EmployerSettings />}
            />

          </Route>


          {/* ==========================================
              TRAFFIC AUTHORITY PORTAL (Protected: Authority)
          ========================================== */}
          <Route 
            path="/authority" 
            element={
              <ProtectedRoute allowedRoles={['traffic_authority', 'traffic_police', 'admin']}>
                <AuthorityLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={<AuthorityOverview />}
            />

            <Route
              path="overview"
              element={<Navigate to="/authority" replace />}
            />

            <Route
              path="incidents"
              element={<AuthorityIncidents />}
            />

            <Route
              path="hotspots"
              element={<AuthorityHotspots />}
            />

            <Route
              path="recurring"
              element={<AuthorityRecurring />}
            />

            <Route
              path="analytics"
              element={<AuthorityAnalytics />}
            />

            <Route
              path="reports"
              element={<AuthorityReports />}
            />

            <Route
              path="investigation"
              element={<AuthorityInvestigation />}
            />

            <Route
              path="data"
              element={<AuthorityData />}
            />

            <Route
              path="settings"
              element={<AuthoritySettings />}
            />

          </Route>


          {/* ==========================================
              SYSTEM ADMIN (Protected: Admin)
          ========================================== */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="dashboard"
              element={<Navigate to="/admin" replace />}
            />

          </Route>


          {/* ==========================================
              LEGACY / CONVENIENCE REDIRECTS
          ========================================== */}

          <Route
            path="/dashboard"
            element={<Navigate to="/passenger" replace />}
          />

          <Route
            path="/report"
            element={<Navigate to="/passenger/report" replace />}
          />

          <Route
            path="/journeys"
            element={<Navigate to="/passenger/journeys" replace />}
          />

          <Route
            path="/employees"
            element={<Navigate to="/employer/employees" replace />}
          />

          <Route
            path="/reports"
            element={<Navigate to="/employer/reports" replace />}
          />

          <Route
            path="/settings"
            element={<Navigate to="/passenger/settings" replace />}
          />


          {/* ==========================================
              FALLBACK
          ========================================== */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </BrowserRouter>
    </RouteWiseProvider>
  );
}
