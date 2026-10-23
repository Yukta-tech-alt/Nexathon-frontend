// RouteWise AI - Data Templates, Schemas, and Seed Data

export const INCIDENT_CATEGORIES = [
  { id: 'accident', label: 'Accident', color: '#ef4444', icon: 'AlertTriangle', desc: 'Vehicle collision or road accident' },
  { id: 'traffic_congestion', label: 'Heavy Traffic', color: '#f59e0b', icon: 'Clock', desc: 'Severe congestion or bumper-to-bumper queue' },
  { id: 'roadblock', label: 'Roadblock', color: '#ec4899', icon: 'ShieldAlert', desc: 'Police diversion, protest or physical roadblock' },
  { id: 'road_repair', label: 'Road Construction', color: '#eab308', icon: 'Hammer', desc: 'Highway maintenance, asphalt work or trenching' },
  { id: 'flooding', label: 'Flooding / Waterlogging', color: '#06b6d4', icon: 'Droplets', desc: 'Flash rain accumulation or drainage overflow' },
  { id: 'landslide', label: 'Landslide', color: '#d97706', icon: 'Mountain', desc: 'Mud, loose earth or slope failure' },
  { id: 'fallen_tree', label: 'Fallen Tree', color: '#10b981', icon: 'Trees', desc: 'Downed tree branches or vegetation on lane' },
  { id: 'breakdown', label: 'Vehicle Breakdown', color: '#8b5cf6', icon: 'Truck', desc: 'Stalled commercial or passenger vehicle' },
  { id: 'road_closure', label: 'Road Closure', color: '#64748b', icon: 'AlertOctagon', desc: 'Complete lane or stretch closure' },
  { id: 'other', label: 'Other Road Hazard', color: '#94a3b8', icon: 'HelpCircle', desc: 'Other unexpected roadway safety obstruction' }
];

export const VERIFICATION_LEVELS = [
  { level: 1, title: 'User Reported', desc: 'Single commuter submission registered', tag: 'Reported', color: '#94a3b8' },
  { level: 2, title: 'GPS Confirmed', desc: 'Device location confirmed within 50m of road axis', tag: 'GPS Confirmed', color: '#38bdf8' },
  { level: 3, title: 'Multiple User Reports Matched', desc: '3+ corroborating independent citizen reports', tag: 'Supported', color: '#818cf8' },
  { level: 4, title: 'GPS Speed Telemetry Supports Delay', desc: 'Aggregated GPS speed < 5 km/h stall detected', tag: 'Validated', color: '#f59e0b' },
  { level: 5, title: 'Photo or Video Evidence Submitted', desc: 'Timestamped visual or dashcam evidence attached', tag: 'Confirmed', color: '#10b981' },
  { level: 6, title: 'Traffic Authority Confirmation', desc: 'Official certification from Control Room / Police', tag: 'Authority Certified', color: '#06b6d4' }
];

export const CSV_SCHEMAS = {
  incidents: {
    headers: ['title', 'category', 'severity', 'locationName', 'lat', 'lng', 'delayMinutes', 'description', 'verificationLevel'],
    sample: 'title,category,severity,locationName,lat,lng,delayMinutes,description,verificationLevel\nAccident at Thokkottu,accident,critical,NH-66 Thokkottu Junction,12.8335,74.8584,28,Multi-car collision on flyover lane,5'
  },
  employees: {
    headers: ['id', 'name', 'department', 'role', 'route', 'origin', 'scheduledArrival', 'estimatedDelayMin', 'incidentAffected', 'consentGranted'],
    sample: 'id,name,department,role,route,origin,scheduledArrival,estimatedDelayMin,incidentAffected,consentGranted\nEMP-101,Ananya Rao,Engineering,Architect,Mangaluru - Udupi,Udupi,09:00 AM,25,Thokkottu Collision,true'
  },
  journeys: {
    headers: ['origin', 'destination', 'routeUsed', 'durationMin', 'delayMin', 'status', 'savedMinWithAlternative'],
    sample: 'origin,destination,routeUsed,durationMin,delayMin,status,savedMinWithAlternative\nSurathkal,Hampankatta,NH-66 Coastal Corridor,52,14,Completed,12'
  }
};

export const SEED_INCIDENTS = [
  {
    id: 'inc-01',
    title: 'Multi-Vehicle Collision at Thokkottu Flyover',
    category: 'accident',
    severity: 'critical',
    locationName: 'NH-66, Thokkottu Junction, Mangaluru',
    lat: 12.8335,
    lng: 74.8584,
    reportedAgo: '28m ago',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    delayMinutes: 28,
    affectedDistanceKm: 2.1,
    description: 'Collision involving two cars and a transport truck on the southbound lane heading toward Ullal.',
    imageUrl: 'https://images.unsplash.com/photo-1543393470-bce01e0a233b?auto=format&fit=crop&w=800&q=80',
    verificationLevel: 5,
    confirmationCount: 14,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 14,
      hasMedia: true,
      avgSpeedKmh: 4.2,
      normalSpeedKmh: 50.0,
      authorityConfirmed: false
    },
    alternativeRoute: 'Divert via Ullal Beach Road / Kotekar Inner Link to bypass NH-66 bottleneck.'
  },
  {
    id: 'inc-02',
    title: 'Flyover Deck Repair & Lane Closure',
    category: 'road_repair',
    severity: 'severe',
    locationName: 'Kottara Chowki Flyover Underpass, Mangaluru',
    lat: 12.9056,
    lng: 74.8384,
    reportedAgo: '1h 15m ago',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    delayMinutes: 18,
    affectedDistanceKm: 1.4,
    description: 'NHAI emergency asphalt milling and expansion joint repair. Two lanes blocked; single file crawl.',
    imageUrl: 'https://images.unsplash.com/photo-1584463699039-b9d901362e8a?auto=format&fit=crop&w=800&q=80',
    verificationLevel: 6,
    confirmationCount: 22,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 22,
      hasMedia: true,
      avgSpeedKmh: 12.0,
      normalSpeedKmh: 45.0,
      authorityConfirmed: true
    },
    alternativeRoute: 'Take Ladyhill - Urwa Market road toward Bejai to circumvent Kottara Chowki.'
  },
  {
    id: 'inc-03',
    title: 'Monsoon Waterlogging & Service Road Flood',
    category: 'flooding',
    severity: 'critical',
    locationName: 'Pumpwell (Mahaveera Circle) Underpass, Mangaluru',
    lat: 12.8622,
    lng: 74.8637,
    reportedAgo: '42m ago',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    delayMinutes: 35,
    affectedDistanceKm: 2.8,
    description: 'Flash drainage backflow has inundated the southbound service road with 1.5 ft water.',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    verificationLevel: 5,
    confirmationCount: 19,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 19,
      hasMedia: true,
      avgSpeedKmh: 3.5,
      normalSpeedKmh: 40.0,
      authorityConfirmed: false
    },
    alternativeRoute: 'Use Kankanady Bypass -> Father Muller Road -> Valencia link.'
  }
];

export const SEED_EMPLOYEES = [
  {
    id: 'EMP-101',
    name: 'Ananya Rao',
    department: 'Software Engineering',
    role: 'Lead Architect',
    route: 'Mangaluru – Udupi Corridor',
    origin: 'Udupi City',
    scheduledArrival: '09:00 AM',
    estimatedArrival: '09:28 AM',
    estimatedDelayMin: 28,
    journeyStatus: 'delayed',
    incidentAffected: 'Multi-Vehicle Collision at Thokkottu Flyover',
    verificationStatus: 'Level 5 (Confirmed Forensic Evidence)',
    consentGranted: true,
    evidenceApproved: true,
    delayCertificateId: 'CERT-2026-TR-8812',
    hrNotes: 'Corridor obstruction verified by RouteWise telemetry. Automated non-disciplinary waiver applied.'
  },
  {
    id: 'EMP-102',
    name: 'Vikram Hegde',
    department: 'Product Operations',
    role: 'Senior Product Manager',
    route: 'Ullal – Mangaluru',
    origin: 'Ullal Post Office',
    scheduledArrival: '09:00 AM',
    estimatedArrival: '08:55 AM',
    estimatedDelayMin: 0,
    journeyStatus: 'on_schedule',
    incidentAffected: 'None (Clear Corridor)',
    verificationStatus: 'Normal Flow',
    consentGranted: true,
    evidenceApproved: false,
    delayCertificateId: null,
    hrNotes: 'Arriving on schedule.'
  },
  {
    id: 'EMP-103',
    name: 'Rajesh Kamath',
    department: 'Customer Success',
    role: 'Support Specialist',
    route: 'Bantwal – Mangaluru',
    origin: 'Bantwal BC Road',
    scheduledArrival: '09:15 AM',
    estimatedArrival: '09:33 AM',
    estimatedDelayMin: 18,
    journeyStatus: 'delayed',
    incidentAffected: 'Kottara Chowki Deck Repair',
    verificationStatus: 'Level 6 (Authority Certified)',
    consentGranted: true,
    evidenceApproved: true,
    delayCertificateId: 'CERT-2026-TR-8819',
    hrNotes: 'Official NHAI road repair bulletin verified.'
  }
];

export const SEED_ROUTES = [
  {
    id: 'route-fastest',
    name: 'NH-66 Coastal Expressway Corridor',
    type: 'fastest',
    tag: 'Fastest Route',
    distanceKm: 34.2,
    typicalDurationMin: 42,
    currentDurationMin: 58,
    delayMin: 16,
    incidentCount: 2,
    congestionLevel: 'moderate',
    coordinates: [
      [13.0118, 74.7943], // Surathkal
      [12.9648, 74.8212], // Baikampady
      [12.9324, 74.8321], // Kulur Bridge
      [12.9056, 74.8384], // Kottara Chowki
      [12.8756, 74.8628], // Nanthoor
      [12.8688, 74.8436]  // Hampankatta City Center
    ]
  },
  {
    id: 'route-least-congested',
    name: 'Airport Road & Coastal Bypass',
    type: 'least_congested',
    tag: 'Least Congested',
    distanceKm: 38.6,
    typicalDurationMin: 48,
    currentDurationMin: 50,
    delayMin: 2,
    incidentCount: 0,
    congestionLevel: 'low',
    coordinates: [
      [13.0118, 74.7943],
      [12.9912, 74.8451], // Bajpe
      [12.9351, 74.8642], // Bondel
      [12.8891, 74.8589], // Kadri
      [12.8688, 74.8436]  // Hampankatta
    ]
  },
  {
    id: 'route-fewest-incidents',
    name: 'Inner Ring Corridor via Bejai',
    type: 'fewest_incidents',
    tag: 'Fewest Incidents',
    distanceKm: 35.8,
    typicalDurationMin: 45,
    currentDurationMin: 53,
    delayMin: 8,
    incidentCount: 1,
    congestionLevel: 'moderate',
    coordinates: [
      [13.0118, 74.7943],
      [12.9412, 74.8251], // Kulur
      [12.8942, 74.8329], // Urwa
      [12.8812, 74.8412], // Lalbagh
      [12.8688, 74.8436]  // Hampankatta
    ]
  }
];

export const SEED_JOURNEYS = [
  {
    id: 'jrn-01',
    date: 'Today, 08:30 AM',
    origin: 'Surathkal Town',
    destination: 'Hampankatta Hub',
    routeUsed: 'NH-66 Coastal Expressway Corridor',
    durationMin: 54,
    typicalMin: 42,
    delayMin: 12,
    status: 'Completed',
    savedMinWithAlternative: 14
  },
  {
    id: 'jrn-02',
    date: 'Yesterday, 05:45 PM',
    origin: 'Hampankatta',
    destination: 'Surathkal Town',
    routeUsed: 'Airport Road & Coastal Bypass',
    durationMin: 49,
    typicalMin: 48,
    delayMin: 1,
    status: 'Completed',
    savedMinWithAlternative: 20
  }
];
