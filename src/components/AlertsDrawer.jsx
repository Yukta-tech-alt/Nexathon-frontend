import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Droplets, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { MOCK_INCIDENTS } from '../data/roadTruthData';

export default function AlertsDrawer({ onSelectIncident }) {
  const [filter, setFilter] = useState('all');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-5 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Alerts</h3>
        </div>
        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
          4 Urgent Alerts
        </span>
      </div>

      {/* Filter Chips matching design: All, Incidents, Routes, Safety */}
      <div className="flex items-center gap-1.5 my-3">
        {[
          { id: 'all', label: 'All' },
          { id: 'incidents', label: 'Incidents' },
          { id: 'routes', label: 'Routes' },
          { id: 'safety', label: 'Safety' }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id)}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === chip.id
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Alerts Stream matching design */}
      <div className="space-y-2.5">
        {/* Item 1: Verified Accident */}
        <div 
          onClick={() => onSelectIncident('inc-01')}
          className="p-3 rounded-2xl bg-slate-950 border border-red-500/30 hover:border-red-500/60 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Verified Accident
            </span>
            <span className="text-[10px] text-slate-400">2 min ago</span>
          </div>
          <p className="text-[11px] text-white font-medium">NH-66, 2.3 km ahead</p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-red-400 font-bold">Expected delay: 25 min</span>
            <span className="text-emerald-400 font-semibold">Bypass ready</span>
          </div>
        </div>

        {/* Item 2: Flood Risk */}
        <div 
          onClick={() => onSelectIncident('inc-03')}
          className="p-3 rounded-2xl bg-slate-950 border border-blue-500/30 hover:border-blue-500/60 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> Flood Risk
            </span>
            <span className="text-[10px] text-slate-400">12 min ago</span>
          </div>
          <p className="text-[11px] text-white font-medium">Kottara, 3.8 km ahead</p>
          <p className="text-[10px] text-slate-400">Alternative route recommended via Kuntikan</p>
        </div>

        {/* Item 3: Road Closure */}
        <div 
          onClick={() => onSelectIncident('inc-02')}
          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Road Closure
            </span>
            <span className="text-[10px] text-slate-400">25 min ago</span>
          </div>
          <p className="text-[11px] text-white font-medium">Bejai, 5.1 km ahead</p>
          <p className="text-[10px] text-slate-400">Use alternate route for KSRTC terminal</p>
        </div>

        {/* Item 4: Recurring Problem */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Recurring Problem
            </span>
            <span className="text-[10px] text-slate-400">1 hour ago</span>
          </div>
          <p className="text-[11px] text-white font-medium">Pumpwell congestion detected</p>
          <p className="text-[10px] text-slate-400">4 days this week had bottleneck between 5-7 PM</p>
        </div>
      </div>
    </div>
  );
}
