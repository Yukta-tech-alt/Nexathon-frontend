import React from 'react';

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 w-20 bg-slate-800 rounded"></div>
            <div className="h-6 w-6 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-8 w-28 bg-slate-800 rounded"></div>
          <div className="h-3 w-36 bg-slate-800/60 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function MapSkeleton({ height = '450px' }) {
  return (
    <div 
      className="w-full rounded-2xl bg-slate-900 border border-slate-800 animate-pulse flex flex-col items-center justify-center p-6 text-slate-600 space-y-3"
      style={{ height }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin"></div>
      <span className="text-xs font-mono text-slate-500">Initializing Leaflet Telemetry Canvas...</span>
    </div>
  );
}

export function ChartSkeleton({ height = '260px' }) {
  return (
    <div 
      className="w-full rounded-2xl bg-slate-900 border border-slate-800 animate-pulse p-6 space-y-4"
      style={{ height }}
    >
      <div className="h-4 w-40 bg-slate-800 rounded"></div>
      <div className="h-full flex items-end gap-3 pt-6 pb-2">
        {[40, 65, 30, 85, 50, 95, 60, 45, 75, 55].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-800 rounded-t" style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 animate-pulse p-5 space-y-4">
      <div className="flex justify-between pb-3 border-b border-slate-800">
        <div className="h-4 w-32 bg-slate-800 rounded"></div>
        <div className="h-4 w-24 bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-3">
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800"></div>
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-slate-800 rounded"></div>
                <div className="h-2.5 w-16 bg-slate-800/60 rounded"></div>
              </div>
            </div>
            <div className="h-3 w-20 bg-slate-800 rounded"></div>
            <div className="h-3 w-16 bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
