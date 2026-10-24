import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Users, 
  Gauge, 
  ArrowRight, 
  X,
  Navigation,
  Compass
} from 'lucide-react';
import { VERIFICATION_LEVELS } from '../../data/dataTemplates';

export default function WhyIsRoadBlockedModal({ incident, onClose, onReroute = null }) {
  const navigate = useNavigate();
  if (!incident) return null;

  const currentLvl = Number(incident.verificationLevel) || 1;
  const levelInfo = VERIFICATION_LEVELS[currentLvl - 1] || VERIFICATION_LEVELS[0];

  const handleAlternativeClick = () => {
    if (onReroute) {
      onReroute(incident);
    } else {
      onClose();
      navigate('/passenger/route');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-slate-100 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Diagnostic Route Intelligence</span>
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Why is this road affected?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 1: WHAT WE KNOW */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>What We Know (Verified Forensics)</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Incident Condition:</span>
              <span className="font-bold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                {incident.category ? incident.category.replace(/_/g, ' ') : 'Road Hazard'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Corridor Location:</span>
              <span className="font-semibold text-slate-200 text-right">{incident.locationName || 'Coastal Corridor'}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Report Timestamp:</span>
              <span className="font-mono text-cyan-300">{incident.reportedAgo || 'Active report'}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Matching Citizen Reports:</span>
              <span className="font-mono text-slate-200 font-bold">
                {incident.confirmationCount ? `${incident.confirmationCount} corroborations` : 'Initial single submission'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Evidence Attached:</span>
              <span className="text-slate-200 font-semibold">
                {incident.imageUrl ? '📷 Photo Proof Attached' : '📍 GPS Geofence Only'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Verification Status:</span>
              <span className="font-bold text-cyan-400">
                Level {currentLvl} — {levelInfo.title}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 font-medium">Estimated Impact:</span>
              <span className="font-mono text-amber-400 font-bold">
                +{incident.delayMinutes || 15} min delay ({incident.affectedDistanceKm || 1.2} km queue)
              </span>
            </div>
          </div>

          {/* Description Snippet */}
          {incident.description && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
              "{incident.description}"
            </div>
          )}
        </div>

        {/* SECTION 2: WHAT YOU CAN DO */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/50 to-slate-950 rounded-2xl border border-cyan-500/30 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>What You Can Do Right Now</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {incident.alternativeRoute 
              ? incident.alternativeRoute 
              : 'Our route planner calculates congestion-free detours to circumvent this bottleneck and save up to 18 minutes.'}
          </p>

          <button
            onClick={handleAlternativeClick}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <span>View Alternative Route Detours</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
