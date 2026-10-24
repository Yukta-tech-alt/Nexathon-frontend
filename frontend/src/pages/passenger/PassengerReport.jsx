import React from 'react';
import IncidentReportForm from '../../components/incident/IncidentReportForm';

export default function PassengerReport() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Report Incident</h1>
        <p className="text-xs text-slate-400 mt-0.5">Share a road problem to alert other commuters</p>
      </div>

      <IncidentReportForm />
    </div>
  );
}
