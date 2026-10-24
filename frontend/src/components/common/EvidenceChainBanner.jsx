import React from 'react';
import { 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Users, 
  Camera, 
  ShieldCheck, 
  Bell, 
  BarChart3, 
  ArrowRight 
} from 'lucide-react';

export default function EvidenceChainBanner() {
  const steps = [
    { title: 'INCIDENT', icon: AlertTriangle, color: 'text-red-400' },
    { title: 'REPORT', icon: FileText, color: 'text-amber-400' },
    { title: 'LOCATION', icon: MapPin, color: 'text-cyan-400' },
    { title: 'MATCHING REPORTS', icon: Users, color: 'text-blue-400' },
    { title: 'EVIDENCE', icon: Camera, color: 'text-emerald-400' },
    { title: 'VERIFICATION', icon: ShieldCheck, color: 'text-teal-400' },
    { title: 'ALERT', icon: Bell, color: 'text-amber-400' },
    { title: 'ANALYSIS', icon: BarChart3, color: 'text-purple-400' }
  ];

  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3 flex items-center justify-between">
        <span>RouteWise AI Verified Evidence Chain Architecture</span>
        <span className="hidden sm:inline text-slate-500 font-mono">Consensus Pipeline</span>
      </div>

      <div className="flex items-center justify-between overflow-x-auto pb-1 gap-1 text-[11px] font-bold">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800/80 shrink-0">
                <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                <span className="text-slate-200 tracking-wider text-[10px]">{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
