import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  LocateFixed
} from 'lucide-react';
import { SEVERITIES } from '../data/mockHazards';

export default function RoadMap({ 
  hazards, 
  selectedHazard, 
  onSelectHazard, 
  onMapClickToReport,
  onUpvote,
  onOpenVerifyModal
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [mapReady, setMapReady] = useState(false);
  const [clickToPinActive, setClickToPinActive] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Bangalore coordinates (matching mock dataset)
    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Dark styled tile layer from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    // Map click handler for reporting hazards
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (onMapClickToReport) {
        onMapClickToReport(lat, lng);
      }
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when hazards change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    hazards.forEach((hazard) => {
      if (!hazard.lat || !hazard.lng) return;

      const isResolved = hazard.status === 'resolved';
      const isCritical = hazard.severity === 'critical' && !isResolved;
      
      const pinColor = isResolved 
        ? '#10b981' 
        : isCritical 
        ? '#ef4444' 
        : hazard.severity === 'moderate' 
        ? '#f59e0b' 
        : '#3b82f6';

      // Custom DivIcon for sleek modern marker
      const markerHtml = `
        <div class="relative group cursor-pointer">
          ${isCritical ? '<div class="absolute -inset-2 rounded-full bg-red-500/40 animate-ping"></div>' : ''}
          <div style="background-color: ${pinColor}; box-shadow: 0 4px 14px ${pinColor}80;" 
               class="relative w-9 h-9 rounded-2xl flex items-center justify-center text-slate-950 font-black border-2 border-white transform transition-transform hover:scale-125 shadow-xl">
            ${isResolved 
              ? '<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' 
              : '<svg class="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
            }
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/40"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-road-marker',
        html: markerHtml,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([hazard.lat, hazard.lng], { icon: customIcon }).addTo(map);

      // Create rich popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 w-64 text-left';
      popupContent.innerHTML = `
        <div class="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-900">
          <img src="${hazard.imageUrl}" alt="${hazard.title}" class="w-full h-full object-cover" />
          <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${isResolved ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}">
            ${isResolved ? 'Fixed' : hazard.severity.toUpperCase()}
          </span>
          <span class="absolute bottom-2 right-2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-white font-mono">
            👍 ${hazard.upvotes}
          </span>
        </div>
        <h4 class="font-bold text-sm text-white leading-tight line-clamp-2">${hazard.title}</h4>
        <p class="text-[11px] text-slate-300 mt-1 line-clamp-2">${hazard.address}</p>
        <div class="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
          <span class="text-amber-400 font-semibold">${hazard.truthScore}% Truth Score</span>
          <span class="text-slate-400 font-medium">${hazard.ward}</span>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectHazard) {
          onSelectHazard(hazard);
        }
      });

      markersRef.current[hazard.id] = marker;
    });
  }, [hazards, mapReady]);

  // Pan to selected hazard if passed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedHazard) return;
    mapInstanceRef.current.flyTo([selectedHazard.lat, selectedHazard.lng], 15, {
      animate: true,
      duration: 1.2
    });

    const marker = markersRef.current[selectedHazard.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedHazard]);

  // Handle Locate Me
  const handleLocateMe = () => {
    if (!mapInstanceRef.current) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
        },
        () => {
          // Fallback to center
          mapInstanceRef.current.flyTo([12.9716, 77.5946], 13);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Instructions Banner */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
        <p className="text-xs text-slate-200">
          <strong className="text-amber-400">Interactive:</strong> Click any pin to inspect hazard, or <span className="underline decoration-amber-400">click anywhere on the map</span> to drop a new report pin!
        </p>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          aria-label="Zoom in map"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white rounded-xl border border-slate-700 shadow-lg transition-transform active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          aria-label="Zoom out map"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white rounded-xl border border-slate-700 shadow-lg transition-transform active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleLocateMe}
          aria-label="Locate my position on map"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-amber-400 rounded-xl border border-slate-700 shadow-lg transition-transform active:scale-95"
          title="Locate My Area"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-800 px-3 py-2.5 rounded-2xl shadow-xl flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
          <span className="text-slate-300 font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
          <span className="text-slate-300 font-medium">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
          <span className="text-slate-300 font-medium">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span className="text-emerald-300 font-medium">Verified Fixed</span>
        </div>
      </div>
    </div>
  );
}
