import React, { useState } from 'react';
import TrafficAnalyticsDashboard from '../components/analytics/TrafficAnalyticsDashboard';
import AuthorityHotspotInspector from '../components/authority/AuthorityHotspotInspector';
import { Activity, Sparkles, MapPin, BarChart3 } from 'lucide-react';

export default function TrafficIntelligencePage() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'hotspots'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">AI Traffic Intelligence & Authority Operations</h1>
              <p className="text-xs text-slate-400">
                Long-term bottleneck analytics, hotspot audits & municipal decision-support modeling
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Corridor Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('hotspots')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'hotspots' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Hotspot Audit Dossiers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs View */}
      {activeTab === 'analytics' ? (
        <TrafficAnalyticsDashboard />
      ) : (
        <AuthorityHotspotInspector />
      )}
    </div>
  );
}
