// RoadTruth Data Layer - Matching the reference architecture (Mangaluru City & Highway Corridors)

export const PERSONAS = [
  { id: 'commuters', label: 'For Commuters', subtitle: 'Live alerts & smarter routes', icon: 'Users' },
  { id: 'organizations', label: 'For Organizations', subtitle: 'Employee travel insights', icon: 'Briefcase' },
  { id: 'authorities', label: 'For Authorities', subtitle: 'City-wide analytics', icon: 'Building2' }
];

export const INCIDENT_TYPES = [
  { id: 'accident', label: 'Accident', icon: 'AlertTriangle', color: '#ef4444', bgColor: 'bg-red-500/10 text-red-400 border-red-500/30' },
  { id: 'road_repair', label: 'Road Repair', icon: 'Hammer', color: '#f59e0b', bgColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'flooding', label: 'Flooding', icon: 'Droplets', color: '#3b82f6', bgColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'pothole', label: 'Pothole', icon: 'AlertOctagon', color: '#a855f7', bgColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { id: 'signal_failure', label: 'Signal Failure', icon: 'LightbulbOff', color: '#ec4899', bgColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  { id: 'road_closure', label: 'Road Closure', icon: 'ShieldAlert', color: '#64748b', bgColor: 'bg-slate-700/30 text-slate-300 border-slate-600' },
  { id: 'heavy_rain', label: 'Heavy Rain', icon: 'CloudRain', color: '#06b6d4', bgColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { id: 'other', label: 'Other', icon: 'HelpCircle', color: '#94a3b8', bgColor: 'bg-slate-800 text-slate-400 border-slate-700' }
];

export const MOCK_INCIDENTS = [
  {
    id: 'inc-01',
    title: 'Accident - Thokkottu Junction',
    location: 'NH-66, Mangaluru',
    lat: 12.8335,
    lng: 74.8584,
    distance: '2.3 km away',
    delay: '25 min',
    type: 'accident',
    verified: true,
    verificationPct: 92,
    reportedAgo: '32 mins ago',
    updatedAgo: '2 mins ago',
    estimatedClearance: '25 minutes',
    cause: 'Multi-vehicle road collision during lane merge',
    affectedStretch: '1.8 km',
    reportedBy: 'Community (18) + GPS Sensors + Traffic Police',
    trustScore: 92,
    confidenceLevel: 'High Confidence',
    checkpoints: [
      { label: 'GPS location confirmed', verified: true },
      { label: 'Multiple user reports (18)', verified: true },
      { label: 'Photo/Video evidence (4)', verified: true },
      { label: 'Traffic speed data (avg. 2 km/h)', verified: true },
      { label: 'Authority confirmation (1)', verified: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543393470-bce01e0a233b?auto=format&fit=crop&w=800&q=80',
    description: 'Two cars collided at the Thokkottu Flyover diversion. Southbound NH-66 traffic is completely stalled with bottleneck extending past Ullal bridge.'
  },
  {
    id: 'inc-02',
    title: 'Road Repair - Kottara Chowki',
    location: 'Flyover Underpass, Mangaluru',
    lat: 12.9056,
    lng: 74.8384,
    distance: '4.1 km away',
    delay: '15 min',
    type: 'road_repair',
    verified: true,
    verificationPct: 78,
    reportedAgo: '1 hr ago',
    updatedAgo: '15 mins ago',
    estimatedClearance: '3 hours',
    cause: 'Highway resurfacing & storm drain leveling',
    affectedStretch: '800 meters',
    reportedBy: 'NHAI Road Crew + 9 Commuters',
    trustScore: 78,
    confidenceLevel: 'Moderate-High Confidence',
    checkpoints: [
      { label: 'GPS location confirmed', verified: true },
      { label: 'Multiple user reports (9)', verified: true },
      { label: 'Photo/Video evidence (2)', verified: true },
      { label: 'Traffic speed data (avg. 12 km/h)', verified: true },
      { label: 'Authority confirmation (NHAI)', verified: true }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584463699049-7c427dfa81e9?auto=format&fit=crop&w=800&q=80',
    description: 'One lane barricaded for bituminous asphalt hot-mix laying. Commuters advised to divert via Kuntikan.'
  },
  {
    id: 'inc-03',
    title: 'Waterlogging - Bejai',
    location: 'KSRTC Bus Stand Link Road',
    lat: 12.8833,
    lng: 74.8480,
    distance: '3.8 km away',
    delay: '40 min',
    type: 'flooding',
    verified: false,
    verificationPct: 42,
    reportedAgo: '20 mins ago',
    updatedAgo: '5 mins ago',
    estimatedClearance: 'Unknown (Rain dependent)',
    cause: 'Blocked culvert runoff after cloudburst',
    affectedStretch: '1.2 km',
    reportedBy: 'Auto-Rickshaw Drivers Union (3)',
    trustScore: 42,
    confidenceLevel: 'Needs Community Verification',
    checkpoints: [
      { label: 'GPS location confirmed', verified: true },
      { label: 'Multiple user reports (3)', verified: true },
      { label: 'Photo/Video evidence (Pending)', verified: false },
      { label: 'Traffic speed data (avg. 5 km/h)', verified: true },
      { label: 'Authority confirmation (Pending)', verified: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    description: 'Flash water accumulation of 1.5 feet near Bejai Church curve. Small hatchbacks and two-wheelers stalling.'
  },
  {
    id: 'inc-04',
    title: 'Severe Rim-Cracking Pothole - Hampankatta',
    location: 'Near Old Bus Stand Road',
    lat: 12.8680,
    lng: 74.8420,
    distance: '1.2 km away',
    delay: '10 min',
    type: 'pothole',
    verified: true,
    verificationPct: 81,
    reportedAgo: '2 hrs ago',
    updatedAgo: '10 mins ago',
    estimatedClearance: 'Municipal Action Requested',
    cause: 'Broken underground water pipeline erosion',
    affectedStretch: '200 meters',
    reportedBy: '14 Motorcyclists + Ward Councilor Office',
    trustScore: 81,
    confidenceLevel: 'High Confidence',
    checkpoints: [
      { label: 'GPS location confirmed', verified: true },
      { label: 'Multiple user reports (14)', verified: true },
      { label: 'Photo/Video evidence (6)', verified: true },
      { label: 'Traffic speed data (avg. 15 km/h)', verified: true },
      { label: 'Authority confirmation (Pending)', verified: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Deep 9-inch sunken asphalt patch right at center lane. Extreme risk for night motorists.'
  },
  {
    id: 'inc-05',
    title: 'Traffic Signal Failure - Lalbagh',
    location: 'MG Road & Ballalbagh Crossing',
    lat: 12.8790,
    lng: 74.8395,
    distance: '5.6 km away',
    delay: '20 min',
    type: 'signal_failure',
    verified: false,
    verificationPct: 38,
    reportedAgo: '45 mins ago',
    updatedAgo: '8 mins ago',
    estimatedClearance: 'Traffic Warden Dispatched',
    cause: 'Main controller power fluctuation',
    affectedStretch: 'Intersection',
    reportedBy: 'City Commuter App Users (5)',
    trustScore: 38,
    confidenceLevel: 'Low Confidence / Verifying',
    checkpoints: [
      { label: 'GPS location confirmed', verified: true },
      { label: 'Multiple user reports (5)', verified: true },
      { label: 'Photo/Video evidence (1)', verified: false },
      { label: 'Traffic speed data (Slow flow)', verified: true },
      { label: 'Authority confirmation (Pending)', verified: false }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    description: '4-way signals blinking amber. Deadlock during peak school bus timings.'
  }
];

export const ROUTE_OPTIONS = [
  {
    id: 'current',
    name: 'Current Route',
    duration: '42 min',
    delay: '+18 min delay',
    warning: 'Accident ahead at Thokkottu Junction',
    distance: '14.2 km',
    type: 'danger',
    color: '#ef4444',
    badge: 'Heavy Congestion'
  },
  {
    id: 'smart',
    name: 'Smart Route',
    duration: '24 min',
    saved: '18 min saved',
    benefit: 'Avoids verified congestion via Derlakatte bypass',
    distance: '15.6 km',
    type: 'success',
    color: '#10b981',
    badge: 'Recommended • Fast'
  },
  {
    id: 'low_risk',
    name: 'Low-Risk Route',
    duration: '28 min',
    saved: '14 min saved',
    benefit: 'Slightly longer, zero waterlogging & lower incident probability',
    distance: '16.4 km',
    type: 'safe',
    color: '#f59e0b',
    badge: 'Smooth Surface'
  }
];

export const EMPLOYEE_TRACKING_DATA = [
  { id: 'emp-1', name: 'Employee 1 (Rohit V.)', route: 'Mangaluru — Udupi', status: 'Traffic', delay: '35 min', verification: 'Verified', badge: 'bg-red-500/10 text-red-400 border-red-500/30' },
  { id: 'emp-2', name: 'Employee 2 (Priya N.)', route: 'Ullal — Mangaluru', status: 'Normal', delay: '0 min', verification: 'GPS Live', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'emp-3', name: 'Employee 3 (Karthik S.)', route: 'Bantwal — Mangaluru', status: 'Road Block', delay: '60 min', verification: 'Verified', badge: 'bg-red-500/10 text-red-400 border-red-500/30' },
  { id: 'emp-4', name: 'Employee 4 (Ananya R.)', route: 'Puttur — Mangaluru', status: 'Normal', delay: '0 min', verification: 'GPS Live', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'emp-5', name: 'Employee 5 (Naveen K.)', route: 'Surathkal — Mangaluru', status: 'Moderate', delay: '12 min', verification: 'Verified', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
];

export const ROAD_DNA_DATA = {
  location: 'Thokkottu Junction, Mangaluru',
  riskScore: 82,
  riskLabel: 'High Risk Corridor',
  last30Days: {
    congestion: 19,
    accidents: 7,
    rainRelated: 5,
    construction: 4
  },
  peakHours: '8:15 AM — 10:15 AM',
  hourlyDistribution: [
    { hour: '12 AM', weekday: 10, weekend: 14 },
    { hour: '4 AM', weekday: 12, weekend: 18 },
    { hour: '8 AM', weekday: 88, weekend: 45 },
    { hour: '12 PM', weekday: 62, weekend: 68 },
    { hour: '4 PM', weekday: 74, weekend: 55 },
    { hour: '8 PM', weekday: 82, weekend: 72 },
    { hour: '11 PM', weekday: 30, weekend: 40 }
  ],
  systemInsight: 'Recurring congestion detected: 18 of the last 30 working days had traffic disruptions during morning peak hours (8:15 AM — 10:15 AM).'
};

export const CITY_PULSE_DATA = {
  city: 'Mangaluru',
  timestamp: '12:42 PM, Oct 23, 2026',
  mobilityScore: 72,
  mobilityLabel: 'Moderate Flow',
  criticalZones: 4,
  heavyTraffic: 9,
  normalRoads: 46,
  roadClosures: 2
};
