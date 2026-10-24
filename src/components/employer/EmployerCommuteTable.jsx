import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ShieldCheck, 
  FileText, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import DelayCertificateModal from './DelayCertificateModal';
import EmployeeModal from './EmployeeModal';

export default function EmployerCommuteTable() {
  const { employees, deleteEmployee, showToast } = useRouteWise();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedCertEmployee, setSelectedCertEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Computed Top Stats derived from live data
  const totalEmployees = employees.length;
  const currentlyTravelling = employees.filter(e => e.journeyStatus !== 'completed' && e.journeyStatus !== 'not_started').length;
  const onScheduleCount = employees.filter(e => e.journeyStatus === 'on_schedule' || e.journeyStatus === 'completed').length;
  const delayedCount = employees.filter(e => e.estimatedDelayMin > 0).length;
  const verifiedDelays = employees.filter(e => e.evidenceApproved && e.estimatedDelayMin > 0).length;
  const avgDelay = Math.round(employees.reduce((acc, e) => acc + (e.estimatedDelayMin || 0), 0) / (delayedCount || 1));

  // Filtered List
  const filteredEmployees = employees.filter(emp => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = emp.name.toLowerCase().includes(q) || 
                    emp.route.toLowerCase().includes(q) || 
                    emp.department.toLowerCase().includes(q) ||
                    emp.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && emp.journeyStatus !== statusFilter) return false;
    if (departmentFilter !== 'all' && emp.department !== departmentFilter) return false;
    return true;
  });

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Department', 'Role', 'Route', 'Status', 'Scheduled Arrival', 'Est Arrival', 'Delay (Min)', 'Incident Affecting', 'Verification Status', 'Consent'];
    const rows = filteredEmployees.map(e => [
      e.id,
      `"${e.name}"`,
      `"${e.department}"`,
      `"${e.role}"`,
      `"${e.route}"`,
      e.journeyStatus,
      e.scheduledArrival,
      e.estimatedArrival,
      e.estimatedDelayMin,
      `"${e.incidentAffected}"`,
      `"${e.verificationStatus}"`,
      e.consentGranted ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RouteWise_Employee_Commute_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV Exported', 'Employee commute report saved to your downloads.', 'success');
  };

  const handleDeleteConfirm = (id) => {
    deleteEmployee(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Statistical Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">In Transit</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">{currentlyTravelling}</div>
          <span className="text-[10px] text-slate-500 font-medium">{totalEmployees} total monitored</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">On Schedule</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{onScheduleCount}</div>
          <span className="text-[10px] text-slate-500 font-medium">Clear road corridors</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Experiencing Delays</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{delayedCount}</div>
          <span className="text-[10px] text-slate-500 font-medium">Congestion or repairs</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Verified Delay Proof</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">{verifiedDelays}</div>
          <span className="text-[10px] text-slate-500 font-medium">Excusable attendance</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Avg Delay Faced</span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-1 font-mono">+{avgDelay}m</div>
          <span className="text-[10px] text-slate-500 font-medium">For delayed staff</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-slate-100 space-y-4">
        {/* Table Controls: Search, Filters, Add Employee, CSV */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, route (Mangaluru–Udupi), ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Transit Statuses</option>
              <option value="on_schedule">On Schedule</option>
              <option value="delayed">Delayed</option>
              <option value="approaching">Approaching</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Departments</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Product Operations">Product Operations</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Data Analytics">Data Analytics</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            {/* Add Employee Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Corridor Route</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Est. Arrival</th>
                <th className="py-3 px-3">Delay</th>
                <th className="py-3 px-3">Incident Affected</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    No employees matching the current search & filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const isDelayed = emp.estimatedDelayMin > 0;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-100 flex items-center gap-1">
                              <span>{emp.name}</span>
                              {emp.consentGranted && (
                                <span title="Consent verified" className="text-cyan-400 text-[10px]">●</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{emp.id} • {emp.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-200">{emp.route}</span>
                        <span className="block text-[10px] text-slate-400">{emp.origin}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          emp.journeyStatus === 'delayed'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : emp.journeyStatus === 'approaching'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {emp.journeyStatus.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Arrival */}
                      <td className="py-3 px-3 font-mono font-medium text-slate-200">
                        {emp.estimatedArrival}
                        <span className="text-[10px] text-slate-500 block">Sched: {emp.scheduledArrival}</span>
                      </td>

                      {/* Delay */}
                      <td className="py-3 px-3">
                        {isDelayed ? (
                          <span className="font-mono text-red-400 font-bold">+{emp.estimatedDelayMin} min</span>
                        ) : (
                          <span className="font-mono text-emerald-400 font-bold">On Time</span>
                        )}
                      </td>

                      {/* Incident */}
                      <td className="py-3 px-3 max-w-xs truncate text-[11px] text-slate-300">
                        {emp.incidentAffected}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          emp.evidenceApproved
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <ShieldCheck className="w-3 h-3 text-cyan-400" />
                          <span>{emp.verificationStatus.split(' ')[0]}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isDelayed && (
                            <button
                              onClick={() => setSelectedCertEmployee(emp)}
                              className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                              title="Inspect Delay Certificate"
                            >
                              <FileText className="w-3 h-3" />
                              <span className="hidden sm:inline">Proof</span>
                            </button>
                          )}
                          <button
                            onClick={() => setEditingEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit Employee"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(emp.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Remove Employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-white">Confirm Removal</h4>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this employee from the commute monitoring roster?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(confirmDeleteId)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Dialog */}
      <EmployeeModal
        isOpen={isAddModalOpen || !!editingEmployee}
        employee={editingEmployee}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEmployee(null);
        }}
      />

      {/* Delay Certificate Proof Modal */}
      {selectedCertEmployee && (
        <DelayCertificateModal
          employee={selectedCertEmployee}
          onClose={() => setSelectedCertEmployee(null)}
        />
      )}
    </div>
  );
}
