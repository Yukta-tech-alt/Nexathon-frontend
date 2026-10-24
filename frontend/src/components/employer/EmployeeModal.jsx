import React, { useState, useEffect } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { X, User, Building2, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, employee = null }) {
  const { addEmployee, updateEmployee } = useRouteWise();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Software Engineering');
  const [role, setRole] = useState('Engineer');
  const [route, setRoute] = useState('Mangaluru – Udupi Corridor');
  const [origin, setOrigin] = useState('Surathkal');
  const [scheduledArrival, setScheduledArrival] = useState('09:00 AM');
  const [journeyStatus, setJourneyStatus] = useState('on_schedule');
  const [estimatedDelayMin, setEstimatedDelayMin] = useState(0);
  const [incidentAffected, setIncidentAffected] = useState('None');
  const [consentGranted, setConsentGranted] = useState(true);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setDepartment(employee.department);
      setRole(employee.role);
      setRoute(employee.route);
      setOrigin(employee.origin);
      setScheduledArrival(employee.scheduledArrival);
      setJourneyStatus(employee.journeyStatus);
      setEstimatedDelayMin(employee.estimatedDelayMin || 0);
      setIncidentAffected(employee.incidentAffected || 'None');
      setConsentGranted(employee.consentGranted !== false);
    } else {
      setName('');
      setDepartment('Software Engineering');
      setRole('Developer');
      setRoute('Mangaluru – Udupi Corridor');
      setOrigin('Surathkal');
      setScheduledArrival('09:00 AM');
      setJourneyStatus('on_schedule');
      setEstimatedDelayMin(0);
      setIncidentAffected('None');
      setConsentGranted(true);
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (employee) {
      updateEmployee(employee.id, {
        name,
        department,
        role,
        route,
        origin,
        scheduledArrival,
        journeyStatus,
        estimatedDelayMin: parseInt(estimatedDelayMin, 10),
        incidentAffected,
        consentGranted
      });
    } else {
      addEmployee({
        name,
        department,
        role,
        route,
        origin,
        scheduledArrival,
        journeyStatus,
        estimatedDelayMin: parseInt(estimatedDelayMin, 10),
        incidentAffected,
        consentGranted
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {employee ? 'Edit Demo Employee' : 'Add Demo Commuter'}
              </h3>
              <p className="text-xs text-slate-400">Manage transit roster & consent profiles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Bhandary"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Product Operations">Product Operations</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="People & Culture">People & Culture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Commute Corridor Route</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Mangaluru – Udupi Corridor">Mangaluru – Udupi Corridor</option>
                <option value="Ullal – Mangaluru">Ullal – Mangaluru</option>
                <option value="Bantwal – Mangaluru">Bantwal – Mangaluru</option>
                <option value="Surathkal – Hampankatta">Surathkal – Hampankatta</option>
                <option value="Pumpwell – Bejai">Pumpwell – Bejai</option>
                <option value="Mulki – Mangaluru">Mulki – Mangaluru</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Scheduled Office Arrival</label>
              <input
                type="text"
                value={scheduledArrival}
                onChange={(e) => setScheduledArrival(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Journey Status</label>
              <select
                value={journeyStatus}
                onChange={(e) => setJourneyStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="on_schedule">On Schedule</option>
                <option value="delayed">Delayed</option>
                <option value="approaching">Approaching Office</option>
                <option value="completed">Completed Trip</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Simulated Delay (Minutes)</label>
              <input
                type="number"
                min="0"
                max="120"
                value={estimatedDelayMin}
                onChange={(e) => setEstimatedDelayMin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Incident Affecting Route</label>
            <input
              type="text"
              value={incidentAffected}
              onChange={(e) => setIncidentAffected(e.target.value)}
              placeholder="e.g. NH-66 Thokkottu Flyover Collision"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200 block">Consent-Based Telemetry Sharing</span>
              <span className="text-[11px] text-slate-400">Only shares corridor delay during active trips</span>
            </div>
            <input
              type="checkbox"
              checked={consentGranted}
              onChange={(e) => setConsentGranted(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl transition-colors shadow"
            >
              {employee ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
