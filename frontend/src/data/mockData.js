// RouteWise AI - Comprehensive Mock Data Layer
// Karnataka Coastal & Urban Corridor (Mangaluru - Udupi - Bantwal)

export const DEMO_NOTICE = {
  text: "Simulated demonstration data for prototype evaluation. No live government feeds or paid routing APIs connected.",
  badge: "Simulated Demo Data"
};

export const INCIDENT_CATEGORIES = [
  { id: 'traffic_congestion', label: 'Traffic Congestion', icon: 'Clock', color: '#f59e0b', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'accident', label: 'Accident', icon: 'AlertTriangle', color: '#ef4444', badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { id: 'roadblock', label: 'Roadblock', icon: 'ShieldAlert', color: '#ec4899', badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { id: 'road_repair', label: 'Road Construction / Repair', icon: 'Hammer', color: '#eab308', badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'flooding', label: 'Flooding / Waterlogging', icon: 'Droplets', color: '#06b6d4', badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'landslide', label: 'Landslide', icon: 'Mountain', color: '#d97706', badgeClass: 'bg-amber-600/20 text-amber-200 border-amber-600/30' },
  { id: 'fallen_tree', label: 'Fallen Tree', icon: 'Trees', color: '#10b981', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'breakdown', label: 'Vehicle Breakdown', icon: 'Truck', color: '#8b5cf6', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'hazard', label: 'Other Road Hazard', icon: 'AlertOctagon', color: '#64748b', badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30' }
];

export const VERIFICATION_LEVELS = [
  { level: 1, title: 'User Reported', desc: 'Single commuter submission registered', weight: 15, color: '#94a3b8' },
  { level: 2, title: 'GPS Confirmed', desc: 'Reporter geolocation within 20m of road', weight: 20, color: '#38bdf8' },
  { level: 3, title: 'Multi-Report Consensus', desc: '3+ corroborating independent reports', weight: 25, color: '#818cf8' },
  { level: 4, title: 'Telemetry Validated', desc: 'Aggregated GPS speed < 5 km/h over 300m', weight: 20, color: '#f59e0b' },
  { level: 5, title: 'Forensic Evidence', desc: 'Timestamped photo or dashcam video', weight: 10, color: '#10b981' },
  { level: 6, title: 'Authority Certified', desc: 'Official validation from Traffic Control Room', weight: 10, color: '#06b6d4' }
];

export const INITIAL_INCIDENTS = [
  {
    id: 'inc-001',
    title: 'Multi-Vehicle Collision at Thokkottu Flyover',
    category: 'accident',
    severity: 'critical', // low, moderate, severe, critical
    locationName: 'NH-66, Thokkottu Junction, Mangaluru',
    lat: 12.8335,
    lng: 74.8584,
    reportedAgo: '28m ago',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    delayMinutes: 28,
    affectedDistanceKm: 2.1,
    description: 'Collision involving two passenger cars and a mini-truck on the southbound lane heading toward Ullal. Traffic bottleneck stretching past the Netravati Bridge.',
    imageUrl: 'https://images.unsplash.com/photo-1543393470-bce01e0a233b?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    hasAudioReport: true,
    verificationLevel: 5,
    trustScore: 92,
    confirmationCount: 22,
    upvotes: 45,
    status: 'active', // active, investigating, cleared
    evidence: {
      hasGpsLocation: true,
      userReportCount: 22,
      hasMedia: true,
      avgSpeedKmh: 4.2,
      normalSpeedKmh: 50.0,
      authorityConfirmed: false,
      authorityAgency: 'Mangaluru City Traffic Police (Pending onsite arrival)'
    },
    verificationHistory: [
      { time: '28m ago', event: 'Initial citizen report submitted via RouteWise Mobile', user: 'Commuter @Ananya_R' },
      { time: '24m ago', event: 'GPS stationary cluster detected on NH-66 corridor (14 devices < 5 km/h)', user: 'RouteWise Telemetry Engine' },
      { time: '19m ago', event: '8 additional corroborating reports logged with geo-bounds match', user: 'Crowd Consensus Protocol' },
      { time: '14m ago', event: 'Photo evidence uploaded and forensic EXIF timestamp matched', user: 'Verified Commuter @KiranP' },
      { time: '06m ago', event: 'TrustScore elevated to 92/100 (Level 5 Evidence Confirmed)', user: 'RouteWise Trust Engine' }
    ],
    alternativeRoute: 'Divert via Ullal Beach Road / Kotekar Inner Link to bypass NH-66 bottleneck (Saves approx 18 mins).'
  },
  {
    id: 'inc-002',
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
    description: 'NHAI emergency asphalt milling and expansion joint repair. Two lanes blocked; traffic moving in single file.',
    imageUrl: 'https://images.unsplash.com/photo-1584463699039-b9d901362e8a?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    hasAudioReport: false,
    verificationLevel: 6,
    trustScore: 98,
    confirmationCount: 38,
    upvotes: 72,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 38,
      hasMedia: true,
      avgSpeedKmh: 12.0,
      normalSpeedKmh: 45.0,
      authorityConfirmed: true,
      authorityAgency: 'National Highways Authority of India (NHAI) Bulletin #402'
    },
    verificationHistory: [
      { time: '1h 15m ago', event: 'Scheduled work notification cross-referenced with NHAI log', user: 'Authority System Sync' },
      { time: '55m ago', event: '19 live commuter speed drops logged through junction', user: 'Telemetry Validator' },
      { time: '30m ago', event: 'Officer Shrikant (Traffic Sub-Inspector) marked Certified Active', user: 'Mangaluru City Traffic Control' }
    ],
    alternativeRoute: 'Take Ladyhill - Urwa Market road toward Bejai to circumvent Kottara Chowki completely.'
  },
  {
    id: 'inc-003',
    title: 'Monsoon Waterlogging & Sump Overflow',
    category: 'flooding',
    severity: 'critical',
    locationName: 'Pumpwell (Mahaveera Circle) Underpass, Mangaluru',
    lat: 12.8622,
    lng: 74.8637,
    reportedAgo: '42m ago',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    delayMinutes: 35,
    affectedDistanceKm: 2.8,
    description: 'Flash drainage backflow has inundated the southbound service road under Pumpwell with 1.5 ft water. Two-wheelers and compact sedans unable to cross.',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    hasAudioReport: true,
    verificationLevel: 5,
    trustScore: 89,
    confirmationCount: 29,
    upvotes: 88,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 29,
      hasMedia: true,
      avgSpeedKmh: 3.5,
      normalSpeedKmh: 40.0,
      authorityConfirmed: false,
      authorityAgency: 'Mangaluru Municipal Corp Quick Response Team Dispatched'
    },
    verificationHistory: [
      { time: '42m ago', event: 'High water hazard flagged with voice memo', user: 'Commuter @RohanV' },
      { time: '36m ago', event: 'Photo proof submitted showing water level reaching wheel hubs', user: 'Commuter @SnehaP' },
      { time: '20m ago', event: 'Telemetry corroboration: 26 vehicles rerouted voluntarily', user: 'RouteWise AI Engine' }
    ],
    alternativeRoute: 'Use Kankanady Bypass -> Father Muller Road -> Valencia link.'
  },
  {
    id: 'inc-004',
    title: 'Severe Peak-Hour Bottleneck & Signal Desync',
    category: 'traffic_congestion',
    severity: 'severe',
    locationName: 'Nanthoor Junction Roundabout, Mangaluru',
    lat: 12.8756,
    lng: 74.8628,
    reportedAgo: '15m ago',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    delayMinutes: 22,
    affectedDistanceKm: 1.9,
    description: 'Merging of heavy container trucks from New Mangalore Port with local city transit. Roundabout gridlock extending to Bikarnakatte.',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    hasAudioReport: false,
    verificationLevel: 6,
    trustScore: 95,
    confirmationCount: 44,
    upvotes: 110,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 44,
      hasMedia: true,
      avgSpeedKmh: 6.0,
      normalSpeedKmh: 38.0,
      authorityConfirmed: true,
      authorityAgency: 'Mangaluru Central Traffic Control Command'
    },
    verificationHistory: [
      { time: '15m ago', event: 'Gridlock alert triggered by automated speed drops (< 5 km/h)', user: 'AI Flow Monitor' },
      { time: '10m ago', event: '32 commuter check-ins confirming stalled traffic', user: 'Consensus Network' },
      { time: '05m ago', event: 'Traffic Police posted manual override at Nanthoor Circle', user: 'Officer Rao #108' }
    ],
    alternativeRoute: 'Divert via Kadri Temple Road -> Mallikatte -> Bunts Hostel.'
  },
  {
    id: 'inc-005',
    title: 'Heavy Truck Breakdown Blocking Right Lane',
    category: 'breakdown',
    severity: 'moderate',
    locationName: 'NH-66 Near NITK Surathkal Toll Plaza',
    lat: 13.0118,
    lng: 74.7943,
    reportedAgo: '35m ago',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    delayMinutes: 14,
    affectedDistanceKm: 1.1,
    description: 'Broken axle on loaded commercial vehicle occupying right-bound overtaking lane. Tow truck en route.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    hasAudioReport: false,
    verificationLevel: 3,
    trustScore: 68,
    confirmationCount: 9,
    upvotes: 21,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 9,
      hasMedia: false,
      avgSpeedKmh: 18.0,
      normalSpeedKmh: 60.0,
      authorityConfirmed: false,
      authorityAgency: 'Toll Patrol Notified'
    },
    verificationHistory: [
      { time: '35m ago', event: 'Breakdown hazard marked by commuter', user: 'Driver @Vikram_H' },
      { time: '22m ago', event: 'Corroborated by 8 transit sensors passing Surathkal Toll', user: 'Sensor Network' }
    ],
    alternativeRoute: 'Stay in left service lane 400m before toll gates.'
  },
  {
    id: 'inc-006',
    title: 'Mud & Loose Gravel on Slope - Post Heavy Rain',
    category: 'landslide',
    severity: 'severe',
    locationName: 'Bantwal - BC Road Highway Bypass Cut',
    lat: 12.8892,
    lng: 75.0298,
    reportedAgo: '2h ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    delayMinutes: 20,
    affectedDistanceKm: 0.8,
    description: 'Minor embankment slide loosened soil onto the shoulder and outer lane. Earthmovers currently clearing sediment.',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    hasAudioReport: true,
    verificationLevel: 4,
    trustScore: 84,
    confirmationCount: 17,
    upvotes: 54,
    status: 'active',
    evidence: {
      hasGpsLocation: true,
      userReportCount: 17,
      hasMedia: true,
      avgSpeedKmh: 14.0,
      normalSpeedKmh: 55.0,
      authorityConfirmed: false,
      authorityAgency: 'PWD Bantwal Sub-Division'
    },
    verificationHistory: [
      { time: '2h ago', event: 'Hazard reported with picture of mud spill', user: 'Citizen @GaneshB' },
      { time: '1h 20m ago', event: 'GPS speeds consistently down to 15 km/h on curve', user: 'Telemetry Monitor' }
    ],
    alternativeRoute: 'Take Panemangalore old bridge link road.'
  }
];

export const MOCK_ROUTES = [
  {
    id: 'route-fastest',
    name: 'NH-66 Coastal Expressway Corridor',
    type: 'fastest',
    tag: 'Fastest Route',
    tagColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
    summary: 'Via Surathkal - Kottara Chowki - Hampankatta',
    distanceKm: 34.2,
    typicalDurationMin: 42,
    currentDurationMin: 58,
    delayMin: 16,
    incidentCount: 2,
    congestionLevel: 'moderate', // low, moderate, severe
    efficiencyScore: 88,
    fuelEstimateLiters: 2.8,
    tollCount: 1,
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
    tagColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    summary: 'Via Bajpe Road - Bondel - Kadri Hills',
    distanceKm: 38.6,
    typicalDurationMin: 48,
    currentDurationMin: 50,
    delayMin: 2,
    incidentCount: 0,
    congestionLevel: 'low',
    efficiencyScore: 96,
    fuelEstimateLiters: 2.9,
    tollCount: 0,
    coordinates: [
      [13.0118, 74.7943],
      [12.9912, 74.8451], // Bajpe connector
      [12.9351, 74.8642], // Bondel
      [12.8891, 74.8589], // Kadri Hills
      [12.8688, 74.8436]  // Hampankatta
    ]
  },
  {
    id: 'route-fewest-incidents',
    name: 'Inner Ring Corridor via Bejai',
    type: 'fewest_incidents',
    tag: 'Fewest Incidents',
    tagColor: 'text-blue-400 bg-blue-950/80 border-blue-500/40',
    summary: 'Via Kulur Ferry Road - Urwa - Lalbagh',
    distanceKm: 35.8,
    typicalDurationMin: 45,
    currentDurationMin: 53,
    delayMin: 8,
    incidentCount: 1,
    congestionLevel: 'moderate',
    efficiencyScore: 91,
    fuelEstimateLiters: 2.7,
    tollCount: 0,
    coordinates: [
      [13.0118, 74.7943],
      [12.9412, 74.8251], // Kulur
      [12.8942, 74.8329], // Urwa
      [12.8812, 74.8412], // Lalbagh
      [12.8688, 74.8436]  // Hampankatta
    ]
  }
];

export const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-401',
    name: 'Ananya Rao',
    department: 'Software Engineering',
    role: 'Lead Architect',
    route: 'Mangaluru – Udupi Corridor',
    origin: 'Udupi City',
    destination: 'RouteWise Tech Park, Mangaluru',
    journeyStatus: 'delayed', // on_schedule, delayed, approaching, completed, not_started
    estimatedArrival: '09:42 AM',
    scheduledArrival: '09:15 AM',
    estimatedDelayMin: 27,
    incidentAffected: 'Multi-Vehicle Collision at Thokkottu Flyover',
    incidentTrustScore: 92,
    verificationStatus: 'Level 5 (Verified Traffic Evidence)',
    consentGranted: true,
    sharingMode: 'active_commute',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    delayCertificateId: 'CERT-2026-TR-8812',
    lastCoordinates: [12.8335, 74.8584],
    evidenceApproved: true,
    hrNotes: 'Commute delay backed by RouteWise GPS and accident photo evidence. Automated excused arrival.'
  },
  {
    id: 'EMP-402',
    name: 'Vikram Hegde',
    department: 'Product Operations',
    role: 'Senior Product Manager',
    route: 'Ullal – Mangaluru',
    origin: 'Ullal Post Office Road',
    destination: 'RouteWise Tech Park, Mangaluru',
    journeyStatus: 'on_schedule',
    estimatedArrival: '08:55 AM',
    scheduledArrival: '09:00 AM',
    estimatedDelayMin: 0,
    incidentAffected: 'None (Smooth Flow)',
    incidentTrustScore: null,
    verificationStatus: 'Normal Corridor',
    consentGranted: true,
    sharingMode: 'active_commute',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    delayCertificateId: null,
    lastCoordinates: [12.8122, 74.8512],
    evidenceApproved: false,
    hrNotes: 'Traveled via Coastal link to circumvent Thokkottu incident on advice of app.'
  },
  {
    id: 'EMP-403',
    name: 'Rajesh Kamath',
    department: 'Customer Success',
    role: 'Support Specialist',
    route: 'Bantwal – Mangaluru',
    origin: 'Bantwal BC Road',
    destination: 'RouteWise Tech Park, Mangaluru',
    journeyStatus: 'delayed',
    estimatedArrival: '09:30 AM',
    scheduledArrival: '09:15 AM',
    estimatedDelayMin: 15,
    incidentAffected: 'Mud & Loose Gravel on Slope - Bantwal Bypass',
    incidentTrustScore: 84,
    verificationStatus: 'Level 4 (Telemetry Verified)',
    consentGranted: true,
    sharingMode: 'active_commute',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    delayCertificateId: 'CERT-2026-TR-8819',
    lastCoordinates: [12.8892, 75.0298],
    evidenceApproved: true,
    hrNotes: 'Slow vehicular speed verified by sensor grid.'
  },
  {
    id: 'EMP-404',
    name: 'Divya Shenoy',
    department: 'Data Analytics',
    role: 'Data Scientist',
    route: 'Surathkal – Hampankatta',
    origin: 'Surathkal NITK Gate',
    destination: 'RouteWise Tech Park, Mangaluru',
    journeyStatus: 'delayed',
    estimatedArrival: '09:28 AM',
    scheduledArrival: '09:10 AM',
    estimatedDelayMin: 18,
    incidentAffected: 'Flyover Deck Repair - Kottara Chowki',
    incidentTrustScore: 98,
    verificationStatus: 'Level 6 (Authority Certified)',
    consentGranted: true,
    sharingMode: 'active_commute',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    delayCertificateId: 'CERT-2026-TR-8824',
    lastCoordinates: [12.9056, 74.8384],
    evidenceApproved: true,
    hrNotes: 'Official NHAI road repair bulletin certified.'
  },
  {
    id: 'EMP-405',
    name: 'Mohammed Irfan',
    department: 'Quality Assurance',
    role: 'QA Automation Engineer',
    route: 'Pumpwell – Bejai',
    origin: 'Mahaveera Circle Area',
    destination: 'RouteWise Tech Park, Mangaluru',
    journeyStatus: 'delayed',
    estimatedArrival: '09:38 AM',
    scheduledArrival: '09:15 AM',
    estimatedDelayMin: 23,
    incidentAffected: 'Monsoon Waterlogging at Pumpwell Underpass',
    incidentTrustScore: 89,
    verificationStatus: 'Level 5 (Verified Traffic Evidence)',
    consentGranted: true,
    sharingMode: 'active_commute',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    delayCertificateId: 'CERT-2026-TR-8831',
    lastCoordinates: [12.8622, 74.8637],
    evidenceApproved: true,
    hrNotes: 'Water logging verified by multiple photo uploads and police advisory.'
  },
  {
    id: 'EMP-406',
    name: 'Sneha Pai',
    department: 'People & Culture',
    role: 'HR Business Partner',
    route: 'Mulki – Mangaluru',
    origin: 'Mulki Town',
    destination: 'RouteWise Tech Park, Mangaluru',
    journeyStatus: 'approaching',
    estimatedArrival: '09:02 AM',
    scheduledArrival: '09:00 AM',
    estimatedDelayMin: 2,
    incidentAffected: 'None',
    incidentTrustScore: null,
    verificationStatus: 'Clear Road',
    consentGranted: true,
    sharingMode: 'active_commute',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    delayCertificateId: null,
    lastCoordinates: [12.9212, 74.8288],
    evidenceApproved: false,
    hrNotes: 'Arriving on time.'
  }
];

export const AUTHORITY_HOTSPOTS = [
  {
    id: 'hotspot-01',
    name: 'Nanthoor Junction Roundabout',
    roadStretch: 'NH-66 / NH-73 Confluence',
    recurrenceRate: '92% of working days',
    avgDelayMin: 26,
    totalIncidentsRecorded: 184,
    peakHours: '08:30 - 10:15 AM & 05:45 - 08:00 PM',
    primaryCauses: ['Unsignalized roundabout weaving', 'Port container truck volume', 'Pedestrian crossing conflict'],
    lat: 12.8756,
    lng: 74.8628,
    severityIndex: 'Critical',
    aiRecommendations: [
      'Implement smart adaptive signal cycle with 90s arterial green during morning peak.',
      'Construct proposed grade-separated underpass on NH-66 corridor.',
      'Restrict multi-axle freight movement between 08:00 AM and 10:00 AM.'
    ],
    lastAuditDate: '2026-09-15'
  },
  {
    id: 'hotspot-02',
    name: 'Pumpwell (Mahaveera Circle) Underpass',
    roadStretch: 'NH-66 South Entrance',
    recurrenceRate: '78% during monsoon / 45% standard',
    avgDelayMin: 22,
    totalIncidentsRecorded: 142,
    peakHours: 'Heavy rain events & 09:00 - 10:30 AM',
    primaryCauses: ['Low underpass stormwater basin', 'Service lane bottleneck merge', 'Bus stoppage congestion'],
    lat: 12.8622,
    lng: 74.8637,
    severityIndex: 'High',
    aiRecommendations: [
      'Upgrade pumping station discharge capacity to 3,500 L/sec.',
      'Relocate KSRTC private bus boarding bay 200m south of roundabout.',
      'Deploy automated flood gauge linked to RouteWise warning broadcast.'
    ],
    lastAuditDate: '2026-08-28'
  },
  {
    id: 'hotspot-03',
    name: 'Kottara Chowki Flyover Node',
    roadStretch: 'NH-66 / Airport Link Junction',
    recurrenceRate: '65% of working days',
    avgDelayMin: 18,
    totalIncidentsRecorded: 96,
    peakHours: '08:45 - 10:00 AM & 06:00 - 07:30 PM',
    primaryCauses: ['Underpass U-turn weave friction', 'Airport expressway exit lane squeeze'],
    lat: 12.9056,
    lng: 74.8384,
    severityIndex: 'Medium-High',
    aiRecommendations: [
      'Lengthen physical deceleration slip lane by 80 meters.',
      'Install dynamic overhead lane assignment LED signs.'
    ],
    lastAuditDate: '2026-09-02'
  },
  {
    id: 'hotspot-04',
    name: 'Thokkottu Flyover Merge & Netravati Corridor',
    roadStretch: 'NH-66 South Bridgehead',
    recurrenceRate: '58% of working days',
    avgDelayMin: 24,
    totalIncidentsRecorded: 112,
    peakHours: '08:15 - 09:45 AM',
    primaryCauses: ['Lane reduction from 3-lane to 2-lane bridge', 'Intercity bus lane straddling'],
    lat: 12.8335,
    lng: 74.8584,
    severityIndex: 'High',
    aiRecommendations: [
      'Rumble strips and speed enforcement radar 500m before merge point.',
      'Active automated tow truck stationed during morning commute window.'
    ],
    lastAuditDate: '2026-10-05'
  }
];

export const MONTHLY_ANALYTICS_DATA = [
  { month: 'May', incidents: 84, delayHours: 420, verifiedRatio: 82, resolvedCount: 79 },
  { month: 'Jun', incidents: 145, delayHours: 810, verifiedRatio: 88, resolvedCount: 132 }, // Monsoon onset
  { month: 'Jul', incidents: 198, delayHours: 1150, verifiedRatio: 92, resolvedCount: 185 }, // Heavy rain peak
  { month: 'Aug', incidents: 162, delayHours: 940, verifiedRatio: 90, resolvedCount: 154 },
  { month: 'Sep', incidents: 118, delayHours: 630, verifiedRatio: 86, resolvedCount: 110 },
  { month: 'Oct', incidents: 104, delayHours: 580, verifiedRatio: 89, resolvedCount: 98 }
];

export const HOURLY_CONGESTION_DATA = [
  { hour: '06:00', delayIndex: 12, speedKmh: 48 },
  { hour: '07:00', delayIndex: 28, speedKmh: 42 },
  { hour: '08:00', delayIndex: 78, speedKmh: 19 },
  { hour: '09:00', delayIndex: 94, speedKmh: 12 },
  { hour: '10:00', delayIndex: 68, speedKmh: 24 },
  { hour: '11:00', delayIndex: 42, speedKmh: 35 },
  { hour: '12:00', delayIndex: 38, speedKmh: 38 },
  { hour: '13:00', delayIndex: 45, speedKmh: 34 },
  { hour: '14:00', delayIndex: 39, speedKmh: 37 },
  { hour: '15:00', delayIndex: 48, speedKmh: 32 },
  { hour: '16:00', delayIndex: 62, speedKmh: 26 },
  { hour: '17:00', delayIndex: 88, speedKmh: 15 },
  { hour: '18:00', delayIndex: 96, speedKmh: 11 },
  { hour: '19:00', delayIndex: 82, speedKmh: 17 },
  { hour: '20:00', delayIndex: 52, speedKmh: 28 },
  { hour: '21:00', delayIndex: 30, speedKmh: 40 },
  { hour: '22:00', delayIndex: 16, speedKmh: 46 }
];

export const WEEKDAY_CONGESTION_DATA = [
  { day: 'Mon', delayMinutesAvg: 29, incidentReports: 38 },
  { day: 'Tue', delayMinutesAvg: 24, incidentReports: 29 },
  { day: 'Wed', delayMinutesAvg: 22, incidentReports: 26 },
  { day: 'Thu', delayMinutesAvg: 25, incidentReports: 31 },
  { day: 'Fri', delayMinutesAvg: 34, incidentReports: 45 },
  { day: 'Sat', delayMinutesAvg: 20, incidentReports: 22 },
  { day: 'Sun', delayMinutesAvg: 14, incidentReports: 15 }
];

export const CATEGORY_DISTRIBUTION_DATA = [
  { name: 'Accidents', value: 28, color: '#ef4444' },
  { name: 'Traffic Congestion', value: 36, color: '#f59e0b' },
  { name: 'Road Repairs', value: 16, color: '#eab308' },
  { name: 'Flooding / Water', value: 12, color: '#06b6d4' },
  { name: 'Hazard / Breakdown', value: 8, color: '#8b5cf6' }
];

export const TOP_AFFECTED_ROADS = [
  { road: 'NH-66 Surathkal - Thokkottu Stretch', avgDelay: '26 mins', incidents: 84, primaryIssue: 'Bottlenecks & Construction', riskScore: 92 },
  { road: 'Nanthoor Junction & Circle', avgDelay: '24 mins', incidents: 72, primaryIssue: 'Roundabout Weaving Gridlock', riskScore: 89 },
  { road: 'Pumpwell Mahaveera Circle Underpass', avgDelay: '22 mins', incidents: 61, primaryIssue: 'Flash Flooding & Service Lane', riskScore: 85 },
  { road: 'Airport Road (Kavoor - Bajpe)', avgDelay: '14 mins', incidents: 38, primaryIssue: 'Curves & Slope Surface Erosion', riskScore: 68 },
  { road: 'Kottara Chowki Underpass', avgDelay: '16 mins', incidents: 42, primaryIssue: 'Flyover Deck Expansion Repair', riskScore: 74 },
  { road: 'Bantwal - BC Road NH-73 Link', avgDelay: '18 mins', incidents: 35, primaryIssue: 'Slope Erosion & Heavy Freight', riskScore: 71 }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Severe Incident on Your Usual Route',
    message: 'Thokkottu Flyover collision adding +28 mins to NH-66. We recommend the Coastal link road.',
    time: '12m ago',
    type: 'critical',
    read: false,
    routeId: 'route-fastest'
  },
  {
    id: 'notif-2',
    title: 'Employer Delay Proof Issued',
    message: 'Verified delay certificate #CERT-2026-TR-8812 was generated for your journey.',
    time: '45m ago',
    type: 'success',
    read: false,
    routeId: null
  },
  {
    id: 'notif-3',
    title: 'Weather Warning: High Tide & Monsoon Shower',
    message: 'Pumpwell underpass water levels rising. Low clearance vehicles advised to reroute.',
    time: '1h ago',
    type: 'warning',
    read: true,
    routeId: null
  },
  {
    id: 'notif-4',
    title: 'Authority Roadwork Update',
    message: 'Kottara Chowki repairs extended through 18:00 hrs. Expect single-lane crawl.',
    time: '2h ago',
    type: 'info',
    read: true,
    routeId: null
  }
];

export const INITIAL_JOURNEYS = [
  {
    id: 'jrn-901',
    date: 'Today, 08:24 AM',
    origin: 'Surathkal Town',
    destination: 'RouteWise Tech Hub, Hampankatta',
    routeUsed: 'NH-66 Coastal Expressway Corridor',
    durationMin: 54,
    typicalMin: 42,
    delayMin: 12,
    status: 'Completed',
    savedMinWithAlternative: 14,
    trustScoreVerified: 92,
    co2SavedKg: 0.8
  },
  {
    id: 'jrn-902',
    date: 'Yesterday, 05:40 PM',
    origin: 'Hampankatta',
    destination: 'Surathkal Town',
    routeUsed: 'Airport Road & Coastal Bypass',
    durationMin: 49,
    typicalMin: 48,
    delayMin: 1,
    status: 'Completed',
    savedMinWithAlternative: 22,
    trustScoreVerified: 95,
    co2SavedKg: 1.4
  },
  {
    id: 'jrn-903',
    date: 'Oct 21, 2026, 08:35 AM',
    origin: 'Ullal Gate',
    destination: 'RouteWise Tech Hub',
    routeUsed: 'Inner Ring Corridor via Bejai',
    durationMin: 32,
    typicalMin: 28,
    delayMin: 4,
    status: 'Completed',
    savedMinWithAlternative: 8,
    trustScoreVerified: 88,
    co2SavedKg: 0.5
  }
];

export const EMERGENCY_CONTACTS_DEFAULT = [
  { id: 'ice-1', name: 'Dr. Priya Rao', phone: '+91 98450 12345', relation: 'Spouse / Next of Kin' },
  { id: 'ice-2', name: 'RouteWise Org Transit Hotline', phone: '+91 824 2490000', relation: 'Employer Security Desk' }
];
