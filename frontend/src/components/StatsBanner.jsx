import React from 'react';
import { AlertOctagon, CheckCircle2, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function StatsBanner({ hazards, onFilterStatus }) {
  const total = hazards.length;
  const critical = hazards.filter(h => h.severity === 'critical' && h.status !== 'resolved').length;
  const resolved = hazards.filter(h => h.status === 'resolved').length;
  const totalUpvotes = hazards.reduce((acc, h) => acc + (h.upvotes || 0), 0);
  const resolvedPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4">
      {/* Total Reported */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('all')}
        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer transition-all"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Hazards</span>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{total}</span>
          <span className="text-xs text-blue-400 font-medium">Mapped alerts</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Across 8 municipal wards</p>
      </div>

      {/* Critical Active */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('critical')}
        className="bg-slate-900/90 border border-red-500/20 hover:border-red-500/40 p-4 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer transition-all"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/15 transition-colors" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping inline-block"></span>
            Critical Unfixed
          </span>
          <div className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-red-400">{critical}</span>
          <span className="text-xs text-red-300 font-medium">Urgent danger</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Tyre damage & crash risk</p>
      </div>

      {/* Community Resolved */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('resolved')}
        className="bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-500/40 p-4 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer transition-all"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/15 transition-colors" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Verified Fixed</span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{resolved}</span>
          <span className="text-xs text-emerald-300 font-medium">({resolvedPercentage}% rate)</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Repaired with photo proof</p>
      </div>

      {/* Community Truth Upvotes */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Community Backing</span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{totalUpvotes}</span>
          <span className="text-xs text-slate-400 font-medium">Confirmations</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Crowdsourced validation</p>
      </div>
    </div>
  );
}
