import React from 'react';
import { Search, Filter, AlertTriangle, Droplets, Hammer, LightbulbOff, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockHazards';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedSeverity,
  setSelectedSeverity,
  sortBy,
  setSortBy
}) {
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'pothole': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'waterlogging': return <Droplets className="w-3.5 h-3.5" />;
      case 'construction': return <Hammer className="w-3.5 h-3.5" />;
      case 'traffic_signal': return <LightbulbOff className="w-3.5 h-3.5" />;
      case 'debris': return <Trash2 className="w-3.5 h-3.5" />;
      case 'accident_prone': return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Top Search & Sorters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by road, landmark, ward, or hazard description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & Quick Severity Filter */}
        <div className="flex items-center gap-2">
          {/* Severity selector */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            aria-label="Filter by Severity"
            className="bg-slate-950 border border-slate-700/80 text-xs font-medium text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">Severity: All</option>
            <option value="critical">🔴 Critical Only</option>
            <option value="moderate">🟡 Moderate Risk</option>
            <option value="low">🔵 Low Risk</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort Reports"
            className="bg-slate-950 border border-slate-700/80 text-xs font-medium text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="most_upvoted">🔥 Most Upvoted (Community Truth)</option>
            <option value="newest">⏱️ Newest Reports</option>
            <option value="critical_first">⚠️ Most Critical First</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
        <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Status:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Status' },
            { id: 'open', label: 'Active Hazards', count: null },
            { id: 'investigating', label: 'Under Review' },
            { id: 'resolved', label: '✅ Verified Fixed' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedStatus === st.id
                  ? 'bg-slate-200 text-slate-950'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
