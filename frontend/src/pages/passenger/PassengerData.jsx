import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { exportToCSV } from '../../utils/csvParser';
import CSVImportModal from '../../components/forms/CSVImportModal';
import { Database, Upload, Download, Trash2, RefreshCw, FileText } from 'lucide-react';

export default function PassengerData() {
  const { incidents, importDataset, clearAllData, loadSeedData } = useRouteWise();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleExport = () => {
    if (!incidents.length) return;
    const headers = ['title', 'category', 'severity', 'locationName', 'delayMinutes', 'verificationLevel'];
    exportToCSV(`RouteWise_Incidents_${new Date().toISOString().slice(0, 10)}.csv`, headers, incidents);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Passenger Data Management</span>
          </h1>
          <p className="text-xs text-slate-400">Import your own CSV incident records or clear cached state</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Incident Records</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-xs font-bold">
              {incidents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Import traffic incidents from a CSV file. The live map, alert stream, and TrustScore inspectors will immediately update from your uploaded data.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
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
          <span className="font-bold text-white text-sm block">Data Reset & Seed Options</span>
          <p className="text-xs text-slate-400">
            Test the application in empty state by clearing all local records, or reload default coastal corridor sample data with one click.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={loadSeedData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Load Seed Data</span>
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
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
