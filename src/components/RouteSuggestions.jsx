import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Compass, 
  ArrowRight, 
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { ROUTE_OPTIONS } from '../data/roadTruthData';

export default function RouteSuggestions({ onStartNavigation }) {
  const [selectedRouteId, setSelectedRouteId] = useState('smart');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            Alternative Route Suggestions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cause-aware rerouting based on verified ground incidents
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
          18 min max saving
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Route Cards */}
        <div className="lg:col-span-5 space-y-3">
          {ROUTE_OPTIONS.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-850 border-emerald-400 ring-2 ring-emerald-400/20 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      style={{ backgroundColor: route.color }} 
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    />
                    <h4 className="text-sm font-bold text-white">{route.name}</h4>
                  </div>
                  <span className="text-sm font-black text-white font-mono">{route.duration}</span>
                </div>

                <div className="mt-2 text-xs">
                  {route.delay && (
                    <span className="text-red-400 font-bold block">{route.delay}</span>
                  )}
                  {route.saved && (
                    <span className="text-emerald-400 font-bold block">{route.saved}</span>
                  )}
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {route.warning || route.benefit}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{route.distance}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    route.id === 'smart' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : route.id === 'current' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {route.badge}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onStartNavigation ? onStartNavigation(selectedRouteId) : alert('Starting Turn-by-Turn Smart Navigation!')}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>Start Navigation</span>
            </button>
            <button
              onClick={() => alert('Opening Full Route Map View')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
            >
              View on Map
            </button>
          </div>
        </div>

        {/* Right Column: Visual Simulated Route Comparison Map */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative min-h-[340px] flex items-center justify-center overflow-hidden">
          {/* Night map background texture */}
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')` }}
          />

          {/* SVG Map Traces matching the design */}
          <svg className="w-full h-72 z-10" viewBox="0 0 400 240">
            {/* Start Pin */}
            <circle cx="40" cy="180" r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
            <text x="40" y="205" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Origin</text>

            {/* Destination Pin */}
            <circle cx="360" cy="60" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text x="360" y="45" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">Destination</text>

            {/* Red Path: Current Route */}
            <path 
              d="M 40 180 Q 150 140 240 70 T 360 60" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="5" 
              strokeDasharray="6 4"
              opacity={selectedRouteId === 'current' ? '1' : '0.5'}
            />

            {/* Green Path: Smart Route */}
            <path 
              d="M 40 180 Q 120 220 230 190 T 360 60" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth={selectedRouteId === 'smart' ? '6' : '3'}
              opacity={selectedRouteId === 'smart' ? '1' : '0.6'}
            />

            {/* Amber Path: Low-Risk Route */}
            <path 
              d="M 40 180 Q 200 100 270 120 T 360 60" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth={selectedRouteId === 'low_risk' ? '6' : '3'}
              opacity={selectedRouteId === 'low_risk' ? '1' : '0.6'}
            />
          </svg>

          {/* Floating Callout Badges on map */}
          {/* Red tag */}
          <div className="absolute top-10 right-20 bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-red-400 shadow-lg flex items-center gap-1 z-20">
            <span>Current Route</span>
            <span className="font-mono">42 min</span>
          </div>

          {/* Green tag */}
          <div className="absolute bottom-10 left-36 bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-400 shadow-lg flex items-center gap-1 z-20 animate-bounce">
            <Sparkles className="w-3 h-3" />
            <span>Smart Route</span>
            <span className="font-mono">24 min</span>
          </div>

          {/* Amber tag */}
          <div className="absolute top-28 right-32 bg-amber-600/90 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-400 shadow-lg z-20">
            <span>Low-Risk Route 28 min</span>
          </div>

          {/* Bottom Route Legend */}
          <div className="absolute bottom-3 right-4 z-20 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-3 text-[10px] font-semibold text-slate-300">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Current</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Smart</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Alternative</span>
          </div>
        </div>
      </div>
    </div>
  );
}
