import React from 'react';
import TrafficMap from '../maps/TrafficMap';

/**
 * Re-export TrafficMap as LiveTrafficMap for backwards compatibility.
 * Translates any legacy props (e.g. onSelectIncident -> onIncidentClick).
 */
export default function LiveTrafficMap(props) {
  const { onSelectIncident, onIncidentClick, ...rest } = props;
  return (
    <TrafficMap
      {...rest}
      onIncidentClick={onIncidentClick || onSelectIncident}
    />
  );
}
