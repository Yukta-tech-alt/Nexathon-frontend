import React from 'react';
import { Clock, ShieldCheck, TrendingDown, ArrowDown, Sparkles, MapPin } from 'lucide-react';
import { constructTrafficStory } from '../../utils/calculations';

export default function TrafficStoryCard({ incidents = [], selectedLocation = null }) {
  const story = constructTrafficStory(incidents, selectedLocation);

  if (!story.canConstructStory) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
        <Sparkles className="w-5 h-5 text-slate-500 mx-auto" />
        <h4 className="text-sm font-bold text-slate-300">Traffic Story Synthesis</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {story.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Chronological Narrative Reconstruction
          </span>
          <h3 className="text-lg font-black text-white mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Traffic Story: {story.location}</span>
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 rounded-full font-bold">
          Actual Stored Timeline
        </span>
      </div>

      {/* Vertical Narrative Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-amber-500 before:to-emerald-500">
        {story.stages.map((stage, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 transition-transform"></div>
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-bold">{stage.time}</span>
                <span className="text-[10px] text-slate-400 font-mono">+{stage.delay}m delay</span>
              </div>
              <div className="text-xs font-bold text-slate-100">{stage.phase}</div>
              <p className="text-[11px] text-slate-400">{stage.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
