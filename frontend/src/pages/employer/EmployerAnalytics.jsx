import React from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { computeEmployeeMetrics } from '../../utils/calculations';
import EmptyState from '../../components/common/EmptyState';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, Users, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function EmployerAnalytics() {
  const { employees } = useRouteWise();

  if (!employees.length) {
    return (
      <EmptyState
        type="analytics"
        title="No workforce commute analytics yet"
        description="Analytics charts will automatically generate as employees are added or imported into the roster."
      />
    );
  }

  // Derive Department Delays
  const deptMap = {};
  employees.forEach(e => {
    const d = e.department || 'Other';
    if (!deptMap[d]) deptMap[d] = { name: d, delayMinutes: 0, count: 0 };
    deptMap[d].delayMinutes += (Number(e.estimatedDelayMin) || 0);
    deptMap[d].count++;
  });
  const deptData = Object.values(deptMap);

  // Status Distribution
  const statusCounts = [
    { name: 'On Schedule', value: employees.filter(e => e.journeyStatus === 'on_schedule' || e.journeyStatus === 'completed').length, color: '#10b981' },
    { name: 'Delayed', value: employees.filter(e => (Number(e.estimatedDelayMin) || 0) > 0).length, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Workforce Commute Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">
            Derived statistical breakdowns across departments and commute corridors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Department Delay Bar Chart */}
        <div className="md:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Cumulative Commute Delays by Department (Minutes)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="delayMinutes" fill="#10b981" radius={[4, 4, 0, 0]} name="Delay (Minutes)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Punctuality Status Donut */}
        <div className="md:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Punctuality Share</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={4}>
                  {statusCounts.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-xs">
            {statusCounts.map((s, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name}</span>
                </span>
                <span className="font-mono font-bold text-white">{s.value} Staff</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
