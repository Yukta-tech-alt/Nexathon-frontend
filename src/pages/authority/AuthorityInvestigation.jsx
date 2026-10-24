import React from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { FileSearch, Lightbulb, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AuthorityInvestigation() {
  const studies = [
    {
      title: 'Junction Capacity & Weaving Study',
      location: 'Nanthoor Junction Circle, Mangaluru',
      priority: 'High Priority',
      action: 'Grade-separated underpass evaluation with NHAI',
      status: 'Field Review Recommended'
    },
    {
      title: 'Monsoon Stormwater Drainage Capacity Review',
      location: 'Pumpwell (Mahaveera Circle) Underpass',
      priority: 'Critical Priority',
      action: 'Upgrade sump pumping capacity to 3,500 L/sec',
      status: 'Awaiting Municipal PWD Review'
    },
    {
      title: 'Dynamic Traffic Signal Optimization Cycle',
      location: 'Kottara Chowki Flyover Underpass Node',
      priority: 'Medium Priority',
      action: 'Implement 90s arterial green extension during 08:30–09:45 AM peak',
      status: 'Ready for Simulated Pilot'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-400" />
            <span>Civic Engineering Investigation Dossiers</span>
          </h1>
          <p className="text-xs text-slate-400">
            Decision-support studies generated from recurring incident density telemetry
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {studies.map((s, idx) => (
          <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">{s.priority}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{s.title}</h3>
                <p className="text-[11px] text-slate-400">{s.location}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 font-mono text-[10px] border border-slate-800">
                {s.status}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Action:</span>
              <p className="font-semibold text-slate-200">{s.action}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span>Decision-Support Advisory</span>
              <span className="text-cyan-400 font-semibold hover:underline cursor-pointer">
                Export Technical Brief →
              </span>
            </div>
          </div>
        ))}

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          *Important Statutory Note: Decision-support information only. Final engineering design, funding allocation, and physical interventions remain with the competent municipal authority and National Highways Authority of India.
        </div>
      </div>
    </div>
  );
}
