import React from 'react';

export default function AuthoritySettings() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Telemetry consensus parameters and clearance thresholds</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-white text-sm">Stationary Deceleration Sensor Parameters</h3>
        <p className="text-slate-400 leading-relaxed">
          Incidents are elevated to Level 4 (Telemetry Validated) when probe speeds fall below 5.0 km/h across at least 10 reporting devices within a 300-meter corridor bounding box.
        </p>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Stall Speed Threshold:</span>
            <span className="font-mono text-amber-400 font-bold">&lt; 5.0 km/h</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Minimum Corroborating Devices:</span>
            <span className="font-mono text-cyan-400 font-bold">10 Mobile / GPS Nodes</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Authority Clearance SLA Window:</span>
            <span className="font-mono text-slate-200">45 Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
