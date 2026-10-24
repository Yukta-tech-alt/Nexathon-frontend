
# RoadTruth - Traffic Intelligence Backend

A robust, modular Python Flask backend for **RoadTruth**, a crowdsourced and authority-verified traffic intelligence platform built for a 24-hour hackathon.

---

## 📋 Table of Contents
1. [Architecture & Folder Structure](#-architecture--folder-structure)
2. [Quickstart (Windows & VS Code)](#-quickstart-windows--vs-code)
3. [Environment Configuration](#-environment-configuration)
4. [Trust-Scoring System](#-trust-scoring-system)
5. [Clearance-Time Estimation System](#-clearance-time-estimation-system)
6. [Complete API Reference](#-complete-api-reference)
7. [React Frontend Integration Guide (JavaScript fetch examples)](#-react-frontend-integration-guide)
8. [Thunder Client & Postman Testing](#-thunder-client--postman-testing)
9. [Automated Testing](#-automated-testing)
10. [Known Limitations & External Dependencies](#-known-limitations--external-dependencies)

---

## 📁 Architecture & Folder Structure

```text
nexathon/
├── .env.example                         # Template for environment settings
├── .gitignore                           # Git ignore rules for Python, SQLite, env
├── README.md                            # Comprehensive backend documentation
├── requirements.txt                     # Root requirements file
├── run.py                               # Self-bootstrapping launcher for virtualenv
├── run_server.bat                       # One-click Windows launcher
├── thunder-collection_roadtruth.json    # Native Thunder Client collection
├── RoadTruth_API.postman_collection.json # Postman collection
├── backend/
│   ├── __init__.py                      # Package entrypoint & model exports
│   ├── app.py                           # Flask app factory, CORS, routes & error handling
│   ├── config.py                        # App configuration & CORS allowed origins
│   ├── models.py                        # Incident & IncidentVerification models
│   ├── validators.py                    # Schema, type, and coordinate validations
│   ├── proximity.py                     # Haversine distance, duplicate check & nearby alerts
│   ├── verification_service.py          # Trust-scoring, community consensus & official verification
│   ├── clearance_service.py             # Baseline clearance duration & resolution lifecycle
│   ├── analytics_service.py             # Heatmap data, spatial grid hotspots & database analytics
│   ├── requirements.txt                 # Dependencies list
│   └── instance/
│       └── roadtruth.sqlite3            # Local SQLite database
└── tests/
    └── test_api.py                      # 19 automated unit & regression tests
```

---

## 🚀 Quickstart (Windows & VS Code)

### 1. Open in VS Code
Open VS Code and navigate to `c:\Users\shrey\Downloads\nexathon`.

### 2. Run the Backend Server
In your VS Code terminal (PowerShell or Command Prompt):
```powershell
python run.py
```
*(Or double-click `run_server.bat` in Windows File Explorer).*

The console will display:
```text
>> Starting RoadTruth Backend on http://127.0.0.1:5000
```

### 3. Verify Health Check
Open in your browser: [http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)
```json
{
  "database": "connected",
  "service": "RoadTruth Backend",
  "status": "healthy",
  "timestamp": "2026-10-23T14:40:00Z"
}
```

---

## ⚙️ Environment Configuration

Copy [.env.example](file:///c:/Users/shrey/Downloads/nexathon/.env.example) to `.env`:
```powershell
cp .env.example backend/.env
```

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Flask server |
| `FLASK_DEBUG` | `True` | Enable Flask debug & live reloader |
| `SECRET_KEY` | `roadtruth-hackathon-secret-key-2026` | App secret key (override in prod) |
| `DATABASE_URL` | `sqlite:///backend/instance/roadtruth.sqlite3` | SQLite path |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173...` | Allowed React frontend origins |

---

## 🛡️ Trust-Scoring System

### Scoring Formula
All trust scores are normalized to the range **[0.00, 1.00]**:

1. **Initial Uncorroborated Report**: Assigned a realistic starting baseline of **`0.40`** (or **`0.60`** if photo/dashcam URL evidence is provided).
2. **Authorized Official Verification**:
   - Authorized roles (`police`, `traffic_police`, `traffic_authority`, `emergency_service`, `road_operator`):
   - Automatically sets `trust_score = 1.00` and `verification_status = 'verified'`.
3. **Citizen Corroboration**:
   - Each unique, independent citizen confirmation adds **`+0.15`** to trust score.
   - Each confirmation with valid proof URL (`http://` or `https://`) adds **`+0.25`**.
   - Maximum community consensus cap without official authorization: **`0.85`**.
   - **Consensus Rule**: 3 independent citizen confirmations OR 2 confirmations with photo evidence automatically transition the incident status from `pending` to `verified`.
4. **Disputes**:
   - Official dispute sets `trust_score = 0.10` and `verification_status = 'disputed'`.
   - Citizen disputes subtract **`-0.20`** per unique dispute. 2 or more citizen disputes transition the report to `disputed`.
5. **Anti-Spam & Fraud Guards**:
   - **Self-Corroboration Guard**: A reporter cannot verify or corroborate their own report (`400 Bad Request`).
   - **Duplicate Review Guard**: A user cannot submit multiple reviews for the same incident (`409 Conflict`).
   - **Duplicate Proximity Isolation**: Nearby reports of the same incident type are linked as potential duplicates; they do not count as independent confirmations unless submitted through the verification workflow.

> [!WARNING]
> **Authentication & Identity Disclaimer**:
> This backend uses client-provided `reporter_id` and `verifier_id` for demonstration and hackathon simulation. In a production deployment with public untrusted users, secure session tokens, JWTs, or OAuth2 authentication must be used to prove identity.

---

## ⏱️ Clearance-Time Estimation System

### Baseline Estimates
When an incident is reported without an explicit estimated clearance time, a category-based baseline duration is automatically calculated:

| Incident Category | Baseline Duration | Typical Operational Scenario |
|---|---|---|
| `accident` | **60 minutes** | Vehicle towing, debris sweep, and lane reopening |
| `congestion` | **45 minutes** | Typical rush-hour dispersal cycle |
| `roadwork` | **240 minutes** (4 hrs) | Active road repair / resurfacing window |
| `hazard` | **90 minutes** (1.5 hrs) | Fallen branch, spill, or obstacle clearing |
| `weather` | **120 minutes** (2 hrs) | Localized waterlogging or storm runoff |
| `closure` | **180 minutes** (3 hrs) | Structural barricades / major diversions |
| `breakdown` / `vehicle_breakdown` | **40 minutes** | Roadside tyre change or flatbed tow |
| `hazard` / `road_hazard` | **30 minutes** | Debris, fallen branches, road obstructions |
| `weather` / `weather_disruption` | **90 minutes** | Local waterlogging, high winds, zero-visibility |
| `roadblock` / `road_closure` | **120 minutes** | Authority barricades, public events, VIP diversions |
| `other` | **60 minutes** | General default fallback |

### Actual vs. Estimated Clearance
- `estimated_clearance_time`: Calculated projection of when the roadway will become clear.
- `cleared_at`: Actual recorded UTC timestamp when an authorized official or verified consensus marks the hazard resolved.
- `actual_duration_minutes`: Computed duration between `created_at` and `cleared_at`.

---

## 🚦 Complete API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and endpoint directory |
| `GET` | `/api/health` | Health check & SQLite connectivity test |
| `POST` | `/api/auth/register` | **NEW**: User registration with server-enforced role verification |
| `POST` | `/api/auth/login` | **NEW**: Secure authentication returning signed Bearer token |
| `GET` | `/api/auth/me` | **NEW**: Retrieve authenticated user profile |
| `GET` | `/api/incidents` | List incidents (`?status=`, `?type=`) |
| `POST` | `/api/incidents` | Create a new incident report (safe server trust-score & duplicate detection) |
| `GET` | `/api/incidents/<id>` | Fetch full details of an incident |
| `POST` | `/api/incidents/<id>/verify` | Submit verification, supporting evidence, dispute, or consensus (server role-checked) |
| `POST` | `/api/incidents/<id>/clear` | Mark incident officially cleared/resolved (authorized officials only) |
| `GET` | `/api/incidents/<id>/verifications` | Retrieve supporting information and verification history |
| `GET` | `/api/incidents/<id>/duplicates` | Detect proximity duplicates for an incident (`?radius_km=0.5`) |
| `POST` | `/api/incidents/check-duplicates` | Pre-flight duplicate check |
| `GET` | `/api/incidents/nearby` | Find incidents near user coordinates (`?lat=&lon=&radius_km=`) |
| `POST` | `/api/incidents/nearby` | Nearby incident search via JSON body |
| `POST` | `/api/routes/alternatives` | Real alternative routes scored by RoadTruth incident risk & closure avoidance |
| `POST` | `/api/routes/alerts` | Incident alerts detected along a custom route corridor buffer |
| `GET` | `/api/incidents/heatmap` | Map-ready incident points for React Leaflet (supports all categories) |
| `GET` | `/api/incidents/hotspots` | Spatial grid cell clusters of historical incidents |
| `GET` | `/api/incidents/analytics` | Database analytics (type distribution, status, daily timeline) |
| `GET` | `/api/incidents/stats/summary` | Summary count of total and by status |

---

## ⚛️ React Frontend Integration Guide

The backend is configured with Flask-CORS to accept cross-origin requests from React dev servers (`http://localhost:5173` for Vite, `http://localhost:3000` for Create-React-App).

All examples use standard modern JavaScript `fetch()` with error and loading handling.

### Base API Configuration
```javascript
const API_BASE = "http://127.0.0.1:5000/api";

// Helper to get Bearer authorization header from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("roadtruth_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}
```

### 0. User Registration & Login (Authentication & Role Handling)
```javascript
// Register a new citizen (or official with invite key)
async function registerUser({ username, email, password, role = "citizen", officialKey = null }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      role,
      official_key: officialKey
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error);
  
  // Store token in localStorage
  localStorage.setItem("roadtruth_token", data.token);
  return data.user;
}

// User login
async function loginUser(usernameOrEmail, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameOrEmail, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error);

  localStorage.setItem("roadtruth_token", data.token);
  return data.user; // { id, username, email, role, agency, ... }
}
```

### 1. Create an Incident Report
```javascript
async function reportIncident(incidentData) {
  try {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        incident_type: incidentData.type, // e.g. "accident", "congestion", "roadblock"
        description: incidentData.description,
        location_name: incidentData.locationName,
        latitude: incidentData.latitude,
        longitude: incidentData.longitude
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Failed to create incident");
    }

    // data contains: id, trust_score, estimated_clearance_time, possible_duplicates
    return data;
  } catch (err) {
    console.error("Report incident error:", err);
    throw err;
  }
}
```

### 2. List Incidents with Optional Filtering
```javascript
async function fetchIncidents(filterType = null, filterStatus = null) {
  try {
    const params = new URLSearchParams();
    if (filterType) params.append("type", filterType);
    if (filterStatus) params.append("status", filterStatus);

    const res = await fetch(`${API_BASE}/incidents?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to load incidents");

    return await res.json(); // Array of incidents
  } catch (err) {
    console.error("Error loading incidents:", err);
    return [];
  }
}
```

### 3. Verify an Incident / Submit Supporting Evidence
```javascript
async function submitVerification(incidentId, verificationData) {
  try {
    const res = await fetch(`${API_BASE}/incidents/${incidentId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verifier_id: verificationData.userId,
        verifier_role: verificationData.role || "citizen", // "citizen" or "traffic_police"
        action: verificationData.action || "confirm",      // "confirm", "dispute", "clear"
        supporting_info: verificationData.notes,
        evidence_url: verificationData.evidenceUrl || null
      })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || result.error);
    return result; // { message, rationale, incident, verification }
  } catch (err) {
    console.error("Verification error:", err);
    throw err;
  }
}
```

### 4. Fetch Nearby Incidents (User's Current Location Alerts)
```javascript
async function getNearbyAlerts(userLat, userLon, radiusKm = 5.0) {
  try {
    const res = await fetch(
      `${API_BASE}/incidents/nearby?latitude=${userLat}&longitude=${userLon}&radius_km=${radiusKm}`
    );
    if (!res.ok) throw new Error("Failed to fetch nearby alerts");
    
    const data = await res.json();
    return data.incidents; // Array of incidents sorted closest first
  } catch (err) {
    console.error("Nearby alerts error:", err);
    return [];
  }
}
```

### 5. Fetch Heatmap Points (React Leaflet Integration)
```javascript
async function loadHeatmapData(boundingBox = null) {
  try {
    let url = `${API_BASE}/incidents/heatmap`;
    if (boundingBox) {
      const { minLat, maxLat, minLon, maxLon } = boundingBox;
      url += `?min_lat=${minLat}&max_lat=${maxLat}&min_lon=${minLon}&max_lon=${maxLon}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load heatmap data");

    const data = await res.json();
    // Leaflet heatmap format: [[lat, lon, intensity], ...]
    return data.points.map(pt => [
      pt.latitude,
      pt.longitude,
      pt.trust_score // Intensity weight 0.0 - 1.0
    ]);
  } catch (err) {
    console.error("Heatmap loading error:", err);
    return [];
  }
}
```

### 6. Fetch Analytics & Historical Hotspots
```javascript
async function loadAnalytics() {
  try {
    const [analyticsRes, hotspotsRes] = await Promise.all([
      fetch(`${API_BASE}/incidents/analytics`),
      fetch(`${API_BASE}/incidents/hotspots`)
    ]);

    const analytics = await analyticsRes.json();
    const hotspots = await hotspotsRes.json();

    return { analytics, hotspots };
  } catch (err) {
    console.error("Error loading analytics:", err);
    throw err;
  }
}
```

### 7. Alternative Route Suggestions (With Risk Scoring & Closure Avoidance)
```javascript
/**
 * Queries alternative routes between origin and destination, evaluates active RoadTruth incidents,
 * detects confirmed roadblocks, computes risk scores, and returns ranked alternatives.
 */
async function getAlternativeRoutes(originCoords, destCoords, corridorBufferMeters = 200.0) {
  try {
    const res = await fetch(`${API_BASE}/routes/alternatives`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: { latitude: originCoords.lat, longitude: originCoords.lon },
        destination: { latitude: destCoords.lat, longitude: destCoords.lon },
        corridor_buffer_meters: corridorBufferMeters
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Failed to calculate alternative routes");
    }

    // Recommended route is ranked #1 (routes[0])
    console.log("Recommended route:", data.recommended_route_id);
    return data.routes; // Array with distance, duration, risk_score, geometry GeoJSON, recommendation_reason
  } catch (err) {
    console.error("Alternative routing error:", err);
    throw err;
  }
}
```

#### Example Request: `POST /api/routes/alternatives`
```json
{
  "origin": {"latitude": 12.9716, "longitude": 77.5946},
  "destination": {"latitude": 12.9352, "longitude": 77.6245},
  "corridor_buffer_meters": 200.0
}
```

#### Example Response: `POST /api/routes/alternatives`
```json
{
  "origin": {"latitude": 12.9716, "longitude": 77.5946},
  "destination": {"latitude": 12.9352, "longitude": 77.6245},
  "total_routes_found": 2,
  "recommended_route_id": "route_2",
  "traffic_disclaimer": "Travel times are routing estimates based on road network speed limits. Road closures and incident risk scores reflect live RoadTruth community and authority reports.",
  "routes": [
    {
      "route_id": "route_2",
      "route_name": "Via Koramangala Link (Bypass)",
      "rank": 1,
      "is_recommended": true,
      "recommendation_reason": "Recommended: Optimal alternative avoiding road closures (Risk score: 1.25).",
      "distance_km": 6.2,
      "estimated_duration_minutes": 13,
      "duration_type": "routing_engine_estimate",
      "risk_score": 1.25,
      "has_confirmed_closure": false,
      "has_pending_closure": false,
      "incident_count": 1,
      "relevant_incidents": [...],
      "geometry": {
        "type": "LineString",
        "coordinates": [[77.5946, 12.9716], [77.6150, 12.9550], [77.6245, 12.9352]]
      }
    },
    {
      "route_id": "route_1",
      "route_name": "Via Richmond Circle (Direct)",
      "rank": 2,
      "is_recommended": false,
      "recommendation_reason": "Discouraged: Verified road closure or roadblock detected directly along this corridor.",
      "distance_km": 5.0,
      "estimated_duration_minutes": 10,
      "duration_type": "routing_engine_estimate",
      "risk_score": 100.0,
      "has_confirmed_closure": true,
      "geometry": { ... }
    }
  ]
}
```

### 8. Route-Based Incident Alerts
```javascript
/**
 * Scans a route's geometry coordinates against active RoadTruth incidents
 * situated within the corridor buffer (e.g. 250 meters).
 */
async function getRouteAlerts(routeCoordinatesGeoJSON, bufferMeters = 250.0) {
  try {
    const res = await fetch(`${API_BASE}/routes/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route_coordinates: routeCoordinatesGeoJSON, // [[lon, lat], ...]
        buffer_meters: bufferMeters
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);

    return data.alerts; // Array with incident_type, distance_from_route_meters, trust_score, etc.
  } catch (err) {
    console.error("Route alerts error:", err);
    return [];
  }
}
```

---

## ⚡ Thunder Client & Postman Testing

### Thunder Client (VS Code)
1. Install **Thunder Client** in VS Code.
2. In the Thunder Client tab, click **Collections -> ... (Menu) -> Import**.
3. Select **Thunder Client Collection** and choose:
   `c:\Users\shrey\Downloads\nexathon\thunder-collection_roadtruth.json`
4. **17 pre-configured requests** covering all endpoints (including Auth Registration, Login, Profile, Incidents, Verification, Clearance, Hotspots, Analytics, Alternative Routes & Route Alerts) are available to test with one click.

### Postman
Import [RoadTruth_API.postman_collection.json](file:///c:/Users/shrey/Downloads/nexathon/RoadTruth_API.postman_collection.json) via **File -> Import**.

---

## 🧪 Automated Testing

To run the automated test suite covering all phases, security controls, and features:
```powershell
python -m unittest tests/test_api.py
```
**Actual Test Results**:
```text
................................
----------------------------------------------------------------------
Ran 32 tests in 2.798s

OK
```

All 32 automated tests pass completely without external internet dependencies (external routing calls are mocked via `unittest.mock.patch`).

---

## ⚠️ Known Limitations & External Dependencies

1. **Routing Estimates vs. Live Traffic Data**:
   - The route duration (`estimated_duration_minutes`) returned by the routing engine is based on standard road network speed limits and baseline distance physics.
   - It is explicitly labeled as `duration_type: "routing_engine_estimate"`, NOT live congestion sensor flow.
   - RoadTruth's traffic intelligence score (`risk_score`) and closure flags reflect verified community and authority reported events.
2. **External Routing Engine**:
   - The routing service defaults to OpenStreetMap's public OSRM router (`ROUTING_PROVIDER_URL=https://router.project-osrm.org`).
   - If the external engine is unreachable, the API returns HTTP 503 rather than fabricating fake routes or travel times.
   - For offline deployment or high-throughput production, point `ROUTING_PROVIDER_URL` to a local Dockerized OSRM container or enterprise routing gateway.
3. **Authentication & Access Control**:
   - RoadTruth implements token-based authentication via `POST /api/auth/register` and `POST /api/auth/login` using cryptographic URL-safe serializer tokens (`itsdangerous`) and hashed passwords (`werkzeug.security`).
   - Official registration (`traffic_police`, `transport_authority`, `admin`) requires a valid server-side `OFFICIAL_INVITE_CODE`.
   - Incident clearance (`POST /api/incidents/<id>/clear`) strictly requires official authorization.
   - Official verification can only be performed by authenticated official accounts; citizen accounts provide community confirmations.
   - Self-verification is blocked on the server, and duplicate verifications by the same user are rejected via database unique constraints.
4. **Historical Hotspots vs. Real-Time Speeds**:
   - Historical hotspots group incident reports into geographic 1km grid cells to identify recurring problem zones. They do not represent live vehicle loop detector counts.
5. **Future Non-Blocking Enhancements**:
   - Deep learning accident detection computer vision pipeline (dataset & pre-trained weights to be hooked in post-hackathon).
   - Employer journey fleet tracking (deferred until explicit driver consent and organizational RBAC are fully modeled).


