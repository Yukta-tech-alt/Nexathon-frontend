import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  ArrowRight, 
  Navigation, 
  Lock 
} from 'lucide-react';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useRouteWise();

  const redirectTarget = searchParams.get('redirect') || null;

  const handleSelectRole = (roleKey) => {
    setRole(roleKey);
    const redirectQuery = redirectTarget ? `&redirect=${encodeURIComponent(redirectTarget)}` : '';
    navigate(`/login?role=${roleKey}${redirectQuery}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
          <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Choose Your RouteWise Role
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Select your dedicated portal to access personalized commute tools, enterprise mobility rosters, or city-wide traffic intelligence.
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>Authentication required to enter portals and view interactive maps</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 🚗 Passenger */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 shadow-2xl space-y-6 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🚗
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Commuters & Travelers</span>
              <h2 className="text-2xl font-black text-white mt-1">Passenger</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              For commuters and individual travellers.
            </p>
          </div>

          <button
            onClick={() => handleSelectRole('passenger')}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as Passenger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: 🏢 Employer */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 shadow-2xl space-y-6 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🏢
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Organizations & HR</span>
              <h2 className="text-2xl font-black text-white mt-1">Employer</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              For organizations managing employee travel.
            </p>
          </div>

          <button
            onClick={() => handleSelectRole('employer')}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as Employer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: 🚦 Traffic Authority */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-2xl space-y-6 transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🚦
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Municipal & Transport</span>
              <h2 className="text-2xl font-black text-white mt-1">Traffic Authority</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              For authorized traffic/transport authorities.
            </p>
          </div>

          <button
            onClick={() => handleSelectRole('authority')}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue as Authority</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
