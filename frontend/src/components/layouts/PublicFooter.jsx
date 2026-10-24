import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ShieldCheck, Cpu } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <Navigation className="w-4 h-4 fill-slate-950 rotate-45" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                RouteWise <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Connecting road incident reporting, TrustScore verification, route intelligence, and workforce commute analytics.
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
              <span className="text-cyan-400 font-bold">Report → Verify → Alert → Analyse → Improve</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Role Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/select-role" className="hover:text-cyan-400 transition-colors">Choose Role Experience</Link></li>
              <li><Link to="/passenger" className="hover:text-cyan-400 transition-colors">Passenger Dashboard</Link></li>
              <li><Link to="/employer" className="hover:text-cyan-400 transition-colors">Employer Portal</Link></li>
              <li><Link to="/authority" className="hover:text-cyan-400 transition-colors">Traffic Authority Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About RouteWise AI</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Help & Documentation</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Demo Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>© 2026 RouteWise AI. Next-Generation Traffic Intelligence & Commute Management.</div>
          <div className="flex gap-4">
            <Link to="/help" className="hover:text-slate-300">Privacy First Policy</Link>
            <Link to="/help" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
