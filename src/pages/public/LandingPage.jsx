import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play,
  Navigation,
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  User, 
  Building2, 
  Activity, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  TrendingUp,
  Compass,
  FileCheck,
  Cpu,
  GitBranch,
  Bell,
  MapPin,
  Map,
  BarChart3,
  Car,
  Shield,
  Leaf,
  Check,
  ChevronRight,
  Zap,
  Layers,
  Network
} from 'lucide-react';
import { getAuthToken, getStoredUser } from '../../services/api';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = getAuthToken();
    const user = getStoredUser();
    if (!token || !user) {
      navigate('/select-role');
    } else {
      const role = (user.role || '').toLowerCase();
      if (role === 'employer') navigate('/employer');
      else if (role === 'traffic_authority' || role === 'traffic_police' || role === 'admin') navigate('/authority');
      else navigate('/passenger');
    }
  };

  const handleRoleSelect = (targetRole) => {
    const token = getAuthToken();
    const user = getStoredUser();
    if (!token || !user) {
      navigate(`/login?role=${targetRole}`);
    } else {
      if (targetRole === 'employer') navigate('/employer');
      else if (targetRole === 'authority') navigate('/authority');
      else navigate('/passenger');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-28 pb-20 selection:bg-cyan-500 selection:text-slate-950 overflow-hidden">
      
      {/* =========================================================================
          SECTION 1 — SPLIT-SCREEN HERO
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14">
        {/* Ambient background glow effects */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* HERO LEFT COLUMN */}
          <div className="lg:col-span-6 space-y-8 z-10 text-left">
            {/* Top Subdued Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-950/40">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Smart Mobility & Traffic Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Know the Road. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Predict the Traffic.
              </span> <br />
              Choose the{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Better Route.
              </span>
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              AI-powered traffic intelligence for smarter routes, safer journeys and better mobility decisions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={handleGetStarted}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white font-bold text-sm rounded-2xl shadow-lg backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Play className="w-2.5 h-2.5 fill-cyan-400 ml-0.5" />
                </div>
                <span>How It Works</span>
              </button>
            </div>

            {/* Compact 4-Item Feature Strip */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Car, label: 'Smarter Routes', desc: 'Compare available route options' },
                { icon: Shield, label: 'Safer Journeys', desc: 'Use verified incident information' },
                { icon: BarChart3, label: 'Data-Driven Decisions', desc: 'Traffic data & AI prediction' },
                { icon: Leaf, label: 'Greener Cities', desc: 'Support better mobility planning' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-200">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HERO RIGHT COLUMN — FUTURISTIC TRAFFIC INTELLIGENCE MAP VISUAL */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
              
              {/* Subtle ambient lighting inside frame */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Top Telemetry Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>AI TRAFFIC CORRIDOR SIMULATION</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Model: XGBoost</span>
                  <span className="text-emerald-400">R²: 0.9645</span>
                </div>
              </div>

              {/* Main Vector Highway Map Canvas */}
              <div className="relative h-[380px] sm:h-[430px] rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
                
                {/* Dark City Grid Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

                {/* City Blocks Silhouette Graphics */}
                <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="30" width="60" height="40" rx="4" fill="#334155" />
                  <rect x="90" y="30" width="80" height="50" rx="4" fill="#1e293b" />
                  <rect x="20" y="90" width="90" height="70" rx="4" fill="#1e293b" />
                  <rect x="360" y="40" width="70" height="60" rx="4" fill="#334155" />
                  <rect x="440" y="30" width="60" height="90" rx="4" fill="#1e293b" />
                  <rect x="340" y="240" width="100" height="70" rx="4" fill="#1e293b" />
                  <rect x="40" y="260" width="80" height="80" rx="4" fill="#334155" />
                </svg>

                {/* Glowing Highway Vector Curves */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Subtle Secondary Grid Lines */}
                  <path d="M 50 200 Q 250 150 450 220" stroke="#1e293b" strokeWidth="4" />
                  <path d="M 120 50 Q 200 200 280 360" stroke="#1e293b" strokeWidth="4" />

                  {/* ROUTE A: Current Route (Red Congested Path) */}
                  <path d="M 80 320 C 120 220, 200 210, 260 200 S 380 180, 430 80" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" className="opacity-90" />
                  <path d="M 80 320 C 120 220, 200 210, 260 200 S 380 180, 430 80" stroke="#fca5a5" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" className="animate-[pulse_2s_infinite]" />

                  {/* ROUTE B: Alternative Route (Green / Cyan Recommended Path) */}
                  <path d="M 80 320 C 100 280, 160 300, 220 270 C 300 230, 310 140, 430 80" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 80 320 C 100 280, 160 300, 220 270 C 300 230, 310 140, 430 80" stroke="#6ee7b7" strokeWidth="2.5" strokeDasharray="8 8" strokeLinecap="round" />

                  {/* Origin Beacon Point */}
                  <circle cx="80" cy="320" r="10" fill="#06b6d4" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="80" cy="320" r="6" fill="#06b6d4" />
                  <circle cx="80" cy="320" r="2.5" fill="#ffffff" />

                  {/* Destination Beacon Point */}
                  <circle cx="430" cy="80" r="12" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="430" cy="80" r="7" fill="#ef4444" />
                  <circle cx="430" cy="80" r="3" fill="#ffffff" />
                </svg>

                {/* FLOATING CARD 1: Road Incident (Top Left) */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-red-500/40 shadow-xl backdrop-blur-md animate-fadeIn">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-white block tracking-tight">Road Incident</span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">Construction Work • Outer Ring</span>
                  </div>
                </div>

                {/* FLOATING CARD 2: High Congestion (Top Right) */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl backdrop-blur-md animate-fadeIn">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-white block tracking-tight">High Congestion</span>
                    <span className="text-[10px] text-amber-300/90 block -mt-0.5">Estimated delay: 15–20 min</span>
                  </div>
                </div>

                {/* FLOATING CARD 3: Alternative Route (Center / Recommended) */}
                <div className="absolute bottom-20 left-6 sm:left-12 z-20 p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md max-w-[210px] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Leaf className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-black text-white">Alternative Route</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-emerald-400 font-bold">12 min • 8.4 km</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black border border-emerald-500/30">
                      Recommended
                    </span>
                  </div>
                </div>

                {/* FLOATING CARD 4: Current Route (Bottom Right / Congested) */}
                <div className="absolute bottom-4 right-4 sm:right-6 z-20 p-3 rounded-2xl bg-slate-900/95 border border-red-500/40 shadow-2xl backdrop-blur-md max-w-[210px] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Car className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-black text-white">Current Route</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-300 font-semibold">28 min • 11.2 km</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[9px] font-black border border-red-500/30">
                      Heavy Traffic
                    </span>
                  </div>
                </div>

                {/* Location Marker Labels */}
                <div className="absolute bottom-6 left-1 z-10 flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Origin</span>
                </div>
                <div className="absolute top-12 right-2 z-10 flex items-center gap-1 text-[10px] font-mono font-bold text-red-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>Destination</span>
                </div>
              </div>

              {/* Bottom Clarifying Caption */}
              <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>AI Route Comparison & Diversion Engine</span>
                </span>
                <span className="text-slate-500 italic text-[10px]">*Illustrative preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — HOW ROUTEWISE AI WORKS (5-STEP WORKFLOW)
          ========================================================================= */}
      <section id="how-it-works" className="relative space-y-10 scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            <span>The Closed-Loop Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            From Incidents to Smarter Routes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A continuous 5-stage mobility protocol connecting crowd reports, speed corroboration, and real-time navigation.
          </p>
        </div>

        {/* 5-Step Connected Flow Grid */}
        <div className="relative">
          {/* Subtle connecting connector line on desktop */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-pink-500 via-cyan-400 via-purple-500 via-amber-400 to-emerald-400 opacity-30 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {[
              {
                step: '01',
                title: 'REPORT',
                desc: 'Users report road incidents.',
                icon: Radio,
                glow: 'from-pink-500 to-rose-500',
                border: 'border-pink-500/30',
                badgeBg: 'bg-pink-500/10 text-pink-400'
              },
              {
                step: '02',
                title: 'VERIFY',
                desc: 'Community and authority verification improves reliability.',
                icon: ShieldCheck,
                glow: 'from-cyan-500 to-teal-400',
                border: 'border-cyan-500/30',
                badgeBg: 'bg-cyan-500/10 text-cyan-400'
              },
              {
                step: '03',
                title: 'PREDICT',
                desc: 'XGBoost predicts congestion levels.',
                icon: Cpu,
                glow: 'from-purple-500 to-indigo-500',
                border: 'border-purple-500/30',
                badgeBg: 'bg-purple-500/10 text-purple-400'
              },
              {
                step: '04',
                title: 'COMPARE',
                desc: 'Multiple available routes are analysed.',
                icon: GitBranch,
                glow: 'from-amber-500 to-orange-500',
                border: 'border-amber-500/30',
                badgeBg: 'bg-amber-500/10 text-amber-400'
              },
              {
                step: '05',
                title: 'RECOMMEND',
                desc: 'The system recommends the better route and provides relevant alerts.',
                icon: Navigation,
                glow: 'from-emerald-500 to-teal-400',
                border: 'border-emerald-500/30',
                badgeBg: 'bg-emerald-500/10 text-emerald-400'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-slate-900/90 border ${item.border} hover:scale-[1.02] transition-all shadow-xl backdrop-blur-md flex flex-col items-center text-center space-y-4 group`}
              >
                {/* Step Circle with Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.glow} p-0.5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400">
                    STEP {item.step}
                  </span>
                  <h3 className="text-base font-black text-white tracking-wide">{item.title}</h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — ROLE-BASED SECTION ("Different Needs. A Smarter Platform.")
          ========================================================================= */}
      <section id="features" className="space-y-10 scroll-mt-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            <span>Built For Every Mobility Stakeholder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Different Needs. <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">A Smarter Platform.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            One platform for passengers, employers and traffic authorities.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: PASSENGER */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-2xl transition-all flex flex-col justify-between group">
            <div className="p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400">
                  Citizen
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">Passenger</h3>
                <p className="text-xs text-slate-400">
                  Plan smarter and safer journeys.
                </p>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                {[
                  'Route planning & alternative routes',
                  'Report and verify incidents',
                  'Traffic alerts',
                  'Manage journeys'
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Action Area */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleRoleSelect('passenger')}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Continue as Passenger</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 2: EMPLOYER */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 shadow-2xl transition-all flex flex-col justify-between group">
            <div className="p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-emerald-400">
                  Organization
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">Employer</h3>
                <p className="text-xs text-slate-400">
                  Manage employee mobility efficiently.
                </p>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                {[
                  'Monitor employee travel',
                  'Track delays and disruptions',
                  'Travel analytics and reports',
                  'Support safer commutes'
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Action Area */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleRoleSelect('employer')}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Continue as Employer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 3: TRAFFIC AUTHORITY */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-2xl transition-all flex flex-col justify-between group">
            <div className="p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400">
                  Municipal
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">Traffic Authority</h3>
                <p className="text-xs text-slate-400">
                  Understand and manage traffic better.
                </p>
              </div>

              {/* Checklist */}
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                {[
                  'Incident monitoring and verification',
                  'Traffic analytics and hotspots',
                  'Recurring problem identification',
                  'Urban mobility insights'
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Action Area */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleRoleSelect('authority')}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Continue as Authority</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — KEY FEATURES GRID (8 FEATURE CARDS)
          ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            <span>Key Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Everything You Need for <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Smarter Mobility</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered with deep telemetry, XGBoost machine learning, and multi-agency verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Incident Reporting',
              desc: 'Report road issues and incidents.',
              icon: AlertTriangle,
              color: 'text-red-400',
              bg: 'bg-red-500/10',
              border: 'border-red-500/20'
            },
            {
              title: 'AI Traffic Prediction',
              desc: 'XGBoost-based congestion prediction.',
              icon: Cpu,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
              border: 'border-purple-500/20'
            },
            {
              title: 'Alternative Routes',
              desc: 'Compare available route options.',
              icon: Compass,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10',
              border: 'border-cyan-500/20'
            },
            {
              title: 'Traffic Alerts',
              desc: 'Receive relevant notifications.',
              icon: Bell,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
              border: 'border-amber-500/20'
            },
            {
              title: 'Traffic Analytics',
              desc: 'Understand patterns and hotspots.',
              icon: BarChart3,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10',
              border: 'border-teal-500/20'
            },
            {
              title: 'Role-Based Access',
              desc: 'Dedicated Passenger, Employer and Authority workflows.',
              icon: Users,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/20'
            },
            {
              title: 'Interactive Maps',
              desc: 'Visualize routes and traffic information.',
              icon: Map,
              color: 'text-sky-400',
              bg: 'bg-sky-500/10',
              border: 'border-sky-500/20'
            },
            {
              title: 'Historical Insights',
              desc: 'Analyse recurring traffic problems.',
              icon: Clock,
              color: 'text-violet-400',
              bg: 'bg-violet-500/10',
              border: 'border-violet-500/20'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-slate-900/80 border ${item.border} hover:border-slate-700 hover:bg-slate-900 transition-all shadow-lg flex flex-col justify-between space-y-4 group`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — AI INTELLIGENCE PIPELINE
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-cyan-400">
            <span>Predictive Machine Learning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Turning Traffic Data Into Smarter Decisions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            RouteWise AI analyses traffic and incident-related information to predict congestion and support smarter route decisions.
          </p>
        </div>

        {/* 6 Connected Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '01', title: 'Traffic Data', icon: Network },
            { step: '02', title: 'Data Preprocessing', icon: Layers },
            { step: '03', title: 'XGBoost Model', icon: Cpu },
            { step: '04', title: 'Congestion Prediction', icon: Zap },
            { step: '05', title: 'Route Analysis', icon: GitBranch },
            { step: '06', title: 'Smart Recommendation', icon: Navigation }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-center space-y-2 transition-all flex flex-col items-center justify-center shadow-md group"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 block">STEP {item.step}</span>
              <h4 className="text-xs font-bold text-white tracking-tight">{item.title}</h4>
            </div>
          ))}
        </div>

        {/* Real Benchmark Verification Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">Trained on Bangalore Traffic Pulse Dataset</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className="text-slate-400">R² Score: <strong className="text-cyan-400">0.9645</strong></span>
            <span className="text-slate-400">Mean Abs Error: <strong className="text-teal-400">2.93</strong></span>
            <span className="text-slate-400">Accuracy: <strong className="text-emerald-400">94.11%</strong></span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — FINAL CTA SECTION
          ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-14 shadow-2xl">
        {/* Subtle background ambient graphic */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Actions */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              <span>A Smarter Tomorrow</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Let's Build Smoother, Safer <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Journeys Together.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Report incidents. Understand congestion. Compare routes. Make smarter mobility decisions with RouteWise AI.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleGetStarted}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>How It Works</span>
              </button>
            </div>
          </div>

          {/* Right Floating Pill Cards */}
          <div className="lg:col-span-4 space-y-3">
            {[
              { icon: Car, label: 'Smarter Mobility', color: 'text-cyan-400' },
              { icon: Shield, label: 'Safer Roads', color: 'text-emerald-400' },
              { icon: Leaf, label: 'Greener Cities', color: 'text-teal-400' },
              { icon: Clock, label: 'Connected Communities', color: 'text-blue-400' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 backdrop-blur-md shadow-lg"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-xs font-bold text-slate-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
