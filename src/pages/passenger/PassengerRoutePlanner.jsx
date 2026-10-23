import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import TrafficMap from '../../components/maps/TrafficMap';
import MapLocationPicker from '../../components/maps/MapLocationPicker';
import { 
  Route, 
  MapPin, 
  Navigation, 
  Map as MapIcon, 
  Play, 
  ArrowUpDown, 
  Clock, 
  Search,
  Check
} from 'lucide-react';

const POPULAR_LOCATIONS = [
  { name: 'Surathkal NITK Corridor, Mangaluru', coords: [13.0118, 74.7943] },
  { name: 'Hampankatta City Center, Mangaluru', coords: [12.8688, 74.8436] },
  { name: 'Pumpwell (Mahaveera Circle), Mangaluru', coords: [12.8622, 74.8637] },
  { name: 'Kottara Chowki Flyover, Mangaluru', coords: [12.9056, 74.8384] },
  { name: 'Lalbagh Road, Mangaluru', coords: [12.8812, 74.8412] },
  { name: 'Mangaluru International Airport (Bajpe)', coords: [12.9612, 74.8900] },
  { name: 'Udupi City Center', coords: [13.3409, 74.7421] },
  { name: 'Ullal Junction, NH-66', coords: [12.8056, 74.8520] },
  { name: 'Bantwal BC Road Highway Junction', coords: [12.8892, 75.0321] },
  { name: 'Nanthoor Circle, Mangaluru', coords: [12.8756, 74.8628] },
  { name: 'Kuntikan Junction, Mangaluru', coords: [12.8988, 74.8492] },
  { name: 'Kadri Park Road, Mangaluru', coords: [12.8891, 74.8589] }
];

export default function PassengerRoutePlanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { routes, selectedRoute, setSelectedRoute, startJourney, incidents, showToast } = useRouteWise();

  // Location text states
  const [fromLocation, setFromLocation] = useState('Surathkal NITK Corridor, Mangaluru');
  const [toLocation, setToLocation] = useState(
    searchParams.get('destination') || 'Hampankatta City Center, Mangaluru'
  );

  // Dedicated coordinates states (ensuring strict separation)
  const [fromCoords, setFromCoords] = useState([13.0118, 74.7943]);
  const [toCoords, setToCoords] = useState([12.8688, 74.8436]);

  // Autocomplete UI states
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Map Picker Modal state
  const [mapPickerMode, setMapPickerMode] = useState(null); // 'from' | 'destination' | null

  // Route calculation feedback state
  const [hasSearched, setHasSearched] = useState(true);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowToSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions
  const filteredFromSuggestions = POPULAR_LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(fromLocation.toLowerCase())
  );
  const filteredToSuggestions = POPULAR_LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(toLocation.toLowerCase())
  );

  // Handle Suggestion Selection
  const handleSelectFromSuggestion = (loc) => {
    setFromLocation(loc.name);
    setFromCoords(loc.coords);
    setShowFromSuggestions(false);
  };

  const handleSelectToSuggestion = (loc) => {
    setToLocation(loc.name);
    setToCoords(loc.coords);
    setShowToSuggestions(false);
  };

  // Open Map Picker
  const handleOpenMapPicker = (mode) => {
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    setMapPickerMode(mode);
  };

  // Handle Map Picker Confirmation (guaranteed separation of state)
  const handleConfirmMapLocation = (locationLabel, coords) => {
    if (mapPickerMode === 'from') {
      setFromLocation(locationLabel);
      setFromCoords(coords);
      showToast('Starting Point Selected', locationLabel, 'success');
    } else if (mapPickerMode === 'destination') {
      setToLocation(locationLabel);
      setToCoords(coords);
      showToast('Destination Selected', locationLabel, 'success');
    }
  };

  // Swap Locations
  const handleSwap = () => {
    const tempText = fromLocation;
    const tempCoords = fromCoords;
    setFromLocation(toLocation);
    setFromCoords(toCoords);
    setToLocation(tempText);
    setToCoords(tempCoords);
    showToast('Locations Swapped', '', 'info');
  };

  // Plan Route Submission
  const isPlanDisabled = !fromLocation.trim() || !toLocation.trim();

  const handlePlanRoute = (e) => {
    e.preventDefault();
    if (isPlanDisabled) return;

    setHasSearched(true);
    // Update active route labels and coordinates
    if (selectedRoute) {
      const updatedRoute = {
        ...selectedRoute,
        origin: fromLocation,
        destination: toLocation
      };
      if (fromCoords && toCoords && selectedRoute.coordinates) {
        // Adjust endpoints for the polyline
        const coordsCopy = [...selectedRoute.coordinates];
        coordsCopy[0] = fromCoords;
        coordsCopy[coordsCopy.length - 1] = toCoords;
        updatedRoute.coordinates = coordsCopy;
      }
      setSelectedRoute(updatedRoute);
    }

    showToast('Route Calculated', `Navigating ${fromLocation.split(',')[0]} → ${toLocation.split(',')[0]}`, 'success');
  };

  const handleSelectRouteOption = (r) => {
    const updated = {
      ...r,
      origin: fromLocation,
      destination: toLocation
    };
    if (fromCoords && toCoords && r.coordinates) {
      const coordsCopy = [...r.coordinates];
      coordsCopy[0] = fromCoords;
      coordsCopy[coordsCopy.length - 1] = toCoords;
      updated.coordinates = coordsCopy;
    }
    setSelectedRoute(updated);
  };

  const handleStartTrip = (r) => {
    startJourney(r, fromLocation, toLocation);
    navigate('/passenger/journeys');
  };

  // Display route with customized endpoints if available
  const displayRoute = selectedRoute ? {
    ...selectedRoute,
    origin: fromLocation,
    destination: toLocation
  } : routes[0];

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Plan Route</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Type or select points on the map to compare route alternatives
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Dual-Method Location Input + Route Cards */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Dual-Method Input Form */}
          <form onSubmit={handlePlanRoute} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3.5 relative">
            
            {/* FROM FIELD */}
            <div className="space-y-1 relative" ref={fromRef}>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <label>From</label>
                <span className="text-[10px] text-slate-500">Search or tap map</span>
              </div>
              
              <div className="relative flex items-center">
                <Navigation className="w-3.5 h-3.5 text-emerald-400 absolute left-3 pointer-events-none" />
                
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => {
                    setFromLocation(e.target.value);
                    setShowFromSuggestions(true);
                  }}
                  onFocus={() => setShowFromSuggestions(true)}
                  placeholder="Enter starting point..."
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />

                {/* Map Picker Icon Button */}
                <button
                  type="button"
                  onClick={() => handleOpenMapPicker('from')}
                  title="Select starting location on map"
                  className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showFromSuggestions && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl divide-y divide-slate-800/80 text-xs">
                  {filteredFromSuggestions.length > 0 ? (
                    filteredFromSuggestions.map((loc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectFromSuggestion(loc)}
                        className="w-full text-left p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{loc.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Suggested</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2.5 text-slate-500 text-[11px] text-center">
                      Custom location: "{fromLocation}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Swap Button */}
            <div className="flex justify-center -my-1.5">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap From and Destination"
                className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DESTINATION FIELD */}
            <div className="space-y-1 relative" ref={toRef}>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <label>Destination</label>
                <span className="text-[10px] text-slate-500">Search or tap map</span>
              </div>
              
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
                
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    setShowToSuggestions(true);
                  }}
                  onFocus={() => setShowToSuggestions(true)}
                  placeholder="Enter destination..."
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />

                {/* Map Picker Icon Button */}
                <button
                  type="button"
                  onClick={() => handleOpenMapPicker('destination')}
                  title="Select destination on map"
                  className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showToSuggestions && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl divide-y divide-slate-800/80 text-xs">
                  {filteredToSuggestions.length > 0 ? (
                    filteredToSuggestions.map((loc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectToSuggestion(loc)}
                        className="w-full text-left p-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{loc.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Suggested</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2.5 text-slate-500 text-[11px] text-center">
                      Custom location: "{toLocation}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Plan Route Button (Active only when BOTH are selected) */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isPlanDisabled}
                className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5 ${
                  isPlanDisabled
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-cyan-600/20 active:scale-98'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                <span>{isPlanDisabled ? 'Select Both Locations to Plan' : 'Plan Route'}</span>
              </button>
            </div>

          </form>

          {/* 3 Route Options */}
          {hasSearched && (
            <div className="space-y-2.5">
              {routes.map((r) => {
                const isSelected = selectedRoute?.id === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRouteOption(r)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white capitalize">
                          {r.tag || r.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {r.currentDurationMin} min · {r.distanceKm} km
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRouteOption(r);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>

                        {isSelected && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTrip(r);
                            }}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow"
                          >
                            <Play className="w-3 h-3 fill-slate-950" />
                            <span>Start</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right: Map Visualizer */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Route Visualizer</span>
            <span className="font-mono text-cyan-400">
              {fromLocation.split(',')[0]} → {toLocation.split(',')[0]}
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <TrafficMap
              incidents={incidents}
              selectedRoute={displayRoute}
              height="h-[460px] lg:h-[540px]"
            />
          </div>
        </div>

      </div>

      {/* REUSABLE MAP LOCATION PICKER MODAL */}
      <MapLocationPicker
        isOpen={!!mapPickerMode}
        mode={mapPickerMode || 'from'}
        initialCoords={mapPickerMode === 'from' ? fromCoords : toCoords}
        onClose={() => setMapPickerMode(null)}
        onConfirm={handleConfirmMapLocation}
      />

    </div>
  );
}
