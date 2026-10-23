import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  Share2, 
  Camera,
  Activity,
  Layers,
  Check
} from 'lucide-react';
import { MOCK_INCIDENTS } from '../data/roadTruthData';

export default function IncidentDetailsModal({ incidentId, onClose, onUpvote }) {
  const incident = MOCK_INCIDENTS.find(i => i.id === incidentId) || MOCK_INCIDENTS[0];
  const [upvoted, setUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `🚨 Verified Incident: ${incident.title} (${incident.location}). 92/100 Trust Score. Clearance: ${incident.estimatedClearance}. Track on RoadTruth!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white">{incident.title}</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {incident.location} • Reported {incident.reportedAgo} • Updated {incident.updatedAgo}
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Grid: Left Evidence Photo + Middle Trust Score Gauge + Right Verification Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
        {/* Left Column: Photo Evidence */}
        <div className="md:col-span-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group h-52">
            <img 
              src={incident.imageUrl} 
              alt={incident.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded">
                <Camera className="w-3 h-3 text-cyan-400" /> 4 Photos Verified
              </span>
              <span className="bg-red-500/80 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                High Impact
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: Circular Trust Score Gauge matching reference */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-emerald-400"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - incident.trustScore / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white tracking-tight leading-none">
                {incident.trustScore}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-200">Trust Score</h4>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {incident.confidenceLevel}
            </span>
          </div>
        </div>

        {/* Right Column: Verification Details Checklist matching design */}
        <div className="md:col-span-4 space-y-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verification Details
          </h4>

          <div className="space-y-2">
            {incident.checkpoints.map((chk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  chk.verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className={`font-medium ${chk.verified ? 'text-slate-200' : 'text-slate-500'}`}>
                  {chk.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Meta Stats Bar matching design */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Clearance</span>
          <span className="text-sm font-bold text-amber-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            {incident.estimatedClearance}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Cause</span>
          <span className="text-xs font-semibold text-slate-200 block truncate mt-0.5" title={incident.cause}>
            {incident.cause}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Affected Stretch</span>
          <span className="text-xs font-bold text-red-400 mt-0.5 block">
            {incident.affectedStretch}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Reported By</span>
          <span className="text-[11px] font-medium text-slate-300 mt-0.5 block truncate">
            {incident.reportedBy}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUpvoted(!upvoted)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              upvoted 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${upvoted ? 'fill-emerald-400' : ''}`} />
            <span>{upvoted ? 'Confirmed (Truth Verified)' : 'I Confirm This Hazard'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share Alert'}</span>
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Source: Automated Sensor Consensus + Ground Crowd
        </span>
      </div>
    </div>
  );
}
