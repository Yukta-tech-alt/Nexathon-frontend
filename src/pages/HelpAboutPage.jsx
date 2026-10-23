import React from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Navigation, 
  Cpu, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Map, 
  FileText 
} from 'lucide-react';

export default function HelpAboutPage() {
  return (
    <div className="space-y-8 text-slate-100 max-w-4xl mx-auto py-4">
      {/* Hero About Banner */}
      <div className="p-8 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
            <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">About RouteWise AI</h1>
            <p className="text-xs text-cyan-300 font-medium">
              Traffic Intelligence, Multimodal Incident Verification & Commute Delay Evidence
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>RouteWise AI</strong> is built on a transformative principle: ordinary navigation tells commuters where traffic is, but fails to prove why delays happened to employers and city authorities. By uniting citizens, telemetry sensors, and traffic dispatchers, RouteWise introduces a 5-step lifecycle:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-center text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold block">STAGE 1</span>
            <span className="font-bold text-white mt-1 block">REPORT</span>
            <span className="text-[10px] text-slate-400">Citizen crowdsource</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold block">STAGE 2</span>
            <span className="font-bold text-white mt-1 block">VERIFY</span>
            <span className="text-[10px] text-slate-400">6-Level TrustScore</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold block">STAGE 3</span>
            <span className="font-bold text-white mt-1 block">ALERT</span>
            <span className="text-[10px] text-slate-400">Proactive reroute</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold block">STAGE 4</span>
            <span className="font-bold text-white mt-1 block">ANALYSE</span>
            <span className="text-[10px] text-slate-400">AI bottlenecks</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-cyan-400 font-bold block">STAGE 5</span>
            <span className="font-bold text-white mt-1 block">IMPROVE</span>
            <span className="text-[10px] text-slate-400">Signal timing</span>
          </div>
        </div>
      </div>

      {/* Production Dependencies & Architectural Disclosures */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Cpu className="w-5 h-5" />
          <span>Technical Architecture & Production Roadmap</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This frontend application has been engineered as a zero-backend, fully interactive demonstration. For full production deployment, the following enterprise infrastructure would be connected:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Implemented In This Prototype</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>• Complete 12-page responsive UI with Leaflet & OpenStreetMap tiles</li>
              <li>• Full 6-Stage TrustScore verification pipeline with mathematical breakdown</li>
              <li>• Employer commute tracking table with verifiable Delay Certificates</li>
              <li>• Real CSV export & print-optimized executive audit views</li>
              <li>• Browser Geolocation API integration with simulated fallback</li>
              <li>• Audio MediaRecorder & image upload forensics</li>
              <li>• LocalStorage persistence for demo journeys, employees & reports</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>Required For Production Enterprise Release</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>• <strong>Real-time Telemetry:</strong> Apache Kafka/MQTT ingestion pipeline for live vehicle speeds</li>
              <li>• <strong>Routing Engine:</strong> Production OSRM or OpenRouteService server for dynamic routing</li>
              <li>• <strong>Government Feeds:</strong> NHAI Incident Management System (TIMS) & State Traffic Police API</li>
              <li>• <strong>Authentication:</strong> OAuth2 / OIDC Single-Sign-On with enterprise HRMS connectors (Workday, BambooHR)</li>
              <li>• <strong>Cloud Database:</strong> PostgreSQL with PostGIS extension for spatial queries</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200">How does the TrustScore calculation work?</div>
            <p className="text-slate-400 leading-relaxed">
              Every reported incident begins with baseline user credibility. It automatically accumulates points when (1) GPS proves the user was within 50m of the road axis (+20), (2) 3 or more independent users corroborate (+25), (3) connected speed telemetry verifies vehicle deceleration under 5 km/h (+20), (4) photographic or dashcam evidence is attached (+15), and (5) traffic authority control rooms certify the incident (+20).
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200">Can an employer track an employee on weekends or outside work?</div>
            <p className="text-slate-400 leading-relaxed">
              No. RouteWise AI is engineered with strict consent-by-design principles. Telemetry is only broadcast during an active commute after the user explicitly starts a journey. Residential addresses are masked within a 500-meter private radius, and historical breadcrumbs purge automatically every 7 days.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200">What is the Verified Delay Certificate?</div>
            <p className="text-slate-400 leading-relaxed">
              When an employee experiences verified transit congestion, RouteWise generates an objective forensic certificate with timestamped hazard evidence and sensor verification. Employers can download or print this proof to waive attendance penalties automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
