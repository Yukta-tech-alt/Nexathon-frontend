import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Bell, 
  ChevronRight,
  TrendingDown,
  Building
} from 'lucide-react';
import { EMPLOYEE_TRACKING_DATA } from '../data/roadTruthData';

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState('tracking');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      {/* Top Header matching design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Employer / Authority Dashboard (Overview)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workforce transit risk monitoring and civic dispatch integration
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting Fleet Mobility Report (CSV/PDF)...')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Mobility Log</span>
        </button>
      </div>

      {/* Tabs matching design: Employee Tracking, City Analytics, Recurring Problems, Reports */}
      <div className="flex items-center gap-2 my-4 border-b border-slate-800/80 pb-2 overflow-x-auto">
        {[
          { id: 'tracking', label: 'Employee Tracking' },
          { id: 'analytics', label: 'City Analytics' },
          { id: 'problems', label: 'Recurring Problems' },
          { id: 'reports', label: 'Reports' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Section matching design */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4">
        <div className="flex items-center justify-between pb-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white">Employees Currently Travelling</span>
          </div>
          <span className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer">
            View All &gt;
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Delay</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {EMPLOYEE_TRACKING_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                    {row.route}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        row.status === 'Normal' ? 'bg-emerald-400' : row.status === 'Moderate' ? 'bg-amber-400' : 'bg-red-500'
                      }`} />
                      <span className="font-semibold text-slate-200">{row.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                    <span className={row.delay === '0 min' ? 'text-slate-400' : 'text-red-400'}>
                      {row.delay}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.badge}`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {row.verification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
