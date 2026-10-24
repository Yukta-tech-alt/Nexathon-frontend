import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  LayoutDashboard, 
  MapPin, 
  AlertTriangle, 
  Bell, 
  Route, 
  Dna, 
  BarChart3, 
  History, 
  User, 
  Search, 
  CheckCircle2, 
  Clock, 
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { MOCK_INCIDENTS, INCIDENT_TYPES } from '../data/roadTruthData';

export default function MainDashboard({ 
  onSelectIncident, 
  onNavigateSection,
  onOpenReportModal 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');

  const filteredIncidents = MOCK_INCIDENTS.filter((item) => {
    const matchesCat = selectedCategoryFilter === 'all' || item.type === selectedCategoryFilter;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Initialize interactive map for Mangaluru coordinates
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.8700, 74.8450],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Dark sleek tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Draw simulated traffic corridor polylines (Normal, Moderate, Heavy, Closed)
    // Heavy traffic on NH-66 corridor near Thokkottu
    L.polyline([
      [12.8250, 74.8550],
      [12.8335, 74.8584],
      [12.8550, 74.8520]
    ], { color: '#ef4444', weight: 6, opacity: 0.85 }).addTo(map);

    // Moderate corridor near Kottara
    L.polyline([
      [12.8900, 74.8420],
      [12.9056, 74.8384],
      [12.9200, 74.8350]
    ], { color: '#f59e0b', weight: 5, opacity: 0.8 }).addTo(map);

    // Normal smooth flow on alternate bypass
    L.polyline([
      [12.8300, 74.8700],
      [12.8600, 74.8750],
      [12.8900, 74.8650]
    ], { color: '#10b981', weight: 5, opacity: 0.85 }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove previous markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    filteredIncidents.forEach((item) => {
      const isAccident = item.type === 'accident';
      const isPothole = item.type === 'pothole';
      const isWaterlogging = item.type === 'flooding';
      const pinColor = isAccident ? '#ef4444' : isWaterlogging ? '#3b82f6' : isPothole ? '#a855f7' : '#f59e0b';

      const customDiv = L.divIcon({
        className: 'custom-pin',
        html: `
          <div class="relative cursor-pointer group">
            ${item.type === 'accident' ? '<div class="absolute -inset-2 bg-red-500/40 rounded-full animate-ping"></div>' : ''}
            <div style="background-color: ${pinColor}; box-shadow: 0 4px 12px ${pinColor}80;" 
                 class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-black border-2 border-white transform transition-transform group-hover:scale-125">
              ${isAccident ? '⚠️' : isWaterlogging ? '💧' : isPothole ? '🕳️' : '🔧'}
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/40"></div>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 38]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customDiv }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit;" class="p-2 w-56">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-red-400">${item.type.replace('_', ' ')}</span>
            <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">${item.delay} delay</span>
          </div>
          <h4 class="font-bold text-xs text-white leading-tight">${item.title}</h4>
          <p class="text-[11px] text-slate-300 mt-1">${item.location}</p>
          <div class="mt-2 pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px]">
            <span class="text-emerald-400 font-bold">✓ ${item.verificationPct}% Verified</span>
            <span class="text-slate-400">${item.distance}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectIncident(item.id);
      });

      markersRef.current[item.id] = marker;
    });
  }, [filteredIncidents]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[640px]">
      {/* Top Search & Profile Bar */}
      <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search location or enter destination (e.g. Thokkottu, Kottara, Bejai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            aria-label="View alerts notifications"
            className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-cyan-400/30">
              Y
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Yukta</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Left Sidebar + Center Map + Right Incidents Panel */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Sub-Sidebar matching the design */}
        <aside className="hidden md:flex md:col-span-2 bg-slate-950/80 border-r border-slate-800 p-3 flex-col justify-between">
          <div className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'live_map', label: 'Live Map', icon: MapPin },
              { id: 'report', label: 'Report Incident', icon: AlertTriangle, action: onOpenReportModal },
              { id: 'alerts', label: 'Alerts', icon: Bell },
              { id: 'routes', label: 'Route Planner', icon: Route, target: 'routes' },
              { id: 'road_dna', label: 'Road DNA', icon: Dna, target: 'road_dna' },
              { id: 'analytics', label: 'Analytics', icon: BarChart3, target: 'city_pulse' },
              { id: 'history', label: 'History', icon: History },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeSidebarItem === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    setActiveSidebarItem(nav.id);
                    if (nav.action) nav.action();
                    if (nav.target && onNavigateSection) onNavigateSection(nav.target);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="text-white font-semibold block">City Active</span>
            <span className="text-cyan-400 font-mono">Mangaluru, KA</span>
            <p className="text-[10px] text-slate-400 leading-tight">Live telemetry sync active</p>
          </div>
        </aside>

        {/* Center Interactive Map */}
        <div className="md:col-span-6 lg:col-span-6 relative min-h-[420px] bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-0 min-h-[420px]" />

          {/* Map Legend (Normal, Moderate, Heavy, Closed) */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-3.5 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-300">Heavy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span className="text-slate-400">Closed</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Incidents Feed (matching design) */}
        <div className="md:col-span-4 lg:col-span-4 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <h3 className="text-sm font-bold text-white">Live Incidents</h3>
              </div>
              <button 
                onClick={() => setSelectedCategoryFilter('all')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Incidents List matching design */}
            <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
              {filteredIncidents.map((incident) => {
                const isAccident = incident.type === 'accident';
                return (
                  <div
                    key={incident.id}
                    onClick={() => onSelectIncident(incident.id)}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all hover:bg-slate-850 flex items-center gap-3 group"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <img 
                        src={incident.imageUrl} 
                        alt={incident.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.2 rounded ${
                          isAccident ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'
                        }`}>
                          {incident.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-red-400 font-bold font-mono">
                          {incident.delay}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
                        {incident.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 truncate">
                        {incident.distance}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold ${incident.verified ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {incident.verified ? `✓ Verified (${incident.verificationPct}%)` : `Unverified (${incident.verificationPct}%)`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2">
            <button
              onClick={onOpenReportModal}
              className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
              <span>Report New Incident Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
