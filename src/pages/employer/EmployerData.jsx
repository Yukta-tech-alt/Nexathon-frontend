import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { exportToCSV } from '../../utils/csvParser';
import CSVImportModal from '../../components/forms/CSVImportModal';
import { Upload, Download, Trash2, Database, Users } from 'lucide-react';

export default function EmployerData() {
  const { employees, importDataset, clearAllData, loadSeedData } = useRouteWise();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleExport = () => {
    if (!employees.length) return;
    const headers = ['id', 'name', 'department', 'role', 'route', 'origin', 'scheduledArrival', 'estimatedDelayMin', 'consentGranted'];
    exportToCSV(`RouteWise_Staff_Roster_${new Date().toISOString().slice(0, 10)}.csv`, headers, employees);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Staff Commute Data Management</span>
          </h1>
          <p className="text-xs text-slate-400">Import staff CSV rosters or export verified attendance records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Staff Directory Data</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-xs font-bold">
              {employees.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Import employee records via CSV. All statistics, tables, and delay certificates will immediately update.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Import Staff CSV</span>
            </button>
            <button
              onClick={handleExport}
              disabled={!employees.length}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <span className="font-bold text-white text-sm block">Roster Reset Options</span>
          <p className="text-xs text-slate-400">
            Clear all stored employee records to experience the empty state, or reload standard sample records.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={loadSeedData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              Load Sample Roster
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Roster Data</span>
            </button>
          </div>
        </div>
      </div>

      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        targetType="employees"
        onImportSuccess={importDataset}
      />
    </div>
  );
}
