import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  SlidersHorizontal, 
  CheckCircle2, 
  Filter,
  Check
} from 'lucide-react';
import { INCIDENT_CATEGORIES } from '../../data/mockData';

export default function TrafficAlertsList({ onSelectIncident = () => {} }) {
  const { 
    incidents, 
    notificationPreferences, 
    updateNotificationPreference, 
    showToast 
  } = useRouteWise();

  const [dismissedIds, setDismissedIds] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [showPrefsModal, setShowPrefsModal] = useState(false);

  const activeAlerts = incidents.filter(i => {
    if (dismissedIds.includes(i.id)) return false;
    if (filterType !== 'all' && i.category !== filterType) return false;
    return true;
  });

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
    showToast('Alert Dismissed', '', 'info');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Roadway Alerts</h4>
            <p className="text-[11px] text-slate-400">{activeAlerts.length} active verified notices</p>
          </div>
        </div>

        <button
          onClick={() => setShowPrefsModal(!showPrefsModal)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1 text-xs"
          title="Notification Preferences"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preferences</span>
        </button>
      </div>

      {/* Notification Preferences Modal / Accordion */}
      {showPrefsModal && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Alert Push Preferences</span>
            <button onClick={() => setShowPrefsModal(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 rounded-lg">
              <input
                type="checkbox"
                checked={notificationPreferences.trafficJams}
                onChange={(e) => updateNotificationPreference('trafficJams', e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Traffic Jams (&gt; 15m delay)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 rounded-lg">
              <input
                type="checkbox"
                checked={notificationPreferences.accidents}
                onChange={(e) => updateNotificationPreference('accidents', e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Accidents & Collisions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 rounded-lg">
              <input
                type="checkbox"
                checked={notificationPreferences.flooding}
                onChange={(e) => updateNotificationPreference('flooding', e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Flooding & High Tide Sump</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 rounded-lg">
              <input
                type="checkbox"
                checked={notificationPreferences.roadClosures}
                onChange={(e) => updateNotificationPreference('roadClosures', e.target.checked)}
                className="accent-cyan-400"
              />
              <span>Road Closures / Diversions</span>
            </label>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        <button
          onClick={() => setFilterType('all')}
          className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
            filterType === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({incidents.length})
        </button>
        <button
          onClick={() => setFilterType('accident')}
          className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
            filterType === 'accident' ? 'bg-red-500 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          Accidents
        </button>
        <button
          onClick={() => setFilterType('flooding')}
          className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
            filterType === 'flooding' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          Flooding
        </button>
        <button
          onClick={() => setFilterType('road_repair')}
          className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
            filterType === 'road_repair' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          Repairs
        </button>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {activeAlerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl">
            No alerts matching current filters.
          </div>
        ) : (
          activeAlerts.map((incident) => {
            const isCritical = incident.severity === 'critical';
            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isCritical 
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-500' 
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {incident.category.toUpperCase().replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">• {incident.reportedAgo}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{incident.delayMinutes}m delay
                    </span>
                    <button
                      onClick={(e) => handleDismiss(incident.id, e)}
                      className="p-1 text-slate-500 hover:text-white rounded"
                      title="Dismiss alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-xs text-white mt-1.5">{incident.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{incident.locationName}</span>
                </p>

                {/* Footer Badges */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Level {incident.verificationLevel} (TrustScore {incident.trustScore}%)</span>
                  </span>

                  <span className="text-slate-400 flex items-center gap-1 hover:text-cyan-300">
                    <span>Inspect details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
