import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  Activity, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Search, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Upload, 
  Menu, 
  X,
  Radio,
  FileSearch
} from 'lucide-react';
import CSVImportModal from '../forms/CSVImportModal';

export default function AuthorityLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme, incidents, importDataset } = useRouteWise();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/authority', icon: Activity, end: true },
    { label: 'Incidents', path: '/authority/incidents', icon: Radio },
    { label: 'Hotspots', path: '/authority/hotspots', icon: MapPin },
    { label: 'Recurring Problems', path: '/authority/recurring', icon: TrendingUp },
    { label: 'Analytics', path: '/authority/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/authority/reports', icon: FileText },
    { label: 'Settings', path: '/authority/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* DESKTOP AUTHORITY SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950/95 p-4 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
                RouteWise <span className="text-amber-400 font-mono text-xs">AI</span>
              </div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block -mt-0.5">
                Traffic Authority Center
              </span>
            </div>
          </Link>

          {/* Active Incidents Monitor Badge */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Active Telemetry Stream
            </span>
            <div className="text-lg font-black text-amber-400 font-mono flex items-center justify-between">
              <span>{incidents.filter(i => i.status !== 'cleared').length} Active Hazards</span>
              <span className="text-[10px] text-emerald-400 font-sans font-semibold">Grid Active</span>
            </div>
          </div>

          {/* Navigation Items (Strictly Authority Only) */}
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
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => navigate('/select-role')}
              className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white text-sm">Traffic Authority Center</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
              <item.icon className="w-4 h-4 text-amber-400" />
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
        {/* Top Command Strip */}
        <div className="border-b border-slate-800/80 bg-slate-950/60 px-4 sm:px-8 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Authority Telemetry Command:</span>
            <span>Coastal Karnataka Highways & Urban Transit Grid</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>Import Traffic CSV</span>
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

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
