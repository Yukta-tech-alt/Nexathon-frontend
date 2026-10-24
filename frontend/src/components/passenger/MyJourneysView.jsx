import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { Play, Square, Navigation, Clock, CheckCircle } from 'lucide-react';

export default function MyJourneysView() {
  const { 
    activeJourney, 
    startJourney, 
    endJourney, 
    journeyHistory, 
    routes, 
    selectedRoute, 
    showToast 
  } = useRouteWise();

  const [origin, setOrigin] = useState('Surathkal, Mangaluru');
  const [destination, setDestination] = useState('Hampankatta City Center');
  const [showStartModal, setShowStartModal] = useState(false);

  const handleStartTrip = () => {
    startJourney(selectedRoute || routes[0], origin, destination);
    setShowStartModal(false);
    showToast('Journey Started', 'Active journey simulation running', 'success');
  };

  const handleEndTrip = () => {
    endJourney();
    showToast('Journey Completed', 'Trip saved to your history.', 'info');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Journeys</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track your active trip and view past commute history</p>
        </div>

        {!activeJourney.isActive ? (
          <button
            onClick={() => setShowStartModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Start Journey</span>
          </button>
        ) : (
          <button
            onClick={handleEndTrip}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>End Journey</span>
          </button>
        )}
      </div>

      {/* Start Modal */}
      {showStartModal && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white">Start New Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">From</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">To</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowStartModal(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleStartTrip}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
            >
              Begin
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Journey */}
      {activeJourney.isActive && (
        <div className="p-5 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Active Journey</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Speed: {activeJourney.speedKmh || 42} km/h
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">
                {activeJourney.origin || 'Mangaluru'} → {activeJourney.destination || 'Udupi'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeJourney.distanceRemainingKm || 12.4} km remaining
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono">
                {activeJourney.elapsedMinutes || 35} min
              </span>
              <span className="block text-[10px] text-slate-500">elapsed</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-1.5 transition-all duration-500"
              style={{ width: `${Math.min(activeJourney.progressPercent || 45, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 3. History List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Journey History
        </h2>

        {journeyHistory.length === 0 ? (
          <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center text-xs text-slate-500">
            No journey history available yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {journeyHistory.map((j) => (
              <div key={j.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-800/40 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">
                    {j.origin} → {j.destination}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {j.date || 'Recent'} · {j.routeUsed || 'Coastal Corridor'}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-slate-200 font-bold text-sm">
                    {j.durationMin || 45} min
                  </div>
                  {j.delayMin > 0 ? (
                    <span className="text-amber-400 text-[10px] block">+{j.delayMin}m delay</span>
                  ) : (
                    <span className="text-emerald-400 text-[10px] block">On time</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
