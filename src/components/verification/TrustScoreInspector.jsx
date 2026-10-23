import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ThumbsUp, 
  Camera, 
  Mic, 
  Gauge, 
  FileCheck2, 
  Activity, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';
import { VERIFICATION_LEVELS } from '../../data/mockData';

export default function TrustScoreInspector({ incident, onClose = null }) {
  const { 
    role, 
    confirmIncident, 
    upvoteIncident, 
    verifyIncidentAuthority, 
    resolveIncident, 
    showToast 
  } = useRouteWise();

  const [showFormula, setShowFormula] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'evidence', 'formula'

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
        Select an incident on the map to inspect its TrustScore verification forensic details.
      </div>
    );
  }

  const currentLvl = incident.verificationLevel || 3;
  const trustScore = incident.trustScore || 75;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
      {/* Header with Level Badge & TrustScore Meter */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold tracking-wide">
                Level {currentLvl} • {VERIFICATION_LEVELS[currentLvl - 1]?.title || 'Multi-Source'}
              </span>
              <span className="text-xs text-slate-400">• {incident.reportedAgo}</span>
              {incident.status === 'cleared' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Cleared
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-white mt-1.5 leading-snug">{incident.title}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{incident.locationName}</span>
            </p>
          </div>

          {/* TrustScore Radial / Box Score */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/90 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TrustScore</div>
              <div className="text-2xl font-black text-cyan-400">{trustScore}<span className="text-sm text-slate-500">/100</span></div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
              {trustScore}%
            </div>
          </div>
        </div>

        {/* 6-Level Progression Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
            <span>RouteWise 6-Stage Trust Verification Pipeline</span>
            <span className="text-cyan-400">{currentLvl} of 6 Confirmed</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {VERIFICATION_LEVELS.map((stage) => {
              const isPassed = stage.level <= currentLvl;
              const isCurrent = stage.level === currentLvl;
              return (
                <div key={stage.level} className="flex flex-col gap-1">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    isPassed 
                      ? isCurrent 
                        ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' 
                        : 'bg-cyan-600' 
                      : 'bg-slate-800'
                  }`} />
                  <span className={`text-[10px] font-medium hidden sm:block truncate ${isPassed ? 'text-cyan-300' : 'text-slate-500'}`}>
                    L{stage.level} {stage.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 px-4">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'timeline' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Forensic Timeline & History
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'evidence' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Telemetry & Evidence Details
        </button>
        <button
          onClick={() => setActiveTab('formula')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'formula' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          TrustScore Method & Formula
        </button>
      </div>

      {/* Tab 1: Forensic Timeline */}
      {activeTab === 'timeline' && (
        <div className="p-5 space-y-4">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {incident.verificationHistory && incident.verificationHistory.map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 transition-transform"></span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">{item.time}</span>
                    <span className="text-[11px] text-slate-500">• {item.user}</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alternative Route Recommendation */}
          {incident.alternativeRoute && (
            <div className="mt-4 p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Recommended Reroute</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{incident.alternativeRoute}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Telemetry & Evidence Details */}
      {activeTab === 'evidence' && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Speed Sensor Telemetry */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Gauge className="w-4 h-4" />
                <span>Stationary Telemetry Data</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Observed Corridor Speed:</span>
                <span className="font-mono text-red-400 font-bold">{incident.evidence?.avgSpeedKmh || 5} km/h</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Free-Flow Baseline Speed:</span>
                <span className="font-mono text-emerald-400">{incident.evidence?.normalSpeedKmh || 45} km/h</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Telemetry indicates severe speed drop consistent with road obstruction.
              </div>
            </div>

            {/* Crowd Consensus */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Activity className="w-4 h-4" />
                <span>Crowd Corroboration</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Independent User Confirmations:</span>
                <span className="font-mono text-cyan-400 font-bold">{incident.confirmationCount || 1} reports</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Community Upvotes:</span>
                <span className="font-mono text-slate-200">{incident.upvotes || 0}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Geofence validated: reporting devices were located within 50m of road axis.
              </div>
            </div>
          </div>

          {/* Photo / Audio Evidence Preview */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Submitted Photographic & Audio Evidence</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">EXIF & GPS Matched</span>
            </div>

            {incident.imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-48">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-200 font-mono">
                  Submitted Photo • EXIF Geo-Tagged
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No photo evidence uploaded yet. Submit photo to reach Level 5.
              </div>
            )}

            {incident.hasAudioReport && (
              <div className="flex items-center gap-3 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                <Mic className="w-4 h-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">Voice Hazard Report Attached</div>
                  <div className="text-[11px] text-slate-400">Transcribed: "Lane merge gridlock, 2 cars blocking shoulder."</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED</span>
              </div>
            )}
          </div>

          {/* Authority Endorsement Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Traffic Authority Certification (Level 6)</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                incident.evidence?.authorityConfirmed ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
              }`}>
                {incident.evidence?.authorityConfirmed ? 'Certified Level 6' : 'Awaiting Official Field Stamp'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Agency: {incident.evidence?.authorityAgency || 'Mangaluru City Traffic Command'}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Formula & Scientific Methodology */}
      {activeTab === 'formula' && (
        <div className="p-5 space-y-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-bold text-cyan-300">Deterministic TrustScore Algorithm (Simulated)</h4>
            <p className="text-slate-300 leading-relaxed">
              RouteWise AI uses a documented forensic weighting model to prevent spam reports and ensure employer-acceptable evidence:
            </p>
            <div className="space-y-1.5 font-mono text-[11px] pt-1">
              <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                <span>1. User GPS Position Check (within 50m of road axis):</span>
                <span className="text-cyan-400 font-bold">+20 pts</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                <span>2. Multi-Citizen Corroboration (≥3 independent reports):</span>
                <span className="text-cyan-400 font-bold">+25 pts</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                <span>3. Real-Time Telemetry Deceleration (&lt; 5 km/h stall):</span>
                <span className="text-cyan-400 font-bold">+20 pts</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                <span>4. Media Forensics (EXIF timestamp & location match):</span>
                <span className="text-cyan-400 font-bold">+15 pts</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-900 rounded">
                <span>5. Official Traffic Authority / NHAI Dispatch Stamp:</span>
                <span className="text-cyan-400 font-bold">+20 pts</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px]">
            <strong>Methodology Note:</strong> Raw sensor scores are bounded at 99% for prototype demonstration.
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Confirm Button */}
          <button
            onClick={() => confirmIncident(incident.id)}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm This Incident ({incident.confirmationCount || 0})</span>
          </button>

          {/* Upvote Button */}
          <button
            onClick={() => upvoteIncident(incident.id)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upvote ({incident.upvotes || 0})</span>
          </button>
        </div>

        {/* Authority Specific Actions */}
        <div className="flex items-center gap-2">
          {role === 'authority' && !incident.evidence?.authorityConfirmed && (
            <button
              onClick={() => verifyIncidentAuthority(incident.id)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Certify as Authority (Level 6)</span>
            </button>
          )}

          {role === 'authority' && incident.status !== 'cleared' && (
            <button
              onClick={() => resolveIncident(incident.id)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Mark Cleared
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
