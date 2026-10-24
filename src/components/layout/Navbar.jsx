import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  Navigation, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ShieldAlert, 
  AlertOctagon, 
  Menu, 
  X, 
  User, 
  Building2, 
  Activity, 
  ChevronDown, 
  CheckCircle2, 
  Check, 
  Compass, 
  PlusCircle, 
  Route, 
  Settings, 
  HelpCircle,
  FileText,
  Users,
  LogOut,
  RefreshCw
} from 'lucide-react';
import EmergencyModal from '../common/EmergencyModal';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    theme, 
    toggleTheme, 
    role, 
    setRole, 
    incidents, 
    activeJourney,
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications,
    sosState,
    resetDemoData
  } = useRouteWise();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setIsRoleMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic for incidents & routes
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const lower = q.toLowerCase();
    const matchedIncidents = incidents
      .filter(i => i.title.toLowerCase().includes(lower) || i.locationName.toLowerCase().includes(lower))
      .slice(0, 4)
      .map(i => ({ type: 'incident', id: i.id, title: i.title, subtitle: i.locationName, severity: i.severity }));

    const mockDestinations = [
      { type: 'destination', id: 'dest-1', title: 'Hampankatta City Center', subtitle: 'Central Business District, Mangaluru' },
      { type: 'destination', id: 'dest-2', title: 'Surathkal NITK Corridor', subtitle: 'NH-66 North Highway, Mangaluru' },
      { type: 'destination', id: 'dest-3', title: 'Udupi Krishna Temple Circle', subtitle: 'Udupi District Headquarters' },
      { type: 'destination', id: 'dest-4', title: 'Bantwal BC Road', subtitle: 'NH-73 Eastern Highway Junction' },
      { type: 'destination', id: 'dest-5', title: 'Pumpwell Mahaveera Circle', subtitle: 'South NH-66 Entry Hub' }
    ].filter(d => d.title.toLowerCase().includes(lower) || d.subtitle.toLowerCase().includes(lower));

    setSearchResults([...matchedIncidents, ...mockDestinations]);
    setIsSearchOpen(true);
  };

  const handleSelectSearchResult = (item) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (item.type === 'incident') {
      navigate(`/passenger?incidentId=${item.id}`);
    } else {
      navigate(`/routes?destination=${encodeURIComponent(item.title)}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md transition-colors">
        {/* Top Mini Demo Bar */}
        <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-950 border-b border-cyan-500/20 px-4 py-1 text-[11px] flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-semibold text-cyan-300">RouteWise AI Telemetry Grid</span>
            <span className="hidden sm:inline text-slate-400">• Karnataka NH-66 & Urban Corridor Mock Telemetry</span>
          </div>
          <div className="flex items-center gap-3">
            {activeJourney.isActive && (
              <Link 
                to="/journeys" 
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] hover:bg-cyan-500/30 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>JOURNEY ACTIVE: {activeJourney.speedKmh} km/h ({activeJourney.distanceRemainingKm} km left)</span>
              </Link>
            )}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Demo Persona:</span>
              <span className="text-white font-bold capitalize px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Tag */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
                <Navigation className="w-5 h-5 fill-slate-950 rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  RouteWise <span className="text-cyan-400">AI</span>
                </span>
                <span className="text-[10px] font-medium tracking-wide text-slate-400 -mt-1">
                  Traffic & Commute Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/passenger"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/passenger' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Passenger Map
              </Link>
              <Link
                to="/routes"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/routes' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Plan Route
              </Link>
              <Link
                to="/report"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/report' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Report Incident
              </Link>
              <Link
                to="/journeys"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/journeys' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                My Journeys
              </Link>
              <Link
                to="/intelligence"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/intelligence' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Traffic Intelligence
              </Link>
              <Link
                to="/employer"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/employer' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Employer Portal
              </Link>
            </nav>
          </div>

          {/* Center: Global Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search incidents, NH-66, locations..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setIsSearchOpen(true)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Search Suggestions
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-2.5 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-100">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        item.type === 'incident' ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: SOS, Notifications, Role Switcher, Theme, Profile */}
          <div className="flex items-center gap-2">
            {/* SOS Button */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                sosState.isActive 
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
              }`}
              title="Emergency SOS"
            >
              <AlertOctagon className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
                title="Traffic Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Menu */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Traffic & Delay Alerts</span>
                      <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        Mark all read
                      </button>
                      <button 
                        onClick={clearAllNotifications}
                        className="text-[10px] text-slate-400 hover:text-slate-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No active notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 hover:bg-slate-800/60 cursor-pointer transition-colors ${!n.read ? 'bg-cyan-950/20' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
                    <Link 
                      to="/settings" 
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      Manage Notification Settings →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Dropdown */}
            <div ref={roleRef} className="relative hidden md:block">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-200 transition-colors"
              >
                {role === 'passenger' && <User className="w-3.5 h-3.5 text-cyan-400" />}
                {role === 'employer' && <Building2 className="w-3.5 h-3.5 text-emerald-400" />}
                {role === 'authority' && <Activity className="w-3.5 h-3.5 text-amber-400" />}
                <span className="capitalize">{role} View</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Demo Role Switcher
                  </div>
                  <button
                    onClick={() => { setRole('passenger'); setIsRoleMenuOpen(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      role === 'passenger' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div>Passenger</div>
                        <div className="text-[10px] text-slate-400 font-normal">Route planning & hazard reports</div>
                      </div>
                    </div>
                    {role === 'passenger' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <button
                    onClick={() => { setRole('employer'); setIsRoleMenuOpen(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      role === 'employer' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div>Employer</div>
                        <div className="text-[10px] text-slate-400 font-normal">Consented workforce delay proof</div>
                      </div>
                    </div>
                    {role === 'employer' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => { setRole('authority'); setIsRoleMenuOpen(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      role === 'authority' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>Traffic Authority</div>
                        <div className="text-[10px] text-slate-400 font-normal">Hotspots, auditing & certification</div>
                      </div>
                    </div>
                    {role === 'authority' && <Check className="w-4 h-4 text-amber-400" />}
                  </button>

                  <div className="mt-1 pt-1 border-t border-slate-800 px-2 py-1 text-[9px] text-slate-500">
                    *Frontend demonstration role switching; non-secure simulation.
                  </div>
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Profile Dropdown / Settings / Reset */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs border border-cyan-400/30 shadow hover:opacity-90 transition-opacity"
              >
                RW
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="p-2.5 border-b border-slate-800">
                    <div className="font-bold text-xs text-white">RouteWise Demo User</div>
                    <div className="text-[11px] text-slate-400 font-mono">user@routewise.demo</div>
                    <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 capitalize">
                      Active: {role}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <span>Privacy & Preferences</span>
                    </Link>
                    <Link
                      to="/reports"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Monthly Reports (CSV)</span>
                    </Link>
                    <Link
                      to="/help"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-purple-400" />
                      <span>Help & Documentation</span>
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-amber-400" />
                      <span>Login / Switch Account</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search incidents or routes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500"
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                🏠 Home
              </Link>
              <Link
                to="/passenger"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                🗺️ Passenger Map
              </Link>
              <Link
                to="/routes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                🧭 Plan Route
              </Link>
              <Link
                to="/report"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                ⚠️ Report Incident
              </Link>
              <Link
                to="/journeys"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                🚗 My Journeys
              </Link>
              <Link
                to="/intelligence"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                📊 Traffic AI
              </Link>
              <Link
                to="/employer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                🏢 Employer Desk
              </Link>
              <Link
                to="/employees"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                👥 Employees
              </Link>
              <Link
                to="/reports"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                📑 Monthly Reports
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:border-cyan-500/50"
              >
                ⚙️ Settings
              </Link>
            </div>

            {/* Mobile Role Switcher */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Switch Demo Role:</span>
              <div className="flex gap-1">
                {['passenger', 'employer', 'authority'].map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setIsMobileMenuOpen(false); }}
                    className={`px-2 py-1 rounded-lg capitalize text-[11px] font-bold ${
                      role === r ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Emergency SOS Modal */}
      <EmergencyModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
      />
    </>
  );
}
