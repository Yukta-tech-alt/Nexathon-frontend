import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, X, Check, Crosshair } from 'lucide-react';

const MANGALURU_CENTER = [12.9141, 74.8560];

// Known regional landmarks for realistic proximity identification (no fake addresses)
const KNOWN_LANDMARKS = [
  { name: 'Hampankatta City Center, Mangaluru', lat: 12.8688, lng: 74.8436 },
  { name: 'Surathkal NITK Corridor, Mangaluru', lat: 13.0118, lng: 74.7943 },
  { name: 'Kottara Chowki Junction, Mangaluru', lat: 12.9056, lng: 74.8384 },
  { name: 'Pumpwell Mahaveera Circle, Mangaluru', lat: 12.8622, lng: 74.8637 },
  { name: 'Nanthoor Circle, Mangaluru', lat: 12.8756, lng: 74.8628 },
  { name: 'Lalbagh Road, Mangaluru', lat: 12.8812, lng: 74.8412 },
  { name: 'Mangaluru International Airport (Bajpe)', lat: 12.9612, lng: 74.8900 },
  { name: 'Ullal Junction, NH-66', lat: 12.8056, lng: 74.8520 },
  { name: 'Bantwal BC Road Highway Junction', lat: 12.8892, lng: 75.0321 },
  { name: 'Udupi City Center', lat: 13.3409, lng: 74.7421 }
];

function getApproximateLocationName(lat, lng) {
  // Check if within ~800m of a known landmark
  for (const lm of KNOWN_LANDMARKS) {
    const dLat = Math.abs(lat - lm.lat);
    const dLng = Math.abs(lng - lm.lng);
    if (dLat < 0.008 && dLng < 0.008) {
      return `${lm.name}`;
    }
  }
  // Otherwise, format clean coordinates as specified
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// Marker Pin Icon Generator
function createPickerPin(label, color = '#06b6d4') {
  return L.divIcon({
    className: 'custom-picker-pin',
    html: `
      <div class="relative flex items-center justify-center" style="width: 36px; height: 36px;">
        <span class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></span>
        <div style="background-color: ${color};" class="w-7 h-7 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-xs font-black text-slate-950">
          ${label}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

// Map Click Listener Component
function MapEventsHandler({ onSelectPoint }) {
  useMapEvents({
    click(e) {
      onSelectPoint(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Invalidate Size Controller for Modals
function ModalMapController() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
}

export default function MapLocationPicker({
  isOpen = false,
  onClose = () => {},
  mode = 'from', // 'from' | 'destination'
  initialCoords = null,
  onConfirm = () => {}
}) {
  const [selectedCoords, setSelectedCoords] = useState(initialCoords || MANGALURU_CENTER);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [locationLabel, setLocationLabel] = useState('');

  useEffect(() => {
    if (isOpen) {
      const initial = initialCoords || MANGALURU_CENTER;
      setSelectedCoords(initial);
      setLocationLabel(getApproximateLocationName(initial[0], initial[1]));
      setHasUserSelected(!!initialCoords);
    }
  }, [isOpen, initialCoords]);

  if (!isOpen) return null;

  const handlePointClick = (lat, lng) => {
    setSelectedCoords([lat, lng]);
    setHasUserSelected(true);
    setLocationLabel(getApproximateLocationName(lat, lng));
  };

  const handleConfirm = () => {
    onConfirm(locationLabel, selectedCoords);
    onClose();
  };

  const isFrom = mode === 'from';
  const pinColor = isFrom ? '#10b981' : '#06b6d4';
  const pinLabel = isFrom ? 'A' : 'B';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isFrom ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
              {isFrom ? <Navigation className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isFrom ? 'Select Starting Location' : 'Select Destination'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Click or tap anywhere on the map to position the point
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="w-full h-[340px] sm:h-[380px] relative bg-slate-950">
          <MapContainer
            center={selectedCoords}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
            style={{ width: '100%', height: '100%' }}
          >
            <ModalMapController />
            <MapEventsHandler onSelectPoint={handlePointClick} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            />

            {/* Placed Marker */}
            {selectedCoords && (
              <Marker position={selectedCoords} icon={createPickerPin(pinLabel, pinColor)}>
                <Popup>
                  <div className="p-1 text-xs text-slate-100">
                    <span className="font-bold text-cyan-400">{isFrom ? 'Start Point (A)' : 'Destination (B)'}</span>
                    <div className="text-[11px] text-slate-300 mt-0.5">{locationLabel}</div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Floating Crosshair Guide */}
          <div className="absolute top-3 left-3 z-[20] pointer-events-none">
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 backdrop-blur-md">
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>Click map to place pin</span>
            </div>
          </div>
        </div>

        {/* Confirmation Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Location Selected:
            </span>
            <div className="font-bold text-slate-100 truncate max-w-sm font-mono text-xs">
              {locationLabel || `${selectedCoords[0].toFixed(4)}, ${selectedCoords[1].toFixed(4)}`}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Use this location</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
