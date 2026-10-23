import React from 'react';
import EmployerCommuteTable from '../components/employer/EmployerCommuteTable';
import { Users, ShieldCheck } from 'lucide-react';

export default function EmployeeManagementPage() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Employee Transit & Commute Directory</span>
          </h1>
          <p className="text-xs text-slate-400">
            Maintain employee corridors, consent policies, and historical attendance waivers
          </p>
        </div>
      </div>

      <EmployerCommuteTable />
    </div>
  );
}
