import React from 'react';
import { Navigation, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import EvidenceChainBanner from '../../components/common/EvidenceChainBanner';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto py-8 text-slate-100">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
          <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">About RouteWise AI</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          An evidence-driven transportation intelligence platform connecting commuters, organizations, and traffic authorities.
        </p>
      </div>

      <EvidenceChainBanner />

      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 text-xs text-slate-300 leading-relaxed shadow-xl">
        <h2 className="text-lg font-black text-white">The Core Concept: Closing the Mobility Loop</h2>
        <p>
          Conventional navigation applications tell passengers that traffic exists, but they do nothing to prove why delays happened to employers or help municipal authorities investigate chronic engineering bottlenecks.
        </p>
        <p>
          RouteWise AI bridges this gap with a 5-stage lifecycle: <strong>REPORT → VERIFY → ALERT → ANALYSE → IMPROVE</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-cyan-400">For Passengers</h4>
            <p className="text-[11px] text-slate-400">
              Avoid gridlock with multi-criteria route optimization and inspect verifiable incident evidence before traveling.
            </p>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400">For Employers</h4>
            <p className="text-[11px] text-slate-400">
              Receive verified commute delay certificates with sensor proofs to automate non-disciplinary attendance waivers.
            </p>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-400">For Authorities</h4>
            <p className="text-[11px] text-slate-400">
              Analyze chronic congestion hotspots, review reconstructed traffic stories, and plan dynamic signal timing interventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
