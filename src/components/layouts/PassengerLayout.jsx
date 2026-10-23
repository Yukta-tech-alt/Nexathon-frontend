import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  Navigation, 
  Compass, 
  Route, 
  Bell, 
  AlertTriangle, 
  Car, 
  ShieldCheck, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  AlertOctagon, 
  Upload, 
  Menu, 
  X,
  Lock,
  Search
} from 'lucide-react';
import EmergencyModal from '../common/EmergencyModal';
import CSVImportModal from '../forms/CSVImportModal';

export default function PassengerLayout() {
  const navigate = useNavigate();
  const { 
    theme, 
    toggleTheme, 
    activeJourney, 
    privacySettings, 
    updatePrivacySettings,
    sosActive, 
    triggerSOS, 
    importDataset 
  } = useRouteWise();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/passenger', icon: Compass, end: true },
    { label: 'Plan Route', path: '/passenger/route', icon: Route },
    { label: 'Traffic Alerts', path: '/passenger/alerts', icon: Bell },
    { label: 'Report Incident', path: '/passenger/report', icon: AlertTriangle },
    { label: 'My Journeys', path: '/passenger/journeys', icon: Car },
    { label: 'Settings', path: '/passenger/settings', icon: Settings },
    { label: 'Help', path: '/passenger/help', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* DESKTOP PASSENGER SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950/95 p-4 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
              <Navigation className="w-5 h-5 fill-slate-950 rotate-45" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
                RouteWise <span className="text-cyan-400 font-mono text-xs">AI</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block -mt-0.5">
                Passenger Portal
              </span>
            </div>
          </Link>

          {/* Active Tracking Pill */}
          {activeJourney.isActive && (
            <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Active Commute Live</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Speed: {activeJourney.speedKmh} km/h • {activeJourney.distanceRemainingKm} km left
              </div>
            </div>
          )}

          {/* Navigation Items (Strictly Passenger Only) */}
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          {/* Quick SOS Trigger */}
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Emergency SOS</span>
          </button>

          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => navigate('/select-role')}
              className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOPBAR & DRAWER */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
        <Link to="/" className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400 rotate-45" />
          <span className="font-bold text-white text-sm">RouteWise Passenger</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold"
          >
            SOS
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-1">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <item.icon className="w-4 h-4 text-cyan-400" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => { setIsMobileMenuOpen(false); navigate('/select-role'); }}
            className="w-full text-left p-2.5 text-xs text-amber-400 font-bold"
          >
            Switch Role Experience →
          </button>
        </div>
      )}

      {/* MAIN PORTAL CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Mini Commute Status Bar */}
        <div className="border-b border-slate-800/80 bg-slate-950/60 px-4 sm:px-8 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Commute Telemetry:</span>
            <span>{privacySettings.isSharingCommute ? 'Consent-driven corridor sharing active' : 'Sharing is disabled'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>Import Incidents CSV</span>
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        targetType="incidents"
        onImportSuccess={importDataset}
      />
    </div>
  );
}
