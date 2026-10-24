import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Lightbulb, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { AUTHORITY_HOTSPOTS } from '../../data/mockData';

export default function AuthorityHotspotInspector({ onSelectHotspot = null }) {
  const [selectedHotspot, setSelectedHotspot] = useState(AUTHORITY_HOTSPOTS[0]);
  const [auditFilter, setAuditFilter] = useState('all');

  const filteredHotspots = AUTHORITY_HOTSPOTS.filter(h => {
    if (auditFilter === 'critical') return h.severityIndex === 'Critical';
    if (auditFilter === 'high') return h.severityIndex === 'High';
    return true;
  });

  const handleChoose = (h) => {
    setSelectedHotspot(h);
    if (onSelectHotspot) onSelectHotspot(h);
  };

  return (
    <div className="space-y-6">
      {/* Hotspots Master Grid & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Hotspot List Selection */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Identified Recurring Bottleneck Nodes
            </span>
            <div className="flex gap-1 text-[10px]">
              <button
                onClick={() => setAuditFilter('all')}
                className={`px-2 py-0.5 rounded ${auditFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setAuditFilter('critical')}
                className={`px-2 py-0.5 rounded ${auditFilter === 'critical' ? 'bg-red-500 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                Critical
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredHotspots.map((h) => {
              const isSelected = selectedHotspot?.id === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => handleChoose(h)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      h.severityIndex === 'Critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {h.severityIndex} Priority
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      {h.recurrenceRate}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white mt-2">{h.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{h.roadStretch}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{h.totalIncidentsRecorded} reports recorded</span>
                    <span className="text-amber-400 font-semibold font-mono">Avg delay: +{h.avgDelayMin}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Hotspot Forensic Report Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {selectedHotspot ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                    Municipal Traffic Audit Dossier
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{selectedHotspot.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{selectedHotspot.roadStretch} • Coordinates: [{selectedHotspot.lat}, {selectedHotspot.lng}]</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold font-mono">
                    Hotspot #{selectedHotspot.id.replace('hotspot-', '')}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Last Audit: {selectedHotspot.lastAuditDate}</div>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Recorded Incidents</span>
                  <span className="text-lg font-black text-white font-mono mt-1 block">
                    {selectedHotspot.totalIncidentsRecorded}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Recurrence Rate</span>
                  <span className="text-lg font-black text-amber-400 font-mono mt-1 block">
                    {selectedHotspot.recurrenceRate.split(' ')[0]}
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Avg Corridor Delay</span>
                  <span className="text-lg font-black text-red-400 font-mono mt-1 block">
                    +{selectedHotspot.avgDelayMin}m
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Peak Gridlock</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono mt-2 block truncate">
                    {selectedHotspot.peakHours.split('&')[0]}
                  </span>
                </div>
              </div>

              {/* Root Causes Analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Primary Structural Bottleneck Causes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedHotspot.primaryCauses.map((cause, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 font-bold inline-flex items-center justify-center text-[10px] mr-1.5">
                        {idx + 1}
                      </span>
                      {cause}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Decision Support Recommendations */}
              <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                    <span>AI Engineering & Signal Optimization Recommendations</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Decision-Support Advisory</span>
                </div>

                <ul className="space-y-2 text-slate-200">
                  {selectedHotspot.aiRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-2.5 bg-slate-950/60 rounded-xl text-[11px] text-slate-400 border border-slate-800">
                  *Notice: AI suggested engineering actions are simulated decision-support models intended to guide traffic planning officers. Not a substitute for physical civil engineering field studies.
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Select a hotspot node to view the audit dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
