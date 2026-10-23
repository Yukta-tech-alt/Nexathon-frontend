export const CATEGORIES = [
  { id: 'all', label: 'All Hazards', icon: 'AlertTriangle' },
  { id: 'pothole', label: 'Pothole & Surface Damage', icon: 'AlertOctagon', color: '#ef4444' },
  { id: 'waterlogging', label: 'Flooding / Waterlogging', icon: 'Droplets', color: '#3b82f6' },
  { id: 'construction', label: 'Unmarked Construction', icon: 'Hammer', color: '#f59e0b' },
  { id: 'traffic_signal', label: 'Broken Signal / Streetlight', icon: 'LightbulbOff', color: '#8b5cf6' },
  { id: 'debris', label: 'Road Debris & Obstruction', icon: 'Trash2', color: '#ec4899' },
  { id: 'accident_prone', label: 'Dangerous Intersection', icon: 'ShieldAlert', color: '#f97316' },
];

export const SEVERITIES = {
  critical: { label: 'Critical Hazard', color: 'bg-red-500/20 text-red-400 border-red-500/30', markerColor: '#ef4444' },
  moderate: { label: 'Moderate Risk', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', markerColor: '#f59e0b' },
  low: { label: 'Low Risk', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', markerColor: '#3b82f6' }
};

export const STATUS_LIST = {
  reported: { label: 'Reported', color: 'bg-slate-700 text-slate-300' },
  investigating: { label: 'Under Review', color: 'bg-amber-900/60 text-amber-300' },
  scheduled_repair: { label: 'Repair Scheduled', color: 'bg-indigo-900/60 text-indigo-300' },
  resolved: { label: 'Community Verified Fixed', color: 'bg-emerald-900/60 text-emerald-300' }
};

export const SAMPLE_PRESET_IMAGES = [
  { label: 'Deep Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flooded Road', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Road Construction', url: 'https://images.unsplash.com/photo-1584463699049-7c427dfa81e9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cracked Asphalt', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80' },
  { label: 'Repaired Smooth Road', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' }
];

export const INITIAL_HAZARDS = [
  {
    id: 'rt-101',
    title: 'Severe Rim-Cracking Pothole in Fast Lane',
    description: 'Deep 8-inch crater right after the crest of the flyover descent. Multiple cars had blown tires within the last 48 hours. Hard to see at dusk.',
    category: 'pothole',
    severity: 'critical',
    status: 'investigating',
    lat: 12.9716,
    lng: 77.5946,
    address: 'Inner Ring Road, near Domlur Flyover Exit',
    ward: 'Central Zone - Ward 112',
    reportedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    reportedBy: 'Kavitha R. (Daily Commuter)',
    upvotes: 42,
    truthScore: 98,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { date: '4 hrs ago', user: 'Kavitha R.', action: 'Reported hazard with photo verification' },
      { date: '2 hrs ago', user: 'Civic Watchbot', action: 'Flagged to Ward Engineer Office via Public Grievance API' },
      { date: '30 mins ago', user: '38 Citizens', action: 'Upvoted and verified hazard active' }
    ]
  },
  {
    id: 'rt-102',
    title: 'Knee-Deep Waterlogging & Hidden Median',
    description: 'Storm drain blocked by construction silt. Water accummulates over 2 feet across both lanes after even mild rain. Two scooters already skidded into hidden median curb.',
    category: 'waterlogging',
    severity: 'critical',
    status: 'reported',
    lat: 12.9352,
    lng: 77.6245,
    address: 'Sony World Junction towards Koramangala 4th Block',
    ward: 'South Zone - Ward 89',
    reportedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    reportedBy: 'Arjun M.',
    upvotes: 67,
    truthScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { date: '12 hrs ago', user: 'Arjun M.', action: 'Submitted waterlogging hazard report' },
      { date: '8 hrs ago', user: 'Rahul D.', action: 'Added note: Drainage lid missing beneath water' }
    ]
  },
  {
    id: 'rt-103',
    title: 'Unmarked Pipeline Trench Without Warning Barricade',
    description: 'Utility company dug a 3-meter trench across cyclist and motorcycle corridor and left it without reflective tape or flashing lights at night.',
    category: 'construction',
    severity: 'critical',
    status: 'scheduled_repair',
    lat: 12.9850,
    lng: 77.6050,
    address: 'MG Road Metro Station Pillar 84',
    ward: 'East Zone - Ward 76',
    reportedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    reportedBy: 'Vikram S.',
    upvotes: 31,
    truthScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1584463699049-7c427dfa81e9?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { date: '1 day ago', user: 'Vikram S.', action: 'Initial warning posted' },
      { date: '6 hrs ago', user: 'Municipal Contractor', action: 'Status moved to Scheduled Repair (Target: Today 11 PM)' }
    ]
  },
  {
    id: 'rt-104',
    title: 'Four-Way Traffic Signal Pitch Black for 3 Days',
    description: 'High-speed 4-way crossroad signal is completely dead. Chaos during evening rush hour with near-miss collisions every 5 minutes.',
    category: 'traffic_signal',
    severity: 'moderate',
    status: 'investigating',
    lat: 12.9279,
    lng: 77.6841,
    address: 'Sarjapur Main Road & Haralur Junction',
    ward: 'South-East Zone - Ward 143',
    reportedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    reportedBy: 'Sneha P.',
    upvotes: 54,
    truthScore: 99,
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { date: '2 days ago', user: 'Sneha P.', action: 'Reported traffic light failure' },
      { date: '1 day ago', user: 'Traffic Police Patrol', action: 'Manual officer dispatched during peak hours' }
    ]
  },
  {
    id: 'rt-105',
    title: 'Freshly Resurfaced & Patched (Community Verified Fixed)',
    description: 'The infamous 4-meter wide crater cluster near the IT park gate has finally been hot-asphalt patched and leveled smoothly. Safe to drive now!',
    category: 'pothole',
    severity: 'low',
    status: 'resolved',
    lat: 12.9920,
    lng: 77.6620,
    address: 'Whitefield Main Road near ITPL Gate 2',
    ward: 'Tech Corridor - Ward 55',
    reportedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    reportedBy: 'Karthik N.',
    upvotes: 118,
    truthScore: 100,
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { date: '4 days ago', user: 'Karthik N.', action: 'Reported original crater' },
      { date: '1 day ago', user: 'BBMP Road Crew', action: 'Asphalt paving completed' },
      { date: '4 hrs ago', user: '5 Residents', action: 'Uploaded photo proof and verified FIXED' }
    ]
  },
  {
    id: 'rt-106',
    title: 'Dislodged Heavy Steel Manhole Lid',
    description: 'Manhole frame broken and heavy metal lid is standing vertically inside the opening. Extremely dangerous for two-wheelers and night traffic.',
    category: 'pothole',
    severity: 'critical',
    status: 'reported',
    lat: 12.9550,
    lng: 77.5750,
    address: 'KR Market Flyover Underpass, North Ramp',
    ward: 'West Zone - Ward 104',
    reportedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reportedBy: 'Mohammed A.',
    upvotes: 29,
    truthScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { date: '2 hrs ago', user: 'Mohammed A.', action: 'Alert submitted with GPS coordinates' }
    ]
  }
];
