import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ShieldCheck, Heart, ExternalLink, Terminal, Cpu, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      {/* Upper Footer: Pillars & Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <Navigation className="w-4 h-4 fill-slate-950 rotate-45" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                RouteWise <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation traffic intelligence, multimodal TrustScore verification, and consent-driven employee commute management.
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Simulated Architecture Notice</span>
              </div>
              <p>
                This frontend runs entirely in-browser with realistic telemetry data for Mangaluru & Karnataka NH-66 coastal corridors.
              </p>
            </div>
          </div>

          {/* Nav: Commuters */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">For Commuters</h4>
            <ul className="space-y-2">
              <li><Link to="/passenger" className="hover:text-cyan-400 transition-colors">Live Incident Map</Link></li>
              <li><Link to="/routes" className="hover:text-cyan-400 transition-colors">3-Route Comparison</Link></li>
              <li><Link to="/report" className="hover:text-cyan-400 transition-colors">Report Road Hazard</Link></li>
              <li><Link to="/journeys" className="hover:text-cyan-400 transition-colors">My Journeys & Delay Proof</Link></li>
              <li><Link to="/settings" className="hover:text-cyan-400 transition-colors">Privacy & Tracking Controls</Link></li>
            </ul>
          </div>

          {/* Nav: Organizations */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">For Organizations</h4>
            <ul className="space-y-2">
              <li><Link to="/employer" className="hover:text-cyan-400 transition-colors">Employer Commute Portal</Link></li>
              <li><Link to="/employees" className="hover:text-cyan-400 transition-colors">Employee Transit Roster</Link></li>
              <li><Link to="/reports" className="hover:text-cyan-400 transition-colors">Monthly CSV Reports</Link></li>
              <li><Link to="/settings" className="hover:text-cyan-400 transition-colors">Consent Policies</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">HR Delay Certification</Link></li>
            </ul>
          </div>

          {/* Nav: Authorities & Technology */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Traffic Authority</h4>
            <ul className="space-y-2">
              <li><Link to="/intelligence" className="hover:text-cyan-400 transition-colors">AI Bottleneck Analytics</Link></li>
              <li><Link to="/passenger" className="hover:text-cyan-400 transition-colors">Hotspot Incident Console</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">TrustScore Architecture</Link></li>
              <li><Link to="/auth" className="hover:text-cyan-400 transition-colors">Authority Access Portal</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">API & Integration Specs</Link></li>
            </ul>
          </div>
        </div>

        {/* Technical Architecture Pill Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Frontend: React 19, Tailwind CSS, Leaflet OSM</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Storage: HTML5 LocalStorage & Memory State</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80">
            <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Telemetry: Simulated Karnataka NH-66 Stream</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-4 bg-slate-950/80 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong>RouteWise AI</strong>. Designed for Smarter Transit & Verified Commutes.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/help" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/help" className="hover:text-slate-300">Verification Whitepaper</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
