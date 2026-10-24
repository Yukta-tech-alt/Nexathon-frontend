import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import TrafficAlertsList from '../../components/passenger/TrafficAlertsList';
import WhyIsRoadBlockedModal from '../../components/common/WhyIsRoadBlockedModal';

export default function PassengerAlerts() {
  const [inspectedIncident, setInspectedIncident] = useState(null);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Traffic Alerts</h1>
        <p className="text-xs text-slate-400 mt-0.5">Active verified road warnings and delays</p>
      </div>

      <TrafficAlertsList onSelectIncident={(inc) => setInspectedIncident(inc)} />

      {inspectedIncident && (
        <WhyIsRoadBlockedModal
          incident={inspectedIncident}
          onClose={() => setInspectedIncident(null)}
        />
      )}
    </div>
  );
}
