import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Search, 
  X, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Fuel, 
  Check, 
  Play, 
  History
} from 'lucide-react';

export default function RoutePlannerBox({ onStartJourneyClick = null }) {
  const { routes, selectedRoute, setSelectedRoute, startJourney, activeJourney, showToast } = useRouteWise();

  const [origin, setOrigin] = useState('Surathkal NITK Corridor, Mangaluru');
  const [destination, setDestination] = useState('Hampankatta City Center, Mangaluru');
  const [recentDestinations] = useState([
    'Udupi Krishna Temple Circle',
    'Mangaluru International Airport (Bajpe)',
    'Pumpwell Mahaveera Circle',
    'Bantwal BC Road Highway Junction'
  ]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    showToast('Locations Swapped', '', 'info');
  };

  const handleClear = () => {
    setDestination('');
  };

  const handleSelectRecent = (dest) => {
    setDestination(dest);
    showToast(`Destination Set: ${dest}`, '', 'info');
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    showToast(`Selected: ${route.name}`, `${route.currentDurationMin} mins estimated travel time.`, 'info');
  };

  const handleStart = (route) => {
    startJourney(route, origin, destination);
    if (onStartJourneyClick) onStartJourneyClick();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-slate-100 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Smart Route Optimizer</span>
          </h3>
          <p className="text-xs text-slate-400">Comparing multi-criteria corridor alternatives</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 font-mono">
          Demo Routing Engine
        </span>
      </div>

      {/* Origin & Destination Inputs */}
      <div className="space-y-3">
        {/* Origin */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          </div>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Starting location (or detected GPS)..."
            className="w-full pl-8 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSwap}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
          </div>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination in Mangaluru / Coastal Corridor..."
            className="w-full pl-8 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {destination && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Destinations Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
          <History className="w-3 h-3" /> Recent Coastal Destinations:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {recentDestinations.map((dest, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectRecent(dest)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 hover:text-cyan-300 transition-colors truncate max-w-xs"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Route Alternatives Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>3 Recommended Route Alternatives</span>
          <span className="text-[10px] text-slate-500">Telemetry-backed estimates</span>
        </div>

        <div className="space-y-2.5">
          {routes.map((route) => {
            const isSelected = selectedRoute && selectedRoute.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => handleSelectRoute(route)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-950/90 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${route.tagColor}`}>
                      {route.tag}
                    </span>
                    <h4 className="font-bold text-xs text-white mt-1.5">{route.name}</h4>
                    <p className="text-[11px] text-slate-400">{route.summary}</p>
                  </div>

                  {/* Time & Distance Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-cyan-400 font-mono">
                      {route.currentDurationMin} min
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {route.distanceKm} km
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Delay:</span>
                    <span className={`font-mono font-bold ${route.delayMin > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {route.delayMin > 0 ? `+${route.delayMin} min` : 'Zero Delay'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">Hazards:</span>
                    <span className={`font-mono font-bold ${route.incidentCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {route.incidentCount} reported
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">Congestion:</span>
                    <span className="font-semibold capitalize text-slate-300">
                      {route.congestionLevel}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-cyan-400" /> ~{route.fuelEstimateLiters}L fuel
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRoute(route);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select Route'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStart(route);
                      }}
                      disabled={activeJourney.isActive}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>Start</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
