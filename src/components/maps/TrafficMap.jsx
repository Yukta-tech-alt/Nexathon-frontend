import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Navigation, 
  LocateFixed, 
  Maximize2, 
  Layers, 
  Car, 
  Flame, 
  Compass, 
  RefreshCw, 
  Info,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  WifiOff
} from 'lucide-react';
import { useRouteWise } from '../../context/RouteWiseContext';

// Default Mangaluru Demonstration Coordinates
export const MANGALURU_CENTER = [12.9141, 74.8560];
export const DEFAULT_ZOOM = 11;

/**
 * Helper to generate custom SVG Leaflet divIcons for different incident types and severities.
 * Uses inline SVGs to avoid Vite asset resolution issues with default Leaflet PNGs.
 */
function createIncidentDivIcon(category, severity) {
  let color = '#06b6d4'; // default cyan
  let bg = 'rgba(6, 182, 212, 0.2)';
  let borderColor = '#06b6d4';
  let isSevere = severity === 'severe' || severity === 'critical';
  let isClosed = severity === 'closure' || category === 'roadblock' || category === 'closure';

  if (isClosed) {
    color = '#ffffff';
    bg = 'rgba(15, 23, 42, 0.95)';
    borderColor = '#ef4444';
  } else if (isSevere) {
    color = '#ef4444';
    bg = 'rgba(239, 68, 68, 0.25)';
    borderColor = '#ef4444';
  } else if (severity === 'moderate') {
    color = '#f59e0b';
    bg = 'rgba(245, 158, 11, 0.25)';
    borderColor = '#f59e0b';
  } else {
    color = '#10b981';
    bg = 'rgba(16, 185, 129, 0.25)';
    borderColor = '#10b981';
  }

  // Category Icon SVGs
  let svgInner = '';
  switch (category?.toLowerCase()) {
    case 'accident':
      // Collision / Alert
      svgInner = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`;
      break;
    case 'congestion':
    case 'heavy_traffic':
      // Car / Traffic
      svgInner = `<rect x="3" y="11" width="18" height="9" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M5 11l2-6h10l2 6"/>`;
      break;
    case 'roadblock':
    case 'closure':
    case 'road_closure':
      // Octagon / Barrier
      svgInner = `<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
      break;
    case 'flooding':
    case 'flood':
    case 'waterlogging':
      // Water droplet / wave
      svgInner = `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`;
      break;
    case 'construction':
    case 'road_repair':
      // Cone / Hammer
      svgInner = `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`;
      break;
    case 'landslide':
      // Mountain
      svgInner = `<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>`;
      break;
    case 'breakdown':
    case 'vehicle_breakdown':
      // Wrench / tool
      svgInner = `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`;
      break;
    default:
      svgInner = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
  }

  const pulseHtml = isSevere
    ? `<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75"></span>`
    : '';

  return L.divIcon({
    className: 'custom-incident-pin',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
        ${pulseHtml}
        <div style="background-color: ${bg}; border: 2px solid ${borderColor}; box-shadow: 0 4px 14px rgba(0,0,0,0.6);" class="w-9 h-9 rounded-full flex items-center justify-center transition-transform transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            ${svgInner}
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
}

// User current location pulsing pin
const userLocationPin = L.divIcon({
  className: 'custom-user-pin',
  html: `
    <div class="relative flex items-center justify-center" style="width: 34px; height: 34px;">
      <span class="absolute w-8 h-8 rounded-full bg-cyan-500/40 animate-ping"></span>
      <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center">
        <div class="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
      </div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18]
});

// Route Start & End Marker Icons
const routeEndpointPin = (label, color = '#06b6d4') => L.divIcon({
  className: 'custom-endpoint-pin',
  html: `
    <div class="relative flex items-center justify-center" style="width: 26px; height: 26px;">
      <div style="background-color: ${color};" class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-black text-slate-950">
        ${label}
      </div>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -14]
});

/**
 * Controller component inside MapContainer to handle resize invalidation,
 * route auto-fit, and imperative camera controls.
 */
function MapController({ selectedRoute, targetCenter, onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) onMapReady(map);

    // Invalidate size on initial load to resolve 0px or misaligned container glitches
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, onMapReady]);

  // Fly to target center if changed
  useEffect(() => {
    if (targetCenter && targetCenter[0] && targetCenter[1]) {
      map.flyTo(targetCenter, 13, { duration: 1.2 });
    }
  }, [targetCenter, map]);

  // Auto-fit route bounds if a selected route with coordinates is provided
  useEffect(() => {
    if (selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length > 1) {
      try {
        const bounds = L.latLngBounds(selectedRoute.coordinates);
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
      } catch (err) {
        // Fallback gracefully
      }
    }
  }, [selectedRoute, map]);

  return null;
}

/**
 * TrafficMap — Production Reusable Leaflet + OpenStreetMap Map for RouteWise AI
 */
export default function TrafficMap({
  incidents = [],
  selectedRoute = null,
  onIncidentClick = null,
  showCurrentLocation = true,
  height = null,
  className = '',
  interactive = true
}) {
  const { showToast } = useRouteWise();
  const mapRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [targetCenter, setTargetCenter] = useState(null);
  const [hasTileError, setHasTileError] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Responsive Height Class: Desktop 500-600px, Tablet 450px, Mobile 350-400px
  const containerHeightClass = height || 'h-[380px] sm:h-[450px] lg:h-[550px]';

  // Handle "Use My Location" via Browser Geolocation API
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation Unsupported', 'Your browser does not support geolocation.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        setUserLocation(coords);
        setTargetCenter(coords);
        showToast('Current Location Found', 'Centered map on your GPS coordinates.', 'success');
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Location permission was not granted. You can still explore the traffic map manually.';
        if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable on your device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. You can still explore the traffic map manually.';
        }
        showToast('Location Access', msg, 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Recenter to Mangaluru Demonstration Area
  const handleRecenterMangaluru = () => {
    setTargetCenter([...MANGALURU_CENTER]);
    showToast('Map Reset', 'Centered on Mangaluru demonstration corridor.', 'info');
  };

  // Extract valid route coordinates if provided
  const routeCoords = selectedRoute?.coordinates || [];
  const startCoord = routeCoords.length > 0 ? routeCoords[0] : null;
  const endCoord = routeCoords.length > 1 ? routeCoords[routeCoords.length - 1] : null;

  return (
    <div className={`w-full ${containerHeightClass} rounded-2xl overflow-hidden relative border border-slate-800 shadow-xl bg-slate-950 flex flex-col ${className}`}>
      
      {/* TOP FLOATING OVERLAYS (Z-20) */}
      <div className="absolute top-3 left-3 right-3 z-[20] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Badge: Data Mode & Initial Demo Area Notice */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Traffic Data: Dataset Mode
            </span>
            <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">| Mangaluru Demonstration</span>
          </div>

          {selectedRoute && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs shadow-lg">
              <Navigation className="w-3.5 h-3.5" />
              <span className="font-bold">DEMO ROUTE:</span>
              <span className="truncate max-w-[160px]">{selectedRoute.name || 'Selected Route'}</span>
              <span className="text-[10px] text-cyan-400/80">(Application Data)</span>
            </div>
          )}
        </div>

        {/* Right Controls: Location & Recenter Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {showCurrentLocation && (
            <button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              title="Use My Location"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Use My Location'}</span>
            </button>
          )}

          <button
            onClick={handleRecenterMangaluru}
            title="Recenter to Mangaluru"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md text-xs font-semibold shadow-lg transition-all flex items-center gap-1 active:scale-95"
          >
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Mangaluru</span>
          </button>
        </div>
      </div>

      {/* NO INCIDENTS BANNER (when incident list is empty) */}
      {incidents.length === 0 && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[20] pointer-events-none max-w-md w-[90%] text-center">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-300 text-xs shadow-2xl space-y-0.5">
            <div className="font-bold text-amber-400 flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>No incident data available</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Add or import incident data to display traffic incidents on the map.
            </p>
          </div>
        </div>
      )}

      {/* ERROR OVERLAY (if tiles fail to load) */}
      {hasTileError && (
        <div className="absolute inset-0 z-[25] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
          <div className="max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-3">
            <WifiOff className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-100">Map tiles could not be loaded</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check your internet connection or map configuration. The rest of the dashboard remains fully operational.
            </p>
            <button
              onClick={() => setHasTileError(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition-colors"
            >
              Retry Tiles
            </button>
          </div>
        </div>
      )}

      {/* LEAFLET MAP CONTAINER */}
      <div className="w-full h-full relative z-[10]">
        <MapContainer
          center={MANGALURU_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={interactive}
          dragging={interactive}
          doubleClickZoom={interactive}
          zoomControl={false}
          attributionControl={true}
          className="w-full h-full"
          style={{ width: '100%', height: '100%', minHeight: '350px', backgroundColor: '#0f172a' }}
        >
          {/* Map Resizer & Controller */}
          <MapController 
            selectedRoute={selectedRoute} 
            targetCenter={targetCenter} 
            onMapReady={(m) => {
              mapRef.current = m;
              setIsMapLoaded(true);
            }} 
          />

          {/* OpenStreetMap Standard Tiles with proper attribution */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            eventHandlers={{
              tileerror: () => {
                // Graceful flag when network tile access fails
                setHasTileError(true);
              }
            }}
          />

          {/* USER LOCATION MARKER */}
          {userLocation && (
            <Marker position={userLocation} icon={userLocationPin}>
              <Popup>
                <div className="p-2 space-y-1 text-slate-100">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <LocateFixed className="w-3.5 h-3.5" />
                    <span>Your Current Location</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Lat: {userLocation[0].toFixed(4)}, Lng: {userLocation[1].toFixed(4)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Acquired via browser Geolocation API
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* DEMO ROUTE POLYLINE */}
          {routeCoords.length > 1 && (
            <>
              {/* Glowing halo behind polyline */}
              <Polyline
                positions={routeCoords}
                pathOptions={{
                  color: '#0891b2',
                  weight: 8,
                  opacity: 0.35,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Sharp primary polyline */}
              <Polyline
                positions={routeCoords}
                pathOptions={{
                  color: '#06b6d4',
                  weight: 4,
                  opacity: 0.95,
                  dashArray: selectedRoute?.isAlternative ? '8, 8' : null,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />

              {/* Start & End Route Pins */}
              {startCoord && (
                <Marker position={startCoord} icon={routeEndpointPin('A', '#10b981')}>
                  <Popup>
                    <div className="p-2 text-xs text-slate-100">
                      <span className="font-bold text-emerald-400">Route Origin (A):</span> {selectedRoute.origin || 'Start Point'}
                    </div>
                  </Popup>
                </Marker>
              )}
              {endCoord && (
                <Marker position={endCoord} icon={routeEndpointPin('B', '#06b6d4')}>
                  <Popup>
                    <div className="p-2 text-xs text-slate-100">
                      <span className="font-bold text-cyan-400">Route Destination (B):</span> {selectedRoute.destination || 'Destination'}
                    </div>
                  </Popup>
                </Marker>
              )}
            </>
          )}

          {/* INCIDENT MARKERS */}
          {incidents.map((inc) => {
            if (!inc.lat || !inc.lng) return null;
            const icon = createIncidentDivIcon(inc.category, inc.severity);

            return (
              <Marker 
                key={inc.id} 
                position={[Number(inc.lat), Number(inc.lng)]} 
                icon={icon}
              >
                <Popup className="routewise-popup">
                  <div className="p-3 space-y-2 text-slate-100 min-w-[220px] max-w-[280px]">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          inc.severity === 'severe' || inc.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : inc.severity === 'moderate'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {inc.category || 'Incident'}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                          {inc.title || 'Road Obstruction'}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Location:</span>
                        <span className="text-slate-200 font-medium truncate max-w-[140px] text-right">
                          {inc.locationName || 'Mangaluru Corridor'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span>Severity:</span>
                        <span className="capitalize font-medium text-slate-200">
                          {inc.severity === 'severe' ? '🔴 Severe' : inc.severity === 'moderate' ? '🟡 Moderate' : '🟢 Normal'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span>Est. Delay:</span>
                        <span className="font-bold text-amber-400">
                          +{inc.delayMinutes || 15} min
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span>Verification:</span>
                        <span className="text-cyan-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Level {inc.verificationLevel || 3} ({inc.confirmationCount || 3} reports)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span>Reported:</span>
                        <span className="text-slate-300 font-mono text-[10px]">
                          {inc.reportedAgo || 'Recently'}
                        </span>
                      </div>
                    </div>

                    {/* Signature Interaction: Why is this road affected? */}
                    {onIncidentClick && (
                      <button
                        onClick={() => onIncidentClick(inc)}
                        className="w-full mt-2 py-1.5 px-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Why is this road affected?</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* COMPACT MAP LEGEND (Z-20, Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-[20] pointer-events-none">
        <div className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] shadow-xl text-slate-300 pointer-events-auto flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hidden sm:inline">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-400">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-[10px] text-slate-400">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-[10px] text-slate-400">Severe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-red-500"></span>
            <span className="text-[10px] text-slate-400">Closed</span>
          </div>
        </div>
      </div>

    </div>
  );
}
