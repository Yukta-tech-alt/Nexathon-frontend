import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import TrafficMap from '../../components/maps/TrafficMap';
import DelayCertificateModal from '../../components/employer/DelayCertificateModal';

export default function EmployerJourneys() {
  const { employees, incidents, routes } = useRouteWise();
  const [selectedEmp, setSelectedEmp] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Active Journeys</h1>
        <p className="text-xs text-slate-400 mt-0.5">Live transit status for staff on the road</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 8 Cols: Map */}
        <div className="lg:col-span-8 space-y-2">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow bg-slate-950">
            <TrafficMap
              incidents={incidents}
              selectedRoute={routes[0]}
              height="h-[440px] lg:h-[520px]"
            />
          </div>
        </div>

        {/* Right 4 Cols: Active Commuter List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              In Transit ({employees.length})
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">Consented</span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 text-xs">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => {
                  if (emp.estimatedDelayMin > 0) setSelectedEmp(emp);
                }}
                className={`p-3 rounded-xl border transition-all ${
                  emp.estimatedDelayMin > 0
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60 cursor-pointer'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-100">{emp.name}</div>
                    <div className="text-[11px] text-slate-500">{emp.route}</div>
                  </div>
                  <div className="text-right">
                    {emp.estimatedDelayMin > 0 ? (
                      <span className="text-xs font-mono font-bold text-amber-400 block">
                        +{emp.estimatedDelayMin}m
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold block">
                        On Time
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      ETA {emp.estimatedArrival || '09:00 AM'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEmp && (
        <DelayCertificateModal
          employee={selectedEmp}
          onClose={() => setSelectedEmp(null)}
        />
      )}
    </div>
  );
}
