import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Compass,
  BarChart2,
  TrendingDown,
  Navigation
} from 'lucide-react';

export default function LandingHero({ onSelectIncident, onExploreRoutes, onSearchDestination }) {
  const [destination, setDestination] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination.trim() && onSearchDestination) {
      onSearchDestination(destination);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
      {/* Top Hero Navigation Bar */}
      <div className="border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 shadow-md">
            <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
          </div>
          <span className="font-extrabold text-base text-white">RoadTruth</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <a href="#features" className="text-white hover:text-cyan-400 transition-colors">Home</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg">
            Login
          </button>
          <button 
            onClick={onExploreRoutes}
            className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-1.5 rounded-xl transition-all shadow-md shadow-emerald-500/20"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Main Hero Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Column: Copy & Search */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-6 z-10">
          {/* Live Intelligence Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE TRAFFIC INTELLIGENCE</span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Smarter Alerts. <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Safer Roads.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-lg leading-relaxed">
              Verified, cause-aware traffic intelligence for everyday commuters, organizations, and smarter cities. See why delays happen before you leave.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative flex items-center bg-slate-950 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search destination"
                className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all shrink-0 font-black shadow-lg shadow-emerald-500/20"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Stat Chips matching the design */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-red-500/30 text-xs">
              <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm">12</span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Active Incidents</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm">7</span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Congestion Zones</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm">24</span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Verified Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Glowing Night Highway Visual with Interactive Pins */}
        <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-full overflow-hidden bg-slate-950 flex items-center justify-center p-6">
          {/* Background Night City Highway Graphic */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen bg-cover bg-center"
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80')` }}
          />

          {/* Glowing road light traces svg overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradGreen" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Red congested path */}
            <path d="M 50 350 Q 200 250 280 180 T 450 70" fill="none" stroke="url(#gradRed)" strokeWidth="6" strokeDasharray="8 6" className="animate-pulse" />
            {/* Smart Green bypass path */}
            <path d="M 50 350 Q 120 180 250 120 T 450 70" fill="none" stroke="url(#gradGreen)" strokeWidth="5" />
          </svg>

          {/* Floating Callout 1: Accident Alert */}
          <div 
            onClick={() => onSelectIncident && onSelectIncident('inc-01')}
            className="absolute top-8 right-6 sm:right-12 z-20 bg-slate-900/95 backdrop-blur-md border border-red-500/40 p-3 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform max-w-[240px]"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">Accident • NH-66</h4>
                <p className="text-[11px] text-red-400 font-semibold">25 min delay</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified (92%)
              </span>
              <span className="text-slate-400">Thokkottu</span>
            </div>
          </div>

          {/* Floating Callout 2: Alternative Route */}
          <div 
            onClick={onExploreRoutes}
            className="absolute bottom-24 left-6 sm:left-10 z-20 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 p-3 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Alternative Route</h4>
                <p className="text-[11px] text-emerald-400 font-bold">18 min faster</p>
              </div>
            </div>
          </div>

          {/* Floating Callout 3: Live Traffic Widget */}
          <div className="absolute bottom-6 right-6 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl w-52">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">Live Traffic</span>
              <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.5 rounded bg-amber-500/10">Moderate</span>
            </div>
            <p className="text-[11px] text-slate-300">Mangaluru City</p>
            {/* Mini bars */}
            <div className="flex items-end gap-1.5 h-7 mt-2 pt-1 border-t border-slate-800">
              <div className="w-3 bg-emerald-500 h-2 rounded-t"></div>
              <div className="w-3 bg-emerald-500 h-3 rounded-t"></div>
              <div className="w-3 bg-amber-500 h-5 rounded-t"></div>
              <div className="w-3 bg-red-500 h-7 rounded-t animate-pulse"></div>
              <div className="w-3 bg-amber-500 h-4 rounded-t"></div>
              <div className="w-3 bg-emerald-500 h-3 rounded-t"></div>
            </div>
            <span className="text-[9px] text-slate-400 block mt-1">Updated 2 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
