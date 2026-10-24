import React, { useState } from 'react';
import { useRouteWise } from '../context/RouteWiseContext';
import EmployerCommuteTable from '../components/employer/EmployerCommuteTable';
import LiveTrafficMap from '../components/map/LiveTrafficMap';
import { 
  Building2, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Layers 
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { incidents, employees, routes } = useRouteWise();
  const [activeTab, setActiveTab] = useState('table'); // 'table', 'map'

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Employer Commute Intelligence Portal</h1>
              <p className="text-xs text-slate-400">
                Workforce transit monitoring, verified traffic delay proof, and non-disciplinary waivers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'table' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Employee Roster
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'map' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Transit Corridor Map
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Policy Context Banner */}
      <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs text-emerald-200/90 leading-relaxed">
        <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Objective Delay Evidence Protocol:</strong>
          RouteWise cross-corroborates employee routes against real-time stationary deceleration and community hazard reports. Employees delayed by external road infrastructure conditions receive automatic delay verification certificates to excuse late arrival.
        </div>
      </div>

      {/* View Switcher: Table View vs Map View */}
      {activeTab === 'table' ? (
        <EmployerCommuteTable />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Active Consented Employee Journeys on Corridor Map</span>
            <span className="font-mono text-cyan-400">{employees.length} Consented Roster Records</span>
          </div>
          <LiveTrafficMap
            incidents={incidents}
            selectedRoute={routes[0]}
            height="560px"
            interactive={true}
          />
        </div>
      )}
    </div>
  );
}
