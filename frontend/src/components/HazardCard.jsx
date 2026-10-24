import React, { useState } from 'react';
import { 
  MapPin, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Share2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { SEVERITIES, STATUS_LIST } from '../data/mockHazards';

export default function HazardCard({ 
  hazard, 
  onUpvote, 
  onOpenVerifyModal, 
  onLocateOnMap,
  isCardSelected
}) {
  const [showTimeline, setShowTimeline] = useState(false);
  const [copied, setCopied] = useState(false);

  const severityInfo = SEVERITIES[hazard.severity] || SEVERITIES.moderate;
  const statusInfo = STATUS_LIST[hazard.status] || STATUS_LIST.reported;

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `🚨 Road Hazard Alert: "${hazard.title}" at ${hazard.address}. Track & verify on RoadTruth!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col justify-between ${
        isCardSelected 
          ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-amber-500/10' 
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Image header with overlay tags */}
        <div className="relative h-48 sm:h-52 w-full bg-slate-950 overflow-hidden group">
          <img 
            src={hazard.imageUrl} 
            alt={hazard.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md shadow-sm ${severityInfo.color}`}>
              {hazard.severity === 'critical' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5 animate-ping"></span>}
              {severityInfo.label}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md shadow-sm border border-white/10 ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Truth Verification Score Badge */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400">{hazard.truthScore}% Truth Score</span>
          </div>

          {/* Address Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5 truncate max-w-[80%]">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-medium">{hazard.address}</span>
            </div>
            <span className="text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-slate-400 shrink-0 border border-slate-800">
              {hazard.ward}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base font-bold text-white leading-snug hover:text-amber-400 transition-colors">
            {hazard.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
            {hazard.description}
          </p>

          <div className="flex items-center justify-between mt-4 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Reported by {hazard.reportedBy}
            </span>
            <button
              onClick={() => onLocateOnMap && onLocateOnMap(hazard)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> View on Map
            </button>
          </div>
        </div>
      </div>

      {/* Card Actions & Truth Voting */}
      <div className="px-4 sm:px-5 pb-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* Upvote Truth Button */}
          <button
            onClick={() => onUpvote(hazard.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              hazard.hasUpvoted
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-inner'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hazard.hasUpvoted ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Confirm Hazard</span>
            <span className="bg-slate-950/80 px-1.5 py-0.5 rounded text-[11px] text-amber-400 font-extrabold ml-1">
              {hazard.upvotes}
            </span>
          </button>

          {/* Verify Fixed Button */}
          {hazard.status !== 'resolved' ? (
            <button
              onClick={() => onOpenVerifyModal(hazard)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark Repaired</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fixed
            </span>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share Alert"
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {copied && (
          <p className="text-[10px] text-amber-400 text-center font-medium">
            Alert details copied to clipboard!
          </p>
        )}

        {/* Timeline toggle button */}
        {hazard.timeline && hazard.timeline.length > 0 && (
          <div>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 py-1"
            >
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Truth Audit Log ({hazard.timeline.length} updates)
              </span>
              {showTimeline ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showTimeline && (
              <div className="mt-2 space-y-2 border-l-2 border-slate-800 pl-3 py-1 text-xs">
                {hazard.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="text-[11px] font-semibold text-slate-200">{item.action}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="text-amber-400/90">{item.user}</span> • <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
