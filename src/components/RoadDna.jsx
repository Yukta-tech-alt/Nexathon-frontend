import React, { useState } from 'react';
import { 
  Dna, 
  AlertTriangle, 
  Clock, 
  Droplets, 
  Hammer, 
  TrendingUp, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { ROAD_DNA_DATA } from '../data/roadTruthData';

export default function RoadDna() {
  const [selectedDayType, setSelectedDayType] = useState('both'); // weekdays, weekends, or both

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Road DNA (Historical Analysis)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine intelligence profiling of chronic congestion patterns & blackspots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono">
            {ROAD_DNA_DATA.location}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Risk Profile + Right Historical Traffic Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: Location Photo + Risk Gauge + 30-Day Stats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Junction Photo */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1543393470-bce01e0a233b?auto=format&fit=crop&w=400&q=80" 
                alt="Thokkottu Junction" 
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{ROAD_DNA_DATA.location}</h4>
              <p className="text-xs text-slate-400">Mangaluru Highway Arterial</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-black text-red-400 font-mono">
                  {ROAD_DNA_DATA.riskScore}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">/ 100</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold ml-1">
                  High Risk
                </span>
              </div>
            </div>
          </div>

          {/* Last 30 Days Stats Grid matching design */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Last 30 Days Disruption Events
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900 p-2 rounded-xl border border-red-500/20">
                <span className="text-base font-extrabold text-red-400 block">{ROAD_DNA_DATA.last30Days.congestion}</span>
                <span className="text-[10px] text-slate-400">Congestion</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-amber-500/20">
                <span className="text-base font-extrabold text-amber-400 block">{ROAD_DNA_DATA.last30Days.accidents}</span>
                <span className="text-[10px] text-slate-400">Accidents</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-blue-500/20">
                <span className="text-base font-extrabold text-blue-400 block">{ROAD_DNA_DATA.last30Days.rainRelated}</span>
                <span className="text-[10px] text-slate-400">Rain Related</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-purple-500/20">
                <span className="text-base font-extrabold text-purple-400 block">{ROAD_DNA_DATA.last30Days.construction}</span>
                <span className="text-[10px] text-slate-400">Construction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Traffic Pattern Bar Chart (Peak 8:15 AM - 10:15 AM) */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Traffic Pattern
              </h4>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                Peak: {ROAD_DNA_DATA.peakHours}
              </p>
            </div>

            {/* Weekdays vs Weekends Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>
                <span className="text-slate-300">Weekdays</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                <span className="text-slate-300">Weekends</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 pt-4 flex items-end justify-between gap-2 border-b border-slate-800 pb-2">
            {ROAD_DNA_DATA.hourlyDistribution.map((slot, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  {/* Weekday bar */}
                  <div 
                    style={{ height: `${slot.weekday}%` }} 
                    className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all group-hover:brightness-125"
                    title={`Weekday ${slot.hour}: ${slot.weekday}% volume`}
                  />
                  {/* Weekend bar */}
                  <div 
                    style={{ height: `${slot.weekend}%` }} 
                    className="w-1/2 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all group-hover:brightness-125"
                    title={`Weekend ${slot.hour}: ${slot.weekend}% volume`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{slot.hour}</span>
              </div>
            ))}
          </div>

          {/* System Insight Note matching design */}
          <div className="p-3 bg-slate-900 rounded-xl border border-cyan-500/20 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400 font-bold">System Insight:</strong> {ROAD_DNA_DATA.systemInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
