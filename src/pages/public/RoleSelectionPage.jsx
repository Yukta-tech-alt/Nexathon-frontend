import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  User, 
  Building2, 
  Activity, 
  ArrowRight, 
  Navigation, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { setRole, showToast } = useRouteWise();

  const handleSelect = (roleKey, destinationPath) => {
    setRole(roleKey);
    showToast(`Welcome to ${roleKey.toUpperCase()} Portal`, 'Dedicated role workspace activated.', 'info');
    navigate(destinationPath);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
          <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Choose your RouteWise experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          RouteWise AI provides distinct portals tailored to the responsibilities of travelers, organizations, and civic authorities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Passenger Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 shadow-2xl space-y-6 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <User className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Travel Smarter</span>
              <h2 className="text-2xl font-black text-white mt-1">Passenger</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find routes, receive alerts and report road problems.
            </p>
          </div>

          <button
            onClick={() => handleSelect('passenger', '/passenger')}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <span>Continue as Passenger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Employer Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 shadow-2xl space-y-6 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Understand Commute Delays</span>
              <h2 className="text-2xl font-black text-white mt-1">Employer</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor consented employee journeys and commute patterns.
            </p>
          </div>

          <button
            onClick={() => handleSelect('employer', '/employer')}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <span>Continue as Employer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Traffic Authority Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-2xl space-y-6 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Understand Traffic Patterns</span>
              <h2 className="text-2xl font-black text-white mt-1">Traffic Authority</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyse incidents, hotspots and recurring congestion.
            </p>
          </div>

          <button
            onClick={() => handleSelect('authority', '/authority')}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            <span>Continue as Authority</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
        *Notice: Role switching is a prototype demonstration feature. In a commercial deployment, access to Employer and Authority consoles is governed by enterprise OAuth2 and police department credentials.
      </div>
    </div>
  );
}
