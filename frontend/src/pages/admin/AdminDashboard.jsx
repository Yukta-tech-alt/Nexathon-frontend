import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { exportToCSV } from '../../utils/csvParser';
import CSVImportModal from '../../components/forms/CSVImportModal';
import { 
  Database, 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Users, 
  Car, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    incidents, 
    employees, 
    journeyHistory, 
    notifications, 
    importDataset, 
    clearAllData, 
    loadSeedData, 
    showToast 
  } = useRouteWise();

  const [importTarget, setImportTarget] = useState(null);

  const handleExport = (type) => {
    if (type === 'incidents') {
      if (!incidents.length) return;
      exportToCSV('RouteWise_Incidents_All.csv', ['id', 'title', 'category', 'severity', 'locationName', 'delayMinutes', 'verificationLevel'], incidents);
    } else if (type === 'employees') {
      if (!employees.length) return;
      exportToCSV('RouteWise_Employees_All.csv', ['id', 'name', 'department', 'role', 'route', 'estimatedDelayMin', 'consentGranted'], employees);
    } else if (type === 'journeys') {
      if (!journeyHistory.length) return;
      exportToCSV('RouteWise_Journeys_All.csv', ['id', 'date', 'origin', 'destination', 'routeUsed', 'durationMin', 'delayMin'], journeyHistory);
    }
    showToast('Export Completed', `Downloaded ${type} CSV.`, 'success');
  };

  const dataCards = [
    {
      type: 'incidents',
      title: 'Incident Telemetry Data',
      count: incidents.length,
      icon: Radio,
      desc: 'Active road obstructions, accidents, flooding, and verified delays.'
    },
    {
      type: 'employees',
      title: 'Employee Commute Data',
      count: employees.length,
      icon: Users,
      desc: 'Consented employee directory, commute routes, and scheduled hours.'
    },
    {
      type: 'journeys',
      title: 'Commute Journey Data',
      count: journeyHistory.length,
      icon: Car,
      desc: 'Historical trips logged with actual duration and delay faced.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-purple-500/30 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
            System Administration
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Data Sources & State Management</h1>
          <p className="text-xs text-slate-400">
            Centrally import CSV files, manage datasets, and verify empty-state UI behavior
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadSeedData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Seed Demo Data</span>
          </button>
          <button
            onClick={clearAllData}
            className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 3 Data Source Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.type}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 text-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                    card.count > 0 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {card.count > 0 ? `${card.count} Records` : 'No records yet'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{card.title}</h3>
                <p className="text-slate-400 leading-relaxed text-[11px]">{card.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setImportTarget(card.type)}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow flex items-center justify-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import</span>
                </button>
                <button
                  onClick={() => handleExport(card.type)}
                  disabled={card.count === 0}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl font-semibold flex items-center justify-center"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSV Import Modal */}
      {importTarget && (
        <CSVImportModal
          isOpen={!!importTarget}
          onClose={() => setImportTarget(null)}
          targetType={importTarget}
          onImportSuccess={importDataset}
        />
      )}
    </div>
  );
}
