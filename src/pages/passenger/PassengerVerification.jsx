import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { CheckCircle, Circle, ShieldCheck, Camera, FileText } from 'lucide-react';

export default function PassengerVerification() {
  const { incidents } = useRouteWise();
  const [selectedId, setSelectedId] = useState(incidents[0]?.id || null);
  const [showEvidence, setShowEvidence] = useState(false);

  const incident = incidents.find(i => i.id === selectedId) || incidents[0];

  if (!incidents.length) {
    return (
      <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2 text-xs text-slate-400">
        <p className="text-white font-bold text-sm">No incidents available</p>
        <p>Submit or import an incident to view verification signals.</p>
      </div>
    );
  }

  const level = incident?.verificationLevel || 3;
  const signalsCount = Math.min(level, 5);

  const signals = [
    { title: 'User Reported', desc: 'Crowdsourced community notice logged', done: true },
    { title: 'GPS Confirmed', desc: 'Device location matched road corridor', done: level >= 2 },
    { title: 'Multiple Reports', desc: `${incident.confirmationCount || 3} citizen reports clustered`, done: level >= 3 },
    { title: 'Evidence', desc: 'Forensic media or stall speed telemetry', done: level >= 4 },
    { title: 'Authority', desc: 'Municipal traffic command certified', done: level >= 5 }
  ];

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Verification</h1>
          <p className="text-xs text-cyan-400 font-bold mt-0.5">
            {signalsCount} of 5 signals available
          </p>
        </div>

        {incident.imageUrl && (
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            {showEvidence ? 'Hide Evidence' : 'View Evidence'}
          </button>
        )}
      </div>

      {/* Incident Switcher Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {incidents.map((inc) => (
          <button
            key={inc.id}
            onClick={() => { setSelectedId(inc.id); setShowEvidence(false); }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shrink-0 transition-colors ${
              incident.id === inc.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {inc.category || 'Hazard'} · {inc.locationName?.split(',')[0]}
          </button>
        ))}
      </div>

      {/* 2. Compact Vertical Timeline */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white capitalize">{incident.title || incident.locationName}</h2>
          <p className="text-xs text-slate-400">{incident.locationName} · Delay: +{incident.delayMinutes}m</p>
        </div>

        <div className="space-y-3 pt-1">
          {signals.map((sig, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {sig.done ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                {i < signals.length - 1 && (
                  <div className={`w-0.5 h-6 my-1 ${sig.done ? 'bg-emerald-500/40' : 'bg-slate-800'}`}></div>
                )}
              </div>
              <div className="-mt-0.5">
                <div className={`text-xs font-bold ${sig.done ? 'text-slate-200' : 'text-slate-500'}`}>
                  {sig.title}
                </div>
                <div className="text-[11px] text-slate-500">{sig.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Drawer */}
      {showEvidence && incident.imageUrl && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submitted Media Evidence</h3>
          <img
            src={incident.imageUrl}
            alt="Evidence"
            className="w-full h-48 object-cover rounded-xl border border-slate-800"
          />
        </div>
      )}

    </div>
  );
}
