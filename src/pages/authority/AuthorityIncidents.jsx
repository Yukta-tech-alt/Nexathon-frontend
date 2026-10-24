import React from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { Radio, ShieldCheck, CheckCircle2, Trash2 } from 'lucide-react';

export default function AuthorityIncidents() {
  const { incidents, resolveIncident, deleteIncident } = useRouteWise();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Incidents</h1>
          <p className="text-xs text-slate-400 mt-0.5">Municipal incident response queue and road clearance</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold">
          {incidents.length} Logged
        </span>
      </div>

      {incidents.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
          <p className="text-white font-bold text-sm">No incidents in queue</p>
          <p className="mt-1">All road corridors are currently clear of obstructions.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Incident</th>
                  <th className="py-2.5 px-4 font-semibold">Location</th>
                  <th className="py-2.5 px-4 font-semibold">Severity</th>
                  <th className="py-2.5 px-4 font-semibold">Delay</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      {inc.title || inc.category}
                      <span className="block text-[11px] text-slate-500 capitalize">{inc.category} · {inc.reportedAgo || 'Recent'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{inc.locationName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        inc.severity === 'severe' || inc.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : inc.severity === 'moderate'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {inc.severity || 'Moderate'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-amber-400">
                      +{inc.delayMinutes || 15}m
                    </td>
                    <td className="py-3 px-4">
                      {inc.status === 'cleared' ? (
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold text-[11px]">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inc.status !== 'cleared' && (
                          <button
                            onClick={() => resolveIncident(inc.id)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-colors"
                          >
                            Mark Cleared
                          </button>
                        )}
                        <button
                          onClick={() => deleteIncident(inc.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
