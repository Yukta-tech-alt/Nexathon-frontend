import React from 'react';

export default function PassengerHelp() {
  const faqs = [
    {
      q: 'How do I report an incident?',
      a: 'Go to "Report Incident", select what happened, verify your location, optionally attach a photo, and tap "Submit Report".'
    },
    {
      q: 'What does "Why is this road affected?" show?',
      a: 'Tapping any incident on the map shows root causes, verification signals, delay impact, and recommended alternate routes.'
    },
    {
      q: 'Is my location tracked continuously?',
      a: 'No. Commute tracking only activates when you start a journey. Your doorstep is masked with a 500m geofence and data auto-purges.'
    }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Help</h1>
        <p className="text-xs text-slate-400 mt-0.5">Frequently asked questions and user guide</p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5 text-xs shadow-sm">
            <h3 className="font-bold text-white text-sm">{f.q}</h3>
            <p className="text-slate-400 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
