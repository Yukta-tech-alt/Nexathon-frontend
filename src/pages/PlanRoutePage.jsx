import React, { useState } from 'react';
import { useRouteWise } from '../context/RouteWiseContext';
import { useNavigate } from 'react-router-dom';
import RoutePlannerBox from '../components/passenger/RoutePlannerBox';
import LiveTrafficMap from '../components/map/LiveTrafficMap';
import CommuteIntelligenceCard from '../components/passenger/CommuteIntelligenceCard';
import { Navigation, Route, Sparkles, ShieldCheck, MapPin } from 'lucide-react';

export default function PlanRoutePage() {
  const navigate = useNavigate();
  const { incidents, routes, selectedRoute, activeJourney } = useRouteWise();

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Route className="w-5 h-5 text-cyan-400" />
            <span>Plan & Compare Smart Commute Routes</span>
          </h1>
          <p className="text-xs text-slate-400">
            Compare 3 intelligent alternatives: Fastest, Least Congested, and Fewest Hazards
          </p>
        </div>

        {activeJourney.isActive && (
          <button
            onClick={() => navigate('/journeys')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono animate-pulse"
          >
            ● View Active Trip Tracking
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Columns: Planner Controls */}
        <div className="lg:col-span-5 space-y-6">
          <RoutePlannerBox onStartJourneyClick={() => navigate('/journeys')} />
          <CommuteIntelligenceCard selectedRoute={selectedRoute} />
        </div>

        {/* Right 7 Columns: Route Visualizer Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Route Corridor Telemetry Map</span>
            <span className="font-mono text-cyan-400">{selectedRoute.name}</span>
          </div>

          <LiveTrafficMap
            incidents={incidents}
            selectedRoute={selectedRoute}
            height="580px"
            interactive={true}
          />
        </div>
      </div>
    </div>
  );
}
