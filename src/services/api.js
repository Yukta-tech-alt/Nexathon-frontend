// RouteWise AI - Backend API Integration Service
// Connects to Flask backend running at http://127.0.0.1:5000/api

const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Retrieve auth token from localStorage if present
 */
export const getAuthToken = () => {
  return localStorage.getItem('routewise_token') || null;
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('routewise_token', token);
  } else {
    localStorage.removeItem('routewise_token');
  }
};

/**
 * Get current stored user profile
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('routewise_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Set current stored user profile
 */
export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('routewise_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('routewise_user');
  }
};

/**
 * Standard fetch wrapper with JSON headers, Authorization, and error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMsg = (data && (data.message || data.error)) || `API error ${res.status}: ${res.statusText}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Time ago formatter helper
 */
export function formatTimeAgo(isoString) {
  if (!isoString) return 'Recent';
  try {
    const past = new Date(isoString).getTime();
    const now = Date.now();
    const diffSec = Math.floor((now - past) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  } catch (e) {
    return 'Recent';
  }
}

/**
 * Normalize an incident object from the backend into the shape expected by UI components
 */
export function normalizeIncidentFromBackend(b) {
  if (!b) return null;

  const lat = Number(b.latitude) || 12.9141;
  const lng = Number(b.longitude) || 74.8560;
  const rawStatus = (b.verification_status || '').toLowerCase();
  const isCleared = b.is_cleared || rawStatus === 'cleared' || (b.status === 'cleared');

  const locationName = b.location_name || 'Coastal NH-66 Corridor';
  const category = b.incident_type || 'hazard';
  const title = b.description && b.description.length < 60 
    ? b.description 
    : `${category.toUpperCase().replace('_', ' ')}: ${locationName}`;

  const delayMinutes = Number(b.baseline_duration_minutes) || (
    b.severity === 'critical' ? 30 :
    b.severity === 'severe' ? 20 :
    b.severity === 'moderate' ? 12 : 5
  );

  let verificationLevel = 2;
  if (rawStatus === 'verified') {
    verificationLevel = 6;
  } else if (b.trust_score >= 0.8) {
    verificationLevel = 5;
  } else if (b.trust_score >= 0.6) {
    verificationLevel = 4;
  } else if (b.trust_score >= 0.4) {
    verificationLevel = 3;
  }

  const verCount = b.verification_count || (Array.isArray(b.verifications) ? b.verifications.length : 1);

  return {
    ...b,
    id: b.id,
    title,
    category,
    incident_type: b.incident_type,
    severity: b.severity || 'moderate',
    locationName,
    location_name: locationName,
    lat,
    latitude: lat,
    lng,
    longitude: lng,
    reportedAgo: formatTimeAgo(b.created_at),
    timestamp: b.created_at || new Date().toISOString(),
    created_at: b.created_at,
    delayMinutes,
    affectedDistanceKm: 1.5,
    description: b.description || 'Community incident report logged.',
    imageUrl: (b.evidence_urls && b.evidence_urls[0]) || null,
    verificationLevel,
    verification_status: b.verification_status || 'pending',
    trust_score: b.trust_score !== undefined ? b.trust_score : 0.4,
    confirmationCount: Math.max(1, verCount),
    status: isCleared ? 'cleared' : 'active',
    is_cleared: isCleared,
    cleared_at: b.cleared_at || null,
    evidence: {
      hasGpsLocation: !!b.latitude && !!b.longitude,
      userReportCount: Math.max(1, verCount),
      hasMedia: Array.isArray(b.evidence_urls) && b.evidence_urls.length > 0,
      avgSpeedKmh: 8.0,
      normalSpeedKmh: 45.0,
      authorityConfirmed: rawStatus === 'verified'
    },
    alternativeRoute: 'Alternative diversion calculated by route planner.',
    verifications: b.verifications || []
  };
}

/**
 * Format a frontend incident report payload into the backend expected format
 */
export function formatIncidentForBackend(data, user = null) {
  const normCategory = data.category || 'hazard';
  const reporterId = (user && user.username) || (user && user.email) || 'commuter';

  return {
    incident_type: normCategory,
    location_name: data.locationName || data.title || 'Mangaluru Road Network',
    latitude: Number(data.lat),
    longitude: Number(data.lng),
    description: data.description || data.title || `${normCategory} reported on corridor`,
    severity: data.severity || 'moderate',
    reporter_id: reporterId
  };
}

/**
 * Normalize backend route alternatives response for RouteWise UI
 */
export function normalizeRoutesFromBackend(response, originLabel, destLabel) {
  if (!response || !response.routes || !Array.isArray(response.routes)) {
    return [];
  }

  return response.routes.map((r, idx) => {
    const leafletCoords = (r.geometry && Array.isArray(r.geometry.coordinates))
      ? r.geometry.coordinates.map(pt => [pt[1], pt[0]])
      : [];

    const durationMin = Math.round(r.estimated_duration_minutes || (r.estimated_duration_seconds ? r.estimated_duration_seconds / 60 : 30));
    const delayMin = Math.round((r.risk_score || 0) * 15);
    const predScore = r.predicted_congestion_score !== undefined ? r.predicted_congestion_score : null;
    const predLevel = r.predicted_congestion_level || ((r.risk_score > 0.6) ? 'HIGH' : ((r.risk_score > 0.2) ? 'MEDIUM' : 'LOW'));

    return {
      id: r.route_id || `backend-route-${idx + 1}`,
      name: r.route_name || `Corridor Option ${idx + 1}`,
      badge: r.is_recommended ? 'Recommended' : (idx === 1 ? 'Alternative' : 'Option 3'),
      badgeColor: r.is_recommended ? 'cyan' : 'emerald',
      origin: originLabel || 'Starting Point',
      destination: destLabel || 'Destination',
      distanceKm: Number(r.distance_km) || +(r.distance_meters ? (r.distance_meters / 1000).toFixed(1) : 10),
      currentDurationMin: durationMin + delayMin,
      typicalDurationMin: durationMin,
      delayMin,
      congestionLevel: predLevel.toLowerCase(),
      predictedCongestionScore: predScore,
      predictedCongestionLevel: predLevel,
      routeScore: r.route_score !== undefined ? r.route_score : null,
      incidentsEnRoute: r.incident_count || (r.relevant_incidents ? r.relevant_incidents.length : 0),
      recommendationReason: r.recommendation_reason || (r.is_recommended ? 'Recommended: Clearest route with fewest hazards' : 'Alternative path'),
      hasConfirmedClosure: r.has_confirmed_closure || false,
      riskScore: r.risk_score || 0,
      coordinates: leafletCoords
    };
  });
}

// ==========================================
// API EXPORTS
// ==========================================

export const authApi = {
  login: async ({ email, username, password }) => {
    const payload = {
      email: email || username,
      username: username || email,
      password
    };
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.token) setAuthToken(res.token);
    if (res.user) setStoredUser(res.user);
    return res;
  },

  register: async ({ username, email, password, role = 'citizen', official_key = null, badge_number = null, agency = null }) => {
    let cleanUsername = username ? username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') : '';
    if (cleanUsername.length < 3) cleanUsername = `user_${Date.now().toString().slice(-4)}`;
    if (cleanUsername.length > 30) cleanUsername = cleanUsername.slice(0, 30);

    const payload = {
      username: cleanUsername,
      email: email ? email.trim().toLowerCase() : `${cleanUsername}@routewise.ai`,
      password,
      role: role === 'authority' ? 'traffic_authority' : (role === 'passenger' ? 'citizen' : role)
    };

    if (payload.role !== 'citizen') {
      payload.official_key = official_key || 'ROADTRUTH_OFFICIAL_AUTH_2026';
    }
    if (badge_number) payload.badge_number = badge_number;
    if (agency) payload.agency = agency;

    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.token) setAuthToken(res.token);
    if (res.user) setStoredUser(res.user);
    return res;
  },

  getMe: async () => apiRequest('/auth/me'),
  logout: () => {
    setAuthToken(null);
    setStoredUser(null);
  }
};

export const incidentsApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.type) query.set('type', params.type);
    if (params.severity) query.set('severity', params.severity);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const raw = await apiRequest(`/incidents${qs}`);
    return Array.isArray(raw) ? raw.map(normalizeIncidentFromBackend) : [];
  },

  getById: async (id) => {
    const raw = await apiRequest(`/incidents/${id}`);
    return normalizeIncidentFromBackend(raw);
  },

  create: async (data, user = null) => {
    const payload = formatIncidentForBackend(data, user);
    const raw = await apiRequest('/incidents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const saved = raw.incident || raw;
    return normalizeIncidentFromBackend(saved);
  },

  verify: async (incidentId, { action = 'confirm', supporting_info = '', verifier_role = 'citizen', verifier_id = null }) => {
    const payload = { action, supporting_info, verifier_role };
    if (verifier_id) payload.verifier_id = verifier_id;
    return await apiRequest(`/incidents/${incidentId}/verify`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  clear: async (incidentId, { cleared_by = 'Traffic Control Operator', verifier_role = 'traffic_authority' } = {}) => {
    return await apiRequest(`/incidents/${incidentId}/clear`, {
      method: 'POST',
      body: JSON.stringify({ cleared_by, verifier_role })
    });
  },

  getVerifications: async (incidentId) => apiRequest(`/incidents/${incidentId}/verifications`),
  getStatsSummary: async () => apiRequest('/incidents/stats/summary'),
  getAnalytics: async () => apiRequest('/incidents/analytics'),
  getHotspots: async () => apiRequest('/incidents/hotspots'),
  getHeatmap: async () => apiRequest('/incidents/heatmap'),
  getNearby: async (lat, lng, radiusKm = 5.0) => {
    return await apiRequest('/incidents/nearby', {
      method: 'POST',
      body: JSON.stringify({ latitude: lat, longitude: lng, radius_km: radiusKm })
    });
  },
  exportCsvUrl: () => `${API_BASE_URL}/incidents/export/csv`
};

export const routesApi = {
  getAlternatives: async ({ origin, destination, corridor_buffer_meters = 200.0, originLabel = '', destLabel = '' }) => {
    const payload = {
      origin: {
        latitude: origin.latitude !== undefined ? origin.latitude : origin.lat,
        longitude: origin.longitude !== undefined ? origin.longitude : origin.lng
      },
      destination: {
        latitude: destination.latitude !== undefined ? destination.latitude : destination.lat,
        longitude: destination.longitude !== undefined ? destination.longitude : destination.lng
      },
      corridor_buffer_meters
    };

    const res = await apiRequest('/routes/alternatives', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return {
      raw: res,
      normalizedRoutes: normalizeRoutesFromBackend(res, originLabel, destLabel)
    };
  },

  getAlerts: async ({ route_coordinates, buffer_meters = 200.0 }) => {
    return await apiRequest('/routes/alerts', {
      method: 'POST',
      body: JSON.stringify({ route_coordinates, buffer_meters })
    });
  }
};

export const emergencyApi = {
  sendSOS: async ({ latitude, longitude, description = 'Emergency SOS Alert', location_name = 'Current Location' }) => {
    if (!getAuthToken()) {
      try {
        await authApi.login({ email: 'commuter@routewise.ai', password: 'password123' });
      } catch (e) {}
    }
    return await apiRequest('/emergency/sos', {
      method: 'POST',
      body: JSON.stringify({
        latitude: Number(latitude),
        longitude: Number(longitude),
        description,
        location_name
      })
    });
  }
};

// ==========================================
// ML PREDICTION SERVICE (XGBoost Traffic Model)
// ==========================================

export const mlApi = {
  getHealth: async () => {
    return await apiRequest('/ml/health');
  },

  predictCongestion: async (payload) => {
    return await apiRequest('/ml/predict', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export const predictCongestion = (payload) => mlApi.predictCongestion(payload);
export const checkBackend = () => apiRequest('/health');
export const getIncidents = () => incidentsApi.getAll();

export const healthApi = {
  check: checkBackend
};

export default {
  auth: authApi,
  incidents: incidentsApi,
  routes: routesApi,
  emergency: emergencyApi,
  ml: mlApi,
  health: healthApi,
  predictCongestion
};
