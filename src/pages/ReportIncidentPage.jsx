import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../context/RouteWiseContext';
import IncidentReportForm from '../components/incident/IncidentReportForm';
import { AlertTriangle, ShieldCheck, MapPin, CheckCircle2, Clock } from 'lucide-react';

export default function ReportIncidentPage() {
  const navigate = useNavigate();
  const { incidents, confirmIncident } = useRouteWise();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Community Traffic Accountability</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Report a Road Incident or Traffic Congestion
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Every report feeds directly into the RouteWise AI consensus engine. Upload evidence to unlock Level 5 TrustScore verification.
        </p>
      </div>

      {/* Main Report Form */}
      <IncidentReportForm 
        onReportSubmitted={(newInc) => {
          // Stay on confirmation or allow user to jump to map
        }}
      />

      {/* Recent Community Reports List */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Recent Community Reports Awaiting Confirmation</span>
          </h3>
          <span className="text-[11px] text-slate-400">Crowd consensus in progress</span>
        </div>

        <div className="space-y-2.5">
          {incidents.slice(0, 3).map((inc) => (
            <div
              key={inc.id}
              className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{inc.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Level {inc.verificationLevel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{inc.locationName} • {inc.reportedAgo}</div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-cyan-400 font-bold">TrustScore: {inc.trustScore}%</span>
                <button
                  onClick={() => confirmIncident(inc.id)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm ({inc.confirmationCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
