import React from 'react';
import { 
  Users, 
  Briefcase, 
  Building2, 
  ArrowRight, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Smartphone,
  MapPin
} from 'lucide-react';
import { PERSONAS } from '../data/roadTruthData';

export default function Header({ 
  currentPersona, 
  setCurrentPersona, 
  currentView, 
  setCurrentView,
  onOpenReportModal
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-2xl">
      {/* Topmost Brand & Persona Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3.5">
          {/* Logo Pin */}
          <div 
            onClick={() => setCurrentView('board')}
            className="cursor-pointer relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/30 group transition-transform hover:scale-105"
          >
            {/* Custom SVG Location Pin with Road path inside */}
            <svg className="w-6 h-6 text-slate-950 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v4m-1.5-1.5l3 3" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                onClick={() => setCurrentView('board')}
                className="text-2xl font-black tracking-tight text-white cursor-pointer hover:text-cyan-400 transition-colors"
              >
                Road<span className="text-cyan-400">Truth</span>
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                Smart Mobility & Traffic Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              See the <span className="text-cyan-300 font-semibold">Real Reason</span>. Choose a Smarter Route.
            </p>
          </div>
        </div>

        {/* Methodology Flow Pills */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-cyan-400 font-semibold">Report</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-semibold">Verify</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400 font-semibold">Alert</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-purple-400 font-semibold">Analyse</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-teal-300 font-bold">Safer Roads</span>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {PERSONAS.map((p) => {
            const isActive = currentPersona === p.id;
            const Icon = p.id === 'commuters' ? Users : p.id === 'organizations' ? Briefcase : Building2;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setCurrentPersona(p.id);
                  if (p.id === 'commuters') setCurrentView('board');
                  if (p.id === 'organizations') setCurrentView('authority');
                  if (p.id === 'authorities') setCurrentView('city_pulse');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="text-left leading-none">
                  <div>{p.label}</div>
                  <div className="text-[9px] text-slate-400 font-normal hidden md:block">{p.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Nav View Mode Switcher */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mr-1 hidden sm:inline">Views:</span>
            
            <button
              onClick={() => setCurrentView('board')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'board'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 10 Panels (Full Board)</span>
            </button>

            <button
              onClick={() => setCurrentView('hero')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'hero' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              1. Hero Landing
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              2. Live Map
            </button>

            <button
              onClick={() => setCurrentView('mobile')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                currentView === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              3. Mobile App
            </button>

            <button
              onClick={() => setCurrentView('verification')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'verification' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              4. Trust Verification (92%)
            </button>

            <button
              onClick={() => setCurrentView('routes')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'routes' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              5. Smart Routes
            </button>

            <button
              onClick={() => setCurrentView('road_dna')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'road_dna' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              8. Road DNA
            </button>

            <button
              onClick={() => setCurrentView('city_pulse')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'city_pulse' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              9. City Pulse
            </button>

            <button
              onClick={() => setCurrentView('authority')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                currentView === 'authority' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              10. Employer/Fleet
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs shadow-md shadow-red-600/30 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>+ Report Incident</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
