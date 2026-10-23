import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import DelayCertificateModal from '../../components/employer/DelayCertificateModal';
import { Clock, ShieldCheck, FileText } from 'lucide-react';

export default function EmployerDelays() {
  const { employees } = useRouteWise();
  const [selectedEmp, setSelectedEmp] = useState(null);

  const delayedEmployees = employees.filter(e => (Number(e.estimatedDelayMin) || 0) > 0);

  if (!delayedEmployees.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Delays</h1>
          <p className="text-xs text-slate-400 mt-0.5">Verified commute delay certificates and waiver records</p>
        </div>

        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
          <p className="text-white font-bold text-sm">No commute delays</p>
          <p className="mt-1">All monitored employees are traveling on schedule without incident delays.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Delays</h1>
        <p className="text-xs text-slate-400 mt-0.5">Verified commute delay certificates and waiver records</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Employee</th>
                <th className="py-2.5 px-4 font-semibold">Route</th>
                <th className="py-2.5 px-4 font-semibold">Delay</th>
                <th className="py-2.5 px-4 font-semibold">Verification Proof</th>
                <th className="py-2.5 px-4 font-semibold text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {delayedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">
                    {emp.name}
                    <span className="block text-[11px] text-slate-500 font-mono">{emp.id} · {emp.department}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{emp.route}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    +{emp.estimatedDelayMin} min
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-cyan-400 font-medium flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{emp.verificationStatus || 'Verified Telemetry'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedEmp(emp)}
                      className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
