import React from 'react';
import EmployerCommuteTable from '../../components/employer/EmployerCommuteTable';

export default function EmployerEmployees() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Employees</h1>
        <p className="text-xs text-slate-400 mt-0.5">Staff transit roster, corridor assignments, and delay status</p>
      </div>

      <EmployerCommuteTable />
    </div>
  );
}
