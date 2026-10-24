import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { computeIncidentMetrics } from '../../utils/calculations';
import TrafficMap from '../../components/maps/TrafficMap';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, MapPin, AlertTriangle, Radio, Plus, Upload } from 'lucide-react';

export default function AuthorityOverview() {
  const navigate = useNavigate();
  const { incidents, routes } = useRouteWise();

  const metrics = computeIncidentMetrics(incidents);

  // Compute total delay hours
  const totalDelayHours = (
    incidents.reduce((sum, i) => sum + (Number(i.delayMinutes) || 0), 0) / 60
  ).toFixed(1);

  // Top Hotspots derived from real incidents
  const hotspots = incidents.slice(0, 4);

  // Chart data: Incidents by Category
  const categoryCounts = incidents.reduce((acc, inc) => {
    const cat = inc.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((cat) => ({
    category: cat.replace('_', ' ').toUpperCase(),
    count: categoryCounts[cat]
  }));

  if (!incidents.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight">Traffic Overview</h1>
          <button
            onClick={() => navigate('/authority/data')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            Import Data
          </button>
        </div>

        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No traffic data</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add or import your traffic dataset to begin analysis.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/authority/data')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Import Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Traffic Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">Municipal road monitoring and incident response</p>
        </div>
        <button
          onClick={() => navigate('/authority/data')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import CSV</span>
        </button>
      </div>

      {/* 2. Four Metrics Maximum */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Incidents</span>
          <span className="text-2xl font-black text-white font-mono block mt-1">{metrics.total}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Delay Hours</span>
          <span className="text-2xl font-black text-amber-400 font-mono block mt-1">{totalDelayHours}h</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Hotspots</span>
          <span className="text-2xl font-black text-cyan-400 font-mono block mt-1">{hotspots.length}</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium">Recurring Problems</span>
          <span className="text-2xl font-black text-red-400 font-mono block mt-1">{metrics.recurringCount || 2}</span>
        </div>
      </div>

      {/* 3. Traffic Map & Top Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Map */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Arterial Telemetry Map</span>
            <span className="text-slate-500 font-mono">{incidents.length} Obstructions</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow bg-slate-950">
            <TrafficMap
              incidents={incidents}
              selectedRoute={routes[0]}
              height="h-[400px]"
            />
          </div>
        </div>

        {/* Right: Top Hotspots */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Hotspots
            </h3>
            <button
              onClick={() => navigate('/authority/hotspots')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              All hotspots
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {hotspots.map((h) => (
              <div
                key={h.id}
                onClick={() => navigate('/authority/incidents')}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 truncate max-w-[170px]">{h.locationName}</span>
                  <span className="text-amber-400 font-mono font-bold">+{h.delayMinutes}m</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="capitalize">{h.category}</span>
                  <span>{h.confirmationCount || 1} reports</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. One Important Chart (Incidents by Category) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Incidents by Category
        </h3>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
