import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  MapPin, 
  Clock, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  Info,
  Check,
  RefreshCw
} from 'lucide-react';

export default function PrivacySettingsPanel() {
  const { privacySettings, updatePrivacySettings, showToast, resetDemoData } = useRouteWise();

  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);

  const handleToggleSharing = () => {
    const newState = !privacySettings.isSharingCommute;
    updatePrivacySettings({ isSharingCommute: newState });
    showToast(
      newState ? 'Commute Telemetry Sharing Active' : 'Sharing Paused',
      newState ? 'Employer visibility enabled for active transit.' : 'No GPS coordinates transmitted.',
      newState ? 'success' : 'info'
    );
  };

  const handlePurge = () => {
    setPurgeConfirmOpen(false);
    showToast('Data Purged', 'All local simulated travel breadcrumbs deleted from device memory.', 'success');
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Commute consent, privacy boundaries, and data retention</p>
        </div>

        {/* Master Sharing Toggle */}
        <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
          <span className="text-xs font-semibold text-slate-300">
            {privacySettings.isSharingCommute ? 'Sharing Active' : 'Sharing Paused'}
          </span>
          <button
            onClick={handleToggleSharing}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              privacySettings.isSharingCommute ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="bg-slate-950 w-4 h-4 rounded-full shadow-md"></div>
          </button>
        </div>
      </div>

      {/* Active Sharing Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
        privacySettings.isSharingCommute 
          ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200' 
          : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${privacySettings.isSharingCommute ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></span>
          <span>
            {privacySettings.isSharingCommute 
              ? 'Active Consent Status: Sharing only during scheduled commute corridors. 24/7 background tracking is permanently disabled by architecture.'
              : 'Active Consent Status: Sharing is OFF. Your employer cannot view any commute delays or route telemetry.'}
          </span>
        </div>
        <button
          onClick={handleToggleSharing}
          className={`px-3 py-1 rounded-xl font-bold text-xs shrink-0 transition-colors ${
            privacySettings.isSharingCommute
              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
              : 'bg-cyan-600 text-slate-950 hover:bg-cyan-500'
          }`}
        >
          {privacySettings.isSharingCommute ? 'Stop Sharing' : 'Start Sharing'}
        </button>
      </div>

      {/* Organization Visibility Matrix (What HR sees vs what HR does NOT see) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What HR Sees */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>What Your Organization Can See</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Overall commute corridor (e.g. "NH-66 Surathkal to Mangaluru")</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Estimated arrival time & verified delay minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Third-party road hazard verification proofs (TrustScore 92%)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Excusable attendance certificate to justify late arrival</span>
            </li>
          </ul>
        </div>

        {/* What HR Never Sees */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
            <EyeOff className="w-4 h-4" />
            <span>What Stays Strictly Private (Zero Access)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Exact residential address or doorstep coordinates (500m geofence masked)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Weekend, evening, or personal non-commute movements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Personal stops, coffee shops, or errands taken during transit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Individual driver speeds or driving behavior telemetry</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sharing Policy Options */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Commute Sharing Policy Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'active_commute',
              title: 'During Active Commute Only',
              desc: 'Shares corridor delay only after you tap "Start Journey" and auto-stops upon office arrival.'
            },
            {
              id: 'official_only',
              title: 'Official Business Travel Only',
              desc: 'Restricted exclusively to pre-scheduled inter-city client visits and official company transit.'
            },
            {
              id: 'company_transport',
              title: 'Company Transportation',
              desc: 'Only transmits while boarding organization-sponsored shuttle buses or pooled vehicles.'
            },
            {
              id: 'emergency_only',
              title: 'Emergency SOS Only',
              desc: 'Transmits live coordinates solely when explicitly triggered via the Red Emergency SOS button.'
            }
          ].map((policy) => {
            const isSelected = privacySettings.sharingPolicy === policy.id;
            return (
              <div
                key={policy.id}
                onClick={() => updatePrivacySettings({ sharingPolicy: policy.id })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{policy.title}</span>
                  {isSelected && <span className="text-cyan-400 text-xs font-bold">✓ Active</span>}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{policy.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Retention & Local Breadcrumb Purge */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Data Retention & Telemetry Lifecycle</span>
            </h3>
            <p className="text-slate-400 mt-0.5">Automatically purge travel breadcrumbs after a set duration</p>
          </div>

          <div className="flex items-center gap-2">
            {[7, 30].map(days => (
              <button
                key={days}
                onClick={() => updatePrivacySettings({ retentionDays: days })}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  privacySettings.retentionDays === days 
                    ? 'bg-cyan-500 text-slate-950' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-200 block">Purge Local Travel Breadcrumbs</span>
            <span className="text-[11px] text-slate-400">Instantly delete all cached journey logs from this browser</span>
          </div>

          <button
            onClick={() => setPurgeConfirmOpen(true)}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Now</span>
          </button>
        </div>
      </div>

      {/* Purge Modal */}
      {purgeConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-slate-100 space-y-3">
            <h4 className="font-bold text-white">Purge All Travel Logs?</h4>
            <p className="text-xs text-slate-300">
              This will clear all simulated journey checkpoints stored in localStorage.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPurgeConfirmOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
