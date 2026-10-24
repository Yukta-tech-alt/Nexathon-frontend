import React from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  Compass
} from 'lucide-react';
import { CITY_PULSE_DATA } from '../data/roadTruthData';

export default function CityPulse() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              {CITY_PULSE_DATA.city} City Pulse (Dashboard)
            </h3>
            <p className="text-xs text-slate-400">
              Live city-wide traffic condition • {CITY_PULSE_DATA.timestamp}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-emerald-400 font-semibold font-mono">Live Telemetry Active</span>
        </div>
      </div>

      {/* Main Grid: Gauge + Heatmap + 4 Status Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: City Mobility Circular Gauge */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            City Mobility Index
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                className="text-slate-800"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                className="text-amber-400"
                strokeWidth="7"
                strokeDasharray={238.76}
                strokeDashoffset={238.76 * (1 - CITY_PULSE_DATA.mobilityScore / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{CITY_PULSE_DATA.mobilityScore}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">/ 100</span>
            </div>
          </div>

          <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {CITY_PULSE_DATA.mobilityLabel}
          </span>
          <p className="text-[11px] text-slate-400 mt-2">
            72% of city arterials moving within normal velocity thresholds
          </p>
        </div>

        {/* Center/Right: Interactive Simulated Heatmap matching design */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200">Traffic Heatmap</span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span>Low</span>
              <div className="w-20 h-2 rounded bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"></div>
              <span>High</span>
            </div>
          </div>

          {/* Heatmap Graphic Representation */}
          <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
            <div 
              className="absolute inset-0 opacity-40 bg-cover bg-center"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')` }}
            />
            {/* Heatmap glow clusters */}
            <div className="absolute top-1/3 left-1/4 w-28 h-28 bg-emerald-500/40 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/50 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 right-1/4 w-24 h-24 bg-red-500/60 rounded-full blur-2xl animate-pulse"></div>
            
            <div className="relative z-10 text-center bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-white block">Mangaluru Metro Grid</span>
              <span className="text-[10px] text-slate-400">Density analysis based on 45,000 live commuter signals</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Status Counters matching design */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {/* Critical Zones */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-red-500/20">
          <span className="text-2xl font-black text-red-400 block">{CITY_PULSE_DATA.criticalZones}</span>
          <span className="text-xs text-slate-300 font-semibold mt-0.5 block">Critical Zones</span>
          <span className="text-[10px] text-red-400/80">Immediate attention</span>
        </div>

        {/* Heavy Traffic */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/20">
          <span className="text-2xl font-black text-amber-400 block">{CITY_PULSE_DATA.heavyTraffic}</span>
          <span className="text-xs text-slate-300 font-semibold mt-0.5 block">Heavy Traffic</span>
          <span className="text-[10px] text-amber-400/80">Major corridors</span>
        </div>

        {/* Normal Roads */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/20">
          <span className="text-2xl font-black text-emerald-400 block">{CITY_PULSE_DATA.normalRoads}</span>
          <span className="text-xs text-slate-300 font-semibold mt-0.5 block">Normal Roads</span>
          <span className="text-[10px] text-emerald-400/80">Optimal speed</span>
        </div>

        {/* Road Closures */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-700">
          <span className="text-2xl font-black text-slate-300 block">{CITY_PULSE_DATA.roadClosures}</span>
          <span className="text-xs text-slate-300 font-semibold mt-0.5 block">Road Closures</span>
          <span className="text-[10px] text-slate-400">Planned work</span>
        </div>
      </div>
    </div>
  );
}
