import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Navigation, 
  MapPin, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  Building2, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  TrendingUp,
  Compass,
  FileCheck
} from 'lucide-react';
import EvidenceChainBanner from '../../components/common/EvidenceChainBanner';

export default function LandingPage() {
  const navigate = useNavigate();
  const [destinationInput, setDestinationInput] = useState('');

  const handleDestinationSearch = (e) => {
    e.preventDefault();
    if (destinationInput.trim()) {
      navigate(`/passenger/route?destination=${encodeURIComponent(destinationInput)}`);
    } else {
      navigate('/passenger');
    }
  };

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-14 text-center max-w-4xl mx-auto space-y-7">
        {/* Subdued Mobility Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Transit Intelligence & Commute Evidence</span>
        </div>

        {/* Compelling Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Beat the Traffic. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Prove the Delay.
          </span> <br />
          Improve Every Journey.
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          RouteWise AI connects road incident reporting, verification, route intelligence and commute analytics to help passengers, organizations and traffic authorities make better mobility decisions.
        </p>

        {/* Destination Search Box */}
        <div className="max-w-xl mx-auto pt-2">
          <form onSubmit={handleDestinationSearch} className="relative flex items-center">
            <MapPin className="w-5 h-5 text-red-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="Where are you going today? (e.g. Hampankatta, Surathkal, Udupi)..."
              className="w-full pl-12 pr-32 py-4 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 shadow-2xl focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-5">
            <Link
              to="/passenger/route"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 fill-slate-950 rotate-45" />
              <span>Plan a Route</span>
            </Link>

            <Link
              to="/authority"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Explore Traffic Intelligence</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DISTINCTIVE HERO VISUAL: MODERN MOBILITY COMMAND INTERFACE */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl p-6 sm:p-10">
          {/* Subtle Background Map Grid / Nodes Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

          {/* Connected Flow Architecture Visual */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Route Corridor Map Simulation */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>LIVE CORRIDOR TELEMETRY: NH-66 AXIS</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Consensus Nodes Active</span>
              </div>

              {/* Graphic Flow Line Visualization */}
              <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800/80 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></span>
                    <span className="font-bold text-slate-200">Surathkal Node</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">48 km/h Normal</span>
                </div>

                {/* Animated Connecting Corridor Line */}
                <div className="relative w-full h-1.5 bg-slate-800 rounded-full my-auto overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500 via-amber-400 to-red-500 w-3/4 rounded-full"></div>
                  <div className="absolute top-0 bottom-0 w-8 bg-white/60 blur-[2px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                </div>

                {/* Choke Point Tag */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-bold text-red-300">Thokkottu Bottleneck (+28m)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-slate-200">Hampankatta Hub</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Multimodal sensor consensus: 14 speed telemetry drop points</span>
                <span className="text-cyan-400 font-bold">TrustScore: Level 5 Verified</span>
              </div>
            </div>

            {/* Right Story Synthesis */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">
                Evidence-Driven Commute Telemetry
              </span>
              <h3 className="text-2xl font-black text-white leading-snug">
                Turning Traffic Delays into Verifiable Civic Facts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ordinary apps only show colors on a map. RouteWise AI creates an unbroken evidence chain from the instant a citizen reports an obstruction, through GPS speed corroboration, to automated HR delay proof and municipal engineering reviews.
              </p>
              <div className="pt-2">
                <Link
                  to="/select-role"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Select Your RouteWise Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE EVIDENCE CHAIN BANNER */}
      <section className="max-w-6xl mx-auto px-4">
        <EvidenceChainBanner />
      </section>

      {/* 4. HOW IT WORKS: HORIZONTAL 5-STAGE PROCESS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            The Closed-Loop Framework
          </span>
          <h2 className="text-3xl font-black text-white">How RouteWise AI Works</h2>
          <p className="text-xs text-slate-400">
            A cohesive 5-stage mobility protocol connecting passengers, employers, and traffic authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {[
            {
              num: '01',
              title: 'REPORT',
              sub: 'A passenger reports a road problem with GPS, photos, or voice memo.',
              color: 'text-cyan-400',
              badge: 'Citizen Crowdsource'
            },
            {
              num: '02',
              title: 'VERIFY',
              sub: 'Evidence, speed telemetry, and multiple signals strengthen the incident.',
              color: 'text-emerald-400',
              badge: 'TrustScore Pipeline'
            },
            {
              num: '03',
              title: 'ALERT',
              sub: 'Affected travelers receive proactive re-routing suggestions before departure.',
              color: 'text-amber-400',
              badge: 'Smart Diversion'
            },
            {
              num: '04',
              title: 'ANALYSE',
              sub: 'Historical records reveal recurring choke points and workforce delay patterns.',
              color: 'text-purple-400',
              badge: 'Analytics Engine'
            },
            {
              num: '05',
              title: 'IMPROVE',
              sub: 'Authorities investigate persistent road problems, re-timing signals and fixing drainage.',
              color: 'text-teal-400',
              badge: 'Civic Optimization'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-black font-mono ${item.color}`}>{item.num}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-black text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ROLE SELECTION CALLOUT */}
      <section id="features" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            Dedicated Role Portals
          </span>
          <h2 className="text-3xl font-black text-white">Choose Your RouteWise Portal</h2>
          <p className="text-xs text-slate-400">
            Three independent application experiences engineered for distinct mobility responsibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Card 1: Passenger */}
          <div className="p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 shadow-xl space-y-5 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Navigation className="w-6 h-6 fill-cyan-400 rotate-45" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">For Commuters</span>
              <h3 className="text-xl font-black text-white">Passenger Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Find optimal routes, receive real-time obstruction warnings, inspect 6-level TrustScores, and track live commutes.
              </p>
            </div>
            <Link
              to="/passenger"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Continue as Passenger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Role Card 2: Employer */}
          <div className="p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-xl space-y-5 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">For Organizations</span>
              <h3 className="text-xl font-black text-white">Employer Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand consented employee commute delays, download verifiable delay certificates, and eliminate attendance disputes.
              </p>
            </div>
            <Link
              to="/employer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Continue as Employer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Role Card 3: Traffic Authority */}
          <div className="p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 shadow-xl space-y-5 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">For Traffic Officials</span>
              <h3 className="text-xl font-black text-white">Traffic Authority Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyse telemetry clusters, investigate recurring bottlenecks, view chronological traffic stories, and plan signal timing.
              </p>
            </div>
            <Link
              to="/authority"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Continue as Authority</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
