import React from 'react';
import { HelpCircle, ShieldCheck, Server, Cpu, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: 'How does the 6-Level Verification System work?',
      a: 'Incidents begin at Level 1 (User Reported) and advance through Level 2 (GPS confirmed within 50m of road axis), Level 3 (Multiple reports matched), Level 4 (Speed telemetry deceleration < 5 km/h stall), Level 5 (Photo/video attached), and Level 6 (Traffic authority certification).'
    },
    {
      q: 'Does RouteWise AI track employees 24/7?',
      a: 'Absolutely not. Privacy is built into the architecture. Telemetry only broadcasts during active commutes when a journey is explicitly started. Weekend and personal travels are never recorded, and home locations are masked with a 500m private geofence.'
    },
    {
      q: 'What is the Verified Delay Certificate?',
      a: 'When an employee faces verified traffic delays, RouteWise generates an objective certificate detailing the obstruction, location, TrustScore, and attendance waiver recommendation.'
    }
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8 text-slate-100">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-white">Help & Documentation</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Answers to common questions, verification methodology, and production roadmap
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 text-xs">
            <h3 className="font-bold text-white text-sm">{f.q}</h3>
            <p className="text-slate-400 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Server className="w-4 h-4" />
          <span>Production Infrastructure Requirements</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          This frontend prototype provides complete UI workflows, derived statistics, and LocalStorage persistence. A full enterprise release would integrate an Apache Kafka/MQTT telemetry ingest pipeline, an OpenRouteService or OSRM server, state police APIs, and enterprise Single-Sign-On connectors.
        </p>
      </div>
    </div>
  );
}
