import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { computeEmployeeMetrics } from '../../utils/calculations';
import TrafficMap from '../../components/maps/TrafficMap';
import DelayCertificateModal from '../../components/employer/DelayCertificateModal';
import EmployeeModal from '../../components/employer/EmployeeModal';
import { 
  Plus, 
  Users, 
  Car, 
  Clock, 
  ShieldCheck, 
  X, 
  FileText, 
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function EmployerOverview() {
  const navigate = useNavigate();
  const { employees, incidents, routes } = useRouteWise();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCertEmp, setSelectedCertEmp] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const metrics = computeEmployeeMetrics(employees);

  if (!employees.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Commute Overview</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            + Add Employee
          </button>
        </div>

        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No traffic data</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add or import your traffic dataset to begin analysis.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Add Employee
            </button>
          </div>
        </div>

        <EmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Commute Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">Workforce transit operations and delay verification</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* 2. Four Operational Metrics Only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Employees</span>
          <span className="text-2xl font-black text-white font-mono block mt-1">{metrics.total}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Travelling</span>
          <span className="text-2xl font-black text-cyan-400 font-mono block mt-1">{metrics.activeTraveling}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Delayed</span>
          <span className="text-2xl font-black text-amber-400 font-mono block mt-1">{metrics.delayed}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Verified Delays</span>
          <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">{metrics.verifiedDelays}</span>
        </div>
      </div>

      {/* 3. Employee Commute Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Employee Commute
          </h2>
          <button
            onClick={() => navigate('/employer/employees')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Employee</th>
                <th className="py-2.5 px-4 font-semibold">Route</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Delay</th>
                <th className="py-2.5 px-4 font-semibold text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {employees.slice(0, 6).map((emp) => (
                <tr 
                  key={emp.id} 
                  onClick={() => setSelectedEmployee(emp)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-white">
                    {emp.name}
                    <span className="block text-[11px] text-slate-500 font-mono">{emp.id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{emp.route}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      emp.journeyStatus === 'delayed'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {emp.journeyStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {emp.estimatedDelayMin > 0 ? (
                      <span className="text-amber-400">+{emp.estimatedDelayMin}m</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {emp.estimatedDelayMin > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCertEmp(emp);
                        }}
                        className="px-2.5 py-1 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/30 rounded-lg text-[10px] font-bold transition-colors"
                      >
                        Proof
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Commute Map & Recent Delays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Map */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Commute Corridor Map</span>
            <span className="text-slate-500 font-mono">Mangaluru Operations</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow bg-slate-950">
            <TrafficMap
              incidents={incidents}
              selectedRoute={routes[0]}
              height="h-[360px]"
            />
          </div>
        </div>

        {/* Recent Delays List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Delays
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {employees.filter(e => e.estimatedDelayMin > 0).slice(0, 4).map((e) => (
              <div 
                key={e.id}
                onClick={() => setSelectedEmployee(e)}
                className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{e.name}</span>
                  <span className="text-amber-400 font-mono font-bold">+{e.estimatedDelayMin}m</span>
                </div>
                <div className="text-[11px] text-slate-400">{e.route}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. EMPLOYEE DETAILS SIDE PANEL (Section 16) */}
      {selectedEmployee && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between text-slate-100">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Employee Details</span>
                <h3 className="text-xl font-black text-white mt-0.5">{selectedEmployee.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedEmployee.id} · {selectedEmployee.department}</span>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route</span>
                  <span className="font-semibold text-slate-200">{selectedEmployee.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Journey status</span>
                  <span className="capitalize font-semibold text-slate-200">{selectedEmployee.journeyStatus.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ETA</span>
                  <span className="font-mono font-semibold text-slate-200">{selectedEmployee.estimatedArrival || '09:00 AM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delay</span>
                  <span className="font-mono font-bold text-amber-400">
                    {selectedEmployee.estimatedDelayMin > 0 ? `+${selectedEmployee.estimatedDelayMin} min` : 'On time'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consent</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>

              {/* Related Incident & Verification */}
              {selectedEmployee.incidentAffected && selectedEmployee.incidentAffected !== 'None (Clear Corridor)' && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Related Incident</span>
                  <div className="font-bold text-slate-200">{selectedEmployee.incidentAffected}</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{selectedEmployee.verificationStatus || 'Verified Telemetry'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 border-t border-slate-800">
            {selectedEmployee.estimatedDelayMin > 0 ? (
              <button
                onClick={() => {
                  setSelectedCertEmp(selectedEmployee);
                }}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Delay Certificate</span>
              </button>
            ) : (
              <button
                onClick={() => setSelectedEmployee(null)}
                className="w-full py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delay Certificate Modal */}
      {selectedCertEmp && (
        <DelayCertificateModal
          employee={selectedCertEmp}
          onClose={() => setSelectedCertEmp(null)}
        />
      )}

      {/* Add Employee Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
}
