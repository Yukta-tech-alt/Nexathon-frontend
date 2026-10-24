import React from 'react';
import { AlertTriangle, PlusCircle, MapPin, BarChart3, ListFilter, ShieldCheck, Flame, Bell } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenReportModal, unreadAlertsCount, totalHazardsCount }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner Alert Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-4 py-1 text-xs text-white flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-bold tracking-wide uppercase text-[10px] bg-black/30 px-1.5 py-0.5 rounded">Live Truth Ticker:</span>
          <span className="text-white/95">
            🚨 Domlur Flyover Crater verified by 42 commuters • 💧 Koramangala 4th Block severe waterlogging • 🟢 Whitefield ITPL road patched & verified fixed!
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-white/90">
          <span>{totalHazardsCount} Active Alerts</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('map')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
            <AlertTriangle className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent">
                RoadTruth
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Civic Sentinel
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Crowdsourced Road Safety & Hazard Accountability</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden md:flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Live Map
          </button>
          <button
            onClick={() => setActiveView('feed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeView === 'feed'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Hazard Feed
          </button>
          <button
            onClick={() => setActiveView('scorecard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeView === 'scorecard'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Civic Scorecard
          </button>
        </div>

        {/* Action Button: Report Hazard */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all text-sm group"
          >
            <PlusCircle className="w-4 h-4 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
            <span>Report Road Truth</span>
          </button>
        </div>
      </div>

      {/* Mobile view sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2">
        <button
          onClick={() => setActiveView('map')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg ${
            activeView === 'map' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Map
        </button>
        <button
          onClick={() => setActiveView('feed')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg ${
            activeView === 'feed' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          Feed
        </button>
        <button
          onClick={() => setActiveView('scorecard')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg ${
            activeView === 'scorecard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Scorecard
        </button>
      </div>
    </header>
  );
}
