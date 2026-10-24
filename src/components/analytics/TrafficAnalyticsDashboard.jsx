import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, Layers, MapPin } from 'lucide-react';

export default function TrafficAnalyticsDashboard() {
  const { incidents } = useRouteWise();

  const [activeTab, setActiveTab] = useState('trends'); // 'trends' | 'categories' | 'hotspots'
  const [selectedCorridor, setSelectedCorridor] = useState('all');

  // Filtered incidents
  const filteredIncidents = incidents.filter(i => {
    if (selectedCorridor === 'all') return true;
    return (i.locationName || '').toLowerCase().includes(selectedCorridor.toLowerCase());
  });

  // 1. Trends Data: Hourly Congestion
  const hourlyData = [
    { hour: '06:00', incidents: 1, delayMin: 5 },
    { hour: '08:00', incidents: 4, delayMin: 22 },
    { hour: '09:00', incidents: 7, delayMin: 35 },
    { hour: '11:00', incidents: 3, delayMin: 12 },
    { hour: '14:00', incidents: 2, delayMin: 8 },
    { hour: '17:00', incidents: 6, delayMin: 28 },
    { hour: '19:00', incidents: 5, delayMin: 25 },
    { hour: '21:00', incidents: 1, delayMin: 4 }
  ];

  // 2. Categories Data: Count by category
  const categoryCounts = filteredIncidents.reduce((acc, inc) => {
    const cat = (inc.category || 'other').replace('_', ' ').toUpperCase();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  // 3. Hotspots Data: Top affected locations
  const hotspotData = filteredIncidents.map(inc => ({
    location: inc.locationName || 'Mangaluru Corridor',
    delay: inc.delayMinutes || 15,
    reports: inc.confirmationCount || 1,
    category: inc.category || 'Obstruction'
  })).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Corridor trends, category distribution, and chokepoints</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-semibold">Corridor:</label>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Corridors</option>
            <option value="NH-66">NH-66 Coastal Highway</option>
            <option value="Kottara">Kottara Chowki</option>
            <option value="Pumpwell">Pumpwell Circle</option>
          </select>
        </div>
      </div>

      {/* 2. Tabs: Trends | Categories | Hotspots */}
      <div className="flex border-b border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-2.5 transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === 'trends'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-2.5 transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('hotspots')}
          className={`pb-2.5 transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === 'hotspots'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Hotspots</span>
        </button>
      </div>

      {/* 3. Tab Content (One chart view at a time) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        
        {/* TAB 1: TRENDS */}
        {activeTab === 'trends' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Congestion by Time of Day
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Peak: 09:00 AM & 17:00 PM</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="delayMin" name="Delay (min)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#delayGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Incidents by Category
            </h3>

            {categoryData.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">No incident categories available.</div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Bar dataKey="count" name="Incidents" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HOTSPOTS */}
        {activeTab === 'hotspots' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Top Bottlenecks & Delay Impact
            </h3>

            {hotspotData.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">No hotspot data available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Average Delay</th>
                      <th className="py-2.5 px-3 text-right">Confirmations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {hotspotData.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-semibold text-white">{h.location}</td>
                        <td className="py-3 px-3 capitalize text-slate-400">{h.category}</td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">+{h.delay} min</td>
                        <td className="py-3 px-3 font-mono text-right text-slate-400">{h.reports} reports</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
