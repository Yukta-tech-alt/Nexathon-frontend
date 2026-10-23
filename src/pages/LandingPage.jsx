import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRouteWise } from '../context/RouteWiseContext';
import { 
  Navigation, 
  MapPin, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Users, 
  Building2, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Lock, 
  EyeOff, 
  Compass,
  Zap,
  Award
} from 'lucide-react';
import LiveTrafficMap from '../components/map/LiveTrafficMap';

export default function LandingPage() {
  const navigate = useNavigate();
  const { incidents, routes, setRole } = useRouteWise();

  const [searchDestination, setSearchDestination] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchDestination.trim()) {
      navigate(`/routes?destination=${encodeURIComponent(searchDestination)}`);
    } else {
      navigate('/passenger');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-5xl mx-auto px-4 space-y-8">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Next-Generation Transit Intelligence & Delay Evidence</span>
        </div>

        {/* Compelling Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Beat the Traffic. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Prove the Delay.
            </span> <br />
            Improve Every Journey.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            RouteWise AI goes beyond conventional navigation. We combine real-time crowd hazards, 6-level TrustScore verification, and consent-first commute telemetry to prove delays to employers and optimize urban corridors.
          </p>
        </div>

        {/* Destination Search Section */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <MapPin className="w-5 h-5 text-red-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              placeholder="Where to? (e.g. Hampankatta, Surathkal, Udupi, Airport)..."
              className="w-full pl-12 pr-32 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 shadow-2xl focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Routes</span>
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
            <span>Popular Corridors:</span>
            {['Surathkal NITK', 'Pumpwell Underpass', 'Kottara Chowki', 'Udupi Krishna Circle'].map((c, i) => (
              <button
                key={i}
                onClick={() => navigate(`/routes?destination=${encodeURIComponent(c)}`)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-cyan-300 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/passenger"
            className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Live Traffic Map</span>
          </Link>

          <Link
            to="/routes"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2"
          >
            <span>Plan Commute Route</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        {/* Live Corridor Status Indicator Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NH-66 Coastal Corridor: <strong>Operating (Minor Diversion)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Kottara Chowki Node: <strong>Repair Delays (+18m)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Active Commuters: <strong>342 Tracked</strong></span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MAP PREVIEW SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              Live Telemetry Simulation
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Interactive Corridor Hazard Preview</h2>
          </div>
          <Link
            to="/passenger"
            className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Open Full Screen Passenger Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <LiveTrafficMap 
          incidents={incidents}
          selectedRoute={routes[0]}
          height="450px"
          interactive={true}
        />
      </section>

      {/* 3. REPORT → VERIFY → ALERT → ANALYSE → IMPROVE LIFECYCLE */}
      <section className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            End-To-End Mobility Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Beyond Standard Navigation
          </h2>
          <p className="text-xs text-slate-400">
            A closed-loop traffic accountability lifecycle that connects commuters, employers, and traffic authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'REPORT',
              desc: 'Commuters flag congestion, accidents, waterlogging, or fallen trees with GPS, photo, and voice memos.',
              color: 'text-cyan-400',
              border: 'border-cyan-500/30'
            },
            {
              step: '02',
              title: 'VERIFY',
              desc: 'Our proprietary TrustScore engine corroborates crowd input against sensor deceleration and authority logs.',
              color: 'text-emerald-400',
              border: 'border-emerald-500/30'
            },
            {
              step: '03',
              title: 'ALERT',
              desc: 'Nearby travelers receive proactive re-routing suggestions before reaching the bottleneck bottleneck.',
              color: 'text-amber-400',
              border: 'border-amber-500/30'
            },
            {
              step: '04',
              title: 'ANALYSE',
              desc: 'Employers review verified delay certificates while city engineers study recurring choke points.',
              color: 'text-purple-400',
              border: 'border-purple-500/30'
            },
            {
              step: '05',
              title: 'IMPROVE',
              desc: 'Signals are re-timed, drainage bottlenecks cleared, and future commute disruptions averted.',
              color: 'text-teal-400',
              border: 'border-teal-500/30'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-slate-900/80 border ${item.border} space-y-2 relative overflow-hidden`}
            >
              <div className={`text-2xl font-black font-mono ${item.color} opacity-40`}>
                {item.step}
              </div>
              <h3 className="text-base font-black text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOUR KEY PILLARS FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            Core Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Engineered for Every Stakeholder</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Passenger */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Passenger Navigation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare 3 distinct routes (Fastest, Least Congested, and Fewest Hazards) with live travel time and delay estimates.
              </p>
            </div>
            <Link
              to="/passenger"
              className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1 pt-2"
            >
              <span>Explore Passenger Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: TrustScore */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multimodal TrustScore</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                6-stage progressive verification ensuring no fake reports distort commuter decisions or attendance records.
              </p>
            </div>
            <Link
              to="/passenger"
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 pt-2"
            >
              <span>Inspect TrustScore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Employer */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Employer Commute Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track consented workforce delay status, export CSV audit records, and issue verified non-disciplinary delay waivers.
              </p>
            </div>
            <button
              onClick={() => { setRole('employer'); navigate('/employer'); }}
              className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 pt-2 text-left"
            >
              <span>View Employer Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Authority */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Traffic Authority AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identify recurring choke point hotspots, analyze hourly congestion profiles, and test simulated signal re-timing.
              </p>
            </div>
            <button
              onClick={() => { setRole('authority'); navigate('/intelligence'); }}
              className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1 pt-2 text-left"
            >
              <span>View Authority Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY-FIRST COMMITMENT SECTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Lock className="w-12 h-12" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Consent-by-Design Architecture
            </span>
            <h3 className="text-xl font-bold text-white">Privacy is Our Foundational Commitment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Employers never receive continuous 24/7 location tracking. Telemetry only activates during consented morning and evening commutes. Home doorsteps are masked with a 500m geofence, and local travel records auto-purge every 7 days.
            </p>
          </div>
          <Link
            to="/settings"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors shrink-0 border border-slate-700"
          >
            Review Privacy Controls
          </Link>
        </div>
      </section>
    </div>
  );
}
