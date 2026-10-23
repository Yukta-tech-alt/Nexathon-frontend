import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { Clock, TrendingUp, AlertTriangle, ArrowRight, Sparkles, Calendar, ShieldCheck } from 'lucide-react';

export default function CommuteIntelligenceCard({ selectedRoute = null }) {
  const { routes } = useRouteWise();
  const route = selectedRoute || routes[0];

  const typicalTime = route?.typicalDurationMin || 35;
  const currentTime = route?.currentDurationMin || 52;
  const extraDelay = Math.max(0, currentTime - typicalTime);

  // Suggested departure time calculation
  const now = new Date();
  const targetArrival = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  const suggestedDeparture = new Date(targetArrival.getTime() - currentTime * 60 * 1000);
  const suggestedTimeStr = suggestedDeparture.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-2xl shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Commute Intelligence</h4>
            <p className="text-[11px] text-slate-400">Predictive delay & departure telemetry</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
          Simulated AI Estimate
        </span>
      </div>

      {/* Main Comparison Callout */}
      <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-2">
        <div className="text-xs font-semibold text-slate-300">
          Your usual journey takes <span className="text-emerald-400 font-bold font-mono">{typicalTime} minutes</span>. 
          Today's estimated journey takes <span className="text-amber-400 font-bold font-mono">{currentTime} minutes</span>.
        </div>
        <div className="flex items-center gap-2 text-xs text-red-300 font-medium">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Estimated extra delay: <strong>+{extraDelay} mins</strong> due to corridor congestion.</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Typical Time</span>
          <span className="text-base font-black text-slate-200 mt-1 block font-mono">{typicalTime}m</span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Today</span>
          <span className="text-base font-black text-amber-400 mt-1 block font-mono">{currentTime}m</span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Extra Delay</span>
          <span className="text-base font-black text-red-400 mt-1 block font-mono">+{extraDelay}m</span>
        </div>

        <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30">
          <span className="text-[10px] text-cyan-300 uppercase tracking-wider block font-bold">Suggested Leave</span>
          <span className="text-base font-black text-cyan-400 mt-1 block font-mono">{suggestedTimeStr}</span>
        </div>
      </div>

      {/* Historical Trend Note */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Historical Trend: Thursday peak is typically 22% higher than Tuesday</span>
        </div>
        <span className="font-mono text-slate-500">Route: {route?.name}</span>
      </div>
    </div>
  );
}
