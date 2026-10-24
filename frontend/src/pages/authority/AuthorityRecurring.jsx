import React from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { computeIncidentMetrics } from '../../utils/calculations';
import TrafficStoryCard from '../../components/authority/TrafficStoryCard';
import { MapPin, AlertTriangle } from 'lucide-react';

export default function AuthorityRecurring() {
  const { incidents } = useRouteWise();
  const metrics = computeIncidentMetrics(incidents);

  if (!incidents.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Recurring Problems</h1>
          <p className="text-xs text-slate-400 mt-0.5">Corridors with repeated congestion patterns</p>
        </div>
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
          <p className="text-white font-bold text-sm">No recurring problem data</p>
          <p className="mt-1">Add or import road incident data to calculate repeated bottlenecks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Recurring Problems</h1>
        <p className="text-xs text-slate-400 mt-0.5">Corridors with repeated congestion patterns</p>
      </div>

      <div className="space-y-4">
        {incidents.slice(0, 3).map((inc) => (
          <div key={inc.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{inc.locationName}</h3>
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  {inc.confirmationCount || 6} recurrences this month · Delay: +{inc.delayMinutes}m
                </span>
              </div>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-md uppercase">
                {inc.category}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {inc.description || 'Structural bottleneck during peak hours requiring signal retiming.'}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Alternative Diversion:</span>
              <span className="text-slate-300 font-medium">{inc.alternativeRoute || 'Divert via Inner Ring'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Story Narrative */}
      <TrafficStoryCard incidents={incidents} />
    </div>
  );
}
