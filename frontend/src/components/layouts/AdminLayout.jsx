import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { ShieldAlert, Database, Users, AlertTriangle, FileText, Sun, Moon, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme, clearAllData, loadSeedData } = useRouteWise();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-4 shrink-0 justify-between">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">System Admin</div>
              <div className="text-[10px] text-purple-400 font-mono">RouteWise Root Console</div>
            </div>
          </Link>

          <nav className="space-y-1 text-xs">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold ${
                  isActive ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              <Database className="w-4 h-4 text-purple-400" />
              <span>System & Data Manager</span>
            </NavLink>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={loadSeedData}
            className="w-full py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
          >
            Load Seed Demo Records
          </button>
          <button
            onClick={clearAllData}
            className="w-full py-1.5 px-2.5 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 rounded-lg font-semibold"
          >
            Clear All Stored Records
          </button>
          <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400">
            <button onClick={toggleTheme}>Theme: {theme}</button>
            <button onClick={() => navigate('/')} className="hover:text-white">Exit Admin →</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-6 max-w-6xl w-full mx-auto overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
