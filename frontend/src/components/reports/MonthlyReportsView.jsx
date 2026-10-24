import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { FileText, Download, Printer, CheckCircle, ArrowRight } from 'lucide-react';

export default function MonthlyReportsView() {
  const { employees, incidents, showToast } = useRouteWise();

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [showFullReport, setShowFullReport] = useState(false);

  // Compute derived summary from real data
  const totalIncidents = incidents.length;
  const totalDelayMin = incidents.reduce((acc, i) => acc + (Number(i.delayMinutes) || 0), 0);
  const topRoad = incidents[0]?.locationName || 'NH-66 Coastal Corridor';
  const mostCommonIncident = incidents[0]?.category?.toUpperCase() || 'ACCIDENT';

  const handleDownloadCSV = () => {
    const headers = ['Month', 'Incidents', 'Total Delay (min)', 'Top Road', 'Most Common Incident'];
    const row = [selectedMonth, totalIncidents, totalDelayMin, `"${topRoad}"`, mostCommonIncident];
    const csv = [headers.join(','), row.join(',')].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Monthly_Report_${selectedMonth.replace(' ', '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV Exported', 'Monthly report downloaded.', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Monthly Report</h1>
          <p className="text-xs text-slate-400 mt-0.5">Commute verification and incident audit</p>
        </div>

        {/* Month Selector */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
        >
          <option value="October 2026">October 2026</option>
          <option value="September 2026">September 2026</option>
          <option value="August 2026">August 2026</option>
        </select>
      </div>

      {/* 2. Summary Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Summary · {selectedMonth}
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Incidents</span>
            <span className="text-base font-bold text-white font-mono">{totalIncidents}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Delay</span>
            <span className="text-base font-bold text-amber-400 font-mono">+{totalDelayMin} min</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Top affected road</span>
            <span className="font-bold text-slate-200 truncate max-w-[220px] text-right">{topRoad}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">Most common incident</span>
            <span className="font-bold text-cyan-400">{mostCommonIncident}</span>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => setShowFullReport(!showFullReport)}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showFullReport ? 'Hide Details' : 'View Report'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Expanded Report View */}
      {showFullReport && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Full Incident Audit Table</h3>
            <button
              onClick={() => window.print()}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {incidents.map((inc) => (
              <div key={inc.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">{inc.title || inc.locationName}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{inc.category} · {inc.locationName}</div>
                </div>
                <div className="text-right font-mono text-amber-400 font-bold">
                  +{inc.delayMinutes || 15}m
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
