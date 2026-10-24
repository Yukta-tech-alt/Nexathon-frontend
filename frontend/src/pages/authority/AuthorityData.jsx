import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { exportToCSV } from '../../utils/csvParser';
import CSVImportModal from '../../components/forms/CSVImportModal';
import { Database, Upload, Download, Trash2, RefreshCw } from 'lucide-react';

export default function AuthorityData() {
  const { incidents, importDataset, clearAllData, loadSeedData } = useRouteWise();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleExport = () => {
    if (!incidents.length) return;
    const headers = ['title', 'category', 'severity', 'locationName', 'delayMinutes', 'verificationLevel'];
    exportToCSV(`RouteWise_Authority_Incident_Audit_${new Date().toISOString().slice(0, 10)}.csv`, headers, incidents);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>Traffic Authority Data Management</span>
          </h1>
          <p className="text-xs text-slate-400">Import municipal telemetry CSV datasets or export audit logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Telemetry Datasets</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-xs font-bold">
              {incidents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Import traffic incident telemetry from CSV. Maps, hotspot clusters, and recurring congestion analytics will update instantly.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Import Traffic CSV</span>
            </button>
            <button
              onClick={handleExport}
              disabled={!incidents.length}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <span className="font-bold text-white text-sm block">System Reset & Seeds</span>
          <p className="text-xs text-slate-400">
            Clear all incident data to test the empty state, or reload standard coastal corridor records.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={loadSeedData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Load Seed Data</span>
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        targetType="incidents"
        onImportSuccess={importDataset}
      />
    </div>
  );
}
