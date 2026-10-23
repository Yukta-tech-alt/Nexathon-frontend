import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import TrafficMap from '../../components/maps/TrafficMap';
import { 
  Search, 
  MapPin, 
  Route, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  Circle
} from 'lucide-react';

export default function PassengerDashboard() {
  const navigate = useNavigate();
  const { incidents, selectedRoute } = useRouteWise();

  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);

  // Derive the 3 core numbers from the active/selected route or incidents
  const typicalMin = selectedRoute?.typicalDurationMin || 35;
  const currentMin = selectedRoute?.currentDurationMin || 52;
  const delayMin = selectedRoute?.delayMin !== undefined ? selectedRoute.delayMin : 17;

  const handlePlanRoute = (e) => {
    e.preventDefault();
    const dest = destinationSearch.trim() || 'Hampankatta City Center';
    navigate(`/passenger/route?destination=${encodeURIComponent(dest)}`);
  };

  const handleMarkerClick = (inc) => {
    setSelectedIncident(inc);
    setShowEvidence(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header: Simple Greeting & Clean Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Good morning</h1>
          <p className="text-xs text-slate-400 mt-0.5">Where are you heading today?</p>
        </div>

        {/* Search destination form */}
        <form onSubmit={handlePlanRoute} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              placeholder="Search destination..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow shrink-0 flex items-center gap-1.5"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Plan Route</span>
          </button>
        </form>
      </div>

      {/* 2. Main Content: Map (Hero, 65-70%) + Traffic Alerts (30-35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Map: Hero Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <TrafficMap
              incidents={incidents}
              selectedRoute={selectedRoute}
              onIncidentClick={handleMarkerClick}
              showCurrentLocation={true}
              height="h-[420px] sm:h-[480px] lg:h-[520px]"
            />
          </div>

          {/* 3 Core Numbers: Typical, Current, Delay */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm text-center">
            <div className="p-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Typical</span>
              <span className="text-xl sm:text-2xl font-black text-slate-200 mt-1 block font-mono">
                {typicalMin} min
              </span>
            </div>
            <div className="p-2 border-x border-slate-800">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Current</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-1 block font-mono">
                {currentMin} min
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Delay</span>
              <span className={`text-xl sm:text-2xl font-black mt-1 block font-mono ${delayMin > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {delayMin > 0 ? `+${delayMin} min` : '0 min'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Traffic Alerts Feed */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-wide">Traffic Alerts</h2>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
              {incidents.length} Active
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {incidents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-1">
                <p>No traffic alerts</p>
                <p className="text-[11px] text-slate-600">Road conditions in your area are clear.</p>
              </div>
            ) : (
              incidents.map((inc) => {
                const isSevere = inc.severity === 'severe' || inc.severity === 'critical';
                const isModerate = inc.severity === 'moderate';

                return (
                  <div
                    key={inc.id}
                    onClick={() => handleMarkerClick(inc)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedIncident?.id === inc.id
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isSevere ? 'bg-red-500' : isModerate ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                          <span className="font-bold text-slate-200 capitalize">{inc.category || 'Hazard'}</span>
                          <span className="text-[10px] text-slate-500">• {inc.reportedAgo || 'Recent'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {inc.locationName || 'Mangaluru Road'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          +{inc.delayMinutes || 15}m
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {inc.confirmationCount || 1} {inc.confirmationCount === 1 ? 'report' : 'reports'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 3. INCIDENT DETAIL SIDE PANEL (Progressive Disclosure) */}
      {selectedIncident && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between text-slate-100">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Incident Details</span>
                <h3 className="text-xl font-black text-white capitalize mt-0.5">
                  {selectedIncident.category || 'Road Hazard'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedIncident.locationName || 'NH-66 · Mangaluru'}
                </p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Severity Pill */}
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                selectedIncident.severity === 'severe' || selectedIncident.severity === 'critical'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : selectedIncident.severity === 'moderate'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <span>{selectedIncident.severity === 'severe' ? '🔴 Severe' : selectedIncident.severity === 'moderate' ? '🟡 Moderate' : '🟢 Normal'}</span>
              </span>
              <span className="text-xs text-slate-400">• Reported {selectedIncident.reportedAgo || 'Recently'}</span>
            </div>

            {/* Concise Stats: Delay, Reports, Verification */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Delay</div>
                <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                  {selectedIncident.delayMinutes || 15} min
                </div>
              </div>
              <div className="border-x border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Reports</div>
                <div className="text-base font-bold text-slate-200 font-mono mt-0.5">
                  {selectedIncident.confirmationCount || 1}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">TrustScore</div>
                <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                  {selectedIncident.verificationLevel >= 4 ? 'High' : selectedIncident.verificationLevel >= 2 ? 'Medium' : 'Basic'}
                </div>
              </div>
            </div>

            {/* Compact 5-Signal Timeline */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Verification</span>
                <span className="text-[11px] text-cyan-400 font-mono font-bold">
                  {Math.min(selectedIncident.verificationLevel || 3, 5)} of 5 signals
                </span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs font-medium">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>User Reported</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>GPS Location Confirmed</span>
                </div>
                <div className={`flex items-center gap-2 ${selectedIncident.verificationLevel >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {selectedIncident.verificationLevel >= 3 ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <Circle className="w-3.5 h-3.5 shrink-0" />}
                  <span>Multiple Citizen Reports</span>
                </div>
                <div className={`flex items-center gap-2 ${selectedIncident.verificationLevel >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {selectedIncident.verificationLevel >= 4 ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <Circle className="w-3.5 h-3.5 shrink-0" />}
                  <span>Telemetry Speed Slowdown</span>
                </div>
                <div className={`flex items-center gap-2 ${selectedIncident.verificationLevel >= 5 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {selectedIncident.verificationLevel >= 5 ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <Circle className="w-3.5 h-3.5 shrink-0" />}
                  <span>Media / Forensic Evidence</span>
                </div>
              </div>
            </div>

            {/* Evidence Drawer Toggle */}
            {showEvidence && selectedIncident.imageUrl && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forensic Image</span>
                <img
                  src={selectedIncident.imageUrl}
                  alt="Incident evidence"
                  className="w-full h-36 object-cover rounded-lg border border-slate-800"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            {selectedIncident.imageUrl && (
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                {showEvidence ? 'Hide Evidence' : 'View Evidence'}
              </button>
            )}

            <button
              onClick={() => {
                setSelectedIncident(null);
                navigate(`/passenger/route?avoid=${encodeURIComponent(selectedIncident.locationName || 'Incident')}`);
              }}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Route className="w-3.5 h-3.5" />
              <span>Alternative Route</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
