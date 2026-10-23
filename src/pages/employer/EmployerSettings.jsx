import React from 'react';

export default function EmployerSettings() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Attendance waiver thresholds and compliance preferences</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-white text-sm">Automated Attendance Waiver Rules</h3>
        <p className="text-slate-400 leading-relaxed">
          When an employee journey is affected by a Level 4+ verified traffic hazard resulting in greater than 15 minutes of delay, RouteWise generates an excusable delay certificate automatically.
        </p>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Minimum Delay Threshold for Waiver:</span>
            <span className="font-mono text-emerald-400 font-bold">15 Minutes</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Minimum TrustScore for Automatic Acceptance:</span>
            <span className="font-mono text-cyan-400 font-bold">Level 4 (Telemetry Verified)</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Data Retention Period for Attendance Records:</span>
            <span className="font-mono text-slate-200">7 Days (Auto-Purge)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
