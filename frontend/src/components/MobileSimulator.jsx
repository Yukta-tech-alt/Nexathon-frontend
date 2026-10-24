import React from 'react';
import { 
  Wifi, 
  Battery, 
  Search, 
  Home, 
  Briefcase, 
  Plus, 
  MapPin, 
  AlertTriangle, 
  Bell, 
  Route, 
  PhoneCall, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { MOCK_INCIDENTS } from '../data/roadTruthData';

export default function MobileSimulator({ 
  onSelectIncident, 
  onOpenReportModal, 
  onNavigateSection 
}) {
  const topAlert = MOCK_INCIDENTS[0];

  return (
    <div className="flex items-center justify-center p-2">
      {/* Phone Mockup Frame */}
      <div className="w-[320px] sm:w-[350px] bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden ring-1 ring-white/10 flex flex-col relative text-white">
        {/* Notch / Dynamic Island */}
        <div className="pt-3 px-6 flex items-center justify-between text-[11px] text-slate-400 font-semibold select-none">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">RoadTruth</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button aria-label="Notifications" className="p-1.5 hover:text-white">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center border border-cyan-500/30">
              Y
            </div>
          </div>
        </div>

        {/* Greeting matching design: Hi, Yukta 🚗 Where are you going today? */}
        <div className="px-5 pt-2">
          <h2 className="text-base font-extrabold text-white leading-tight">
            Hi, Yukta 🚗
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Where are you going today?
          </p>

          {/* Search Input */}
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search destination..."
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 mt-2.5">
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white">
              <Home className="w-3 h-3 text-cyan-400" />
              <span>Home</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white">
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span>Work</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/60 border border-dashed border-slate-700 text-[11px] font-semibold text-slate-400 hover:text-white">
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          {/* Current Location Pill */}
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>Current Location: <strong className="text-slate-200">Mangaluru, Karnataka</strong></span>
          </div>

          {/* Live Traffic Widget with Mini Bars */}
          <div className="mt-3 p-3 bg-gradient-to-br from-slate-900 to-slate-850 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Live Traffic</span>
                <div className="text-xs font-bold text-amber-400">Moderate congestion</div>
                <div className="text-[10px] text-slate-400">12 active incidents nearby</div>
              </div>
              <div className="flex items-end gap-1 h-8">
                <div className="w-2 bg-emerald-500 h-3 rounded-t"></div>
                <div className="w-2 bg-emerald-500 h-4 rounded-t"></div>
                <div className="w-2 bg-amber-500 h-6 rounded-t"></div>
                <div className="w-2 bg-red-500 h-8 rounded-t"></div>
                <div className="w-2 bg-amber-500 h-5 rounded-t"></div>
              </div>
            </div>
          </div>

          {/* 4 Quick Action Buttons matching the design */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {/* Report */}
            <button 
              onClick={onOpenReportModal}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all group"
            >
              <AlertTriangle className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">Report</span>
            </button>

            {/* Alerts */}
            <button 
              onClick={() => onNavigateSection && onNavigateSection('alerts')}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-all group"
            >
              <Bell className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">Alerts</span>
            </button>

            {/* Routes */}
            <button 
              onClick={() => onNavigateSection && onNavigateSection('routes')}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 transition-all group"
            >
              <Route className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">Routes</span>
            </button>

            {/* SOS */}
            <button 
              onClick={() => alert('Emergency Traffic Control / Highway Patrol: Calling 112...')}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-900/60 transition-all group"
            >
              <PhoneCall className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform text-rose-400" />
              <span className="text-[10px] font-bold">SOS</span>
            </button>
          </div>

          {/* Recent Alerts Section matching design */}
          <div className="mt-3.5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Recent Alerts</span>
              <span className="text-[10px] text-cyan-400 font-semibold cursor-pointer">See All &gt;</span>
            </div>

            {/* Alert card */}
            <div 
              onClick={() => onSelectIncident(topAlert.id)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-white truncate">Accident</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold">Verified</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">NH-66, 2.3 km away</p>
                </div>
              </div>
              <span className="text-[10px] text-red-400 font-bold whitespace-nowrap ml-2">25 min delay</span>
            </div>
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div className="pb-2 pt-1 flex justify-center">
          <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
