import React from 'react';
import AuthorityHotspotInspector from '../../components/authority/AuthorityHotspotInspector';

export default function AuthorityHotspots() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Hotspots</h1>
        <p className="text-xs text-slate-400 mt-0.5">Chronic bottleneck corridors and delay impact</p>
      </div>

      <AuthorityHotspotInspector />
    </div>
  );
}
