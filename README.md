# RouteWise AI — Traffic Intelligence & Commute Management Platform

> **"Beat the Traffic. Prove the Delay. Improve Every Journey."**

RouteWise AI is an enterprise-grade, responsive web platform designed to empower commuters to avoid traffic congestion, road hazards, accidents, and flash waterlogging, while giving employers objective, consent-driven delay verification evidence for workforce attendance accountability and municipal traffic authorities chronological forensic incident intelligence.

---

## 🏛️ Architecture & Separation of Concerns

RouteWise AI enforces **strict role-based separation** across three distinct, purpose-built portals plus a public brand site and an isolated admin console:

```
├── Public Portal (/)
│   ├── / (Home / Brand landing page with 8-step evidence chain)
│   ├── /select-role (Role Gateway: Passenger, Employer, Authority)
│   ├── /login & /register (Contextual role auth)
│   ├── /about (Mission, vision, technology stack)
│   └── /help (FAQ, support & contact)
│
├── 🚗 Passenger Portal (/passenger/*)
│   ├── /passenger/dashboard (Personal commute status, active trip, live alerts, quick report)
│   ├── /passenger/routes (3-way corridor planner: Fastest, Least Congestion, Fewest Hazards)
│   ├── /passenger/alerts (Real-time verified road alerts with "Why is this road affected?" modal)
│   ├── /passenger/report (Geotagged incident submission with photo EXIF & audio notes)
│   ├── /passenger/journeys (Live journey simulation with start/stop/resume and trip history)
│   ├── /passenger/verification (6-stage vertical TrustScore timeline inspector)
│   ├── /passenger/data (Self-service CSV import/export for incidents and trips)
│   ├── /passenger/settings (Consent toggles, doorstep privacy masking & data retention)
│   └── /passenger/help (Passenger user manual and emergency guidelines)
│
├── 🏢 Employer Portal (/employer/*)
│   ├── /employer/overview (Workforce transit roster, corridor delays, consent status)
│   ├── /employer/employees (Roster management: add, edit, toggle consent, CSV import/export)
│   ├── /employer/journeys (Employee travel logs, arrival verification, corridor filters)
│   ├── /employer/delays (Automated delay verification certificates with waiver recommendations)
│   ├── /employer/analytics (Punctuality trends, congestion corridor breakdowns, hours lost)
│   ├── /employer/reports (Monthly executive commute audits with @media print styling)
│   ├── /employer/privacy (Strict consent agreements & compliance audits)
│   ├── /employer/data (Import/export employee rosters & travel records)
│   └── /employer/settings (Shift schedules, delay grace thresholds, notification policies)
│
├── 🚦 Traffic Authority Portal (/authority/*)
│   ├── /authority/overview (Municipal incident command center, severity counters, response status)
│   ├── /authority/incidents (Incident triage queue, dispatch assignment, status progression)
│   ├── /authority/hotspots (Chokepoint dossier: causes, peak hours, recommendations)
│   ├── /authority/recurring (Day-of-week recurrence patterns & structural bottlenecks)
│   ├── /authority/investigation (Chronological "Traffic Story" forensic narrative card)
│   ├── /authority/analytics (Municipal response times, clearance curves, trend analysis)
│   ├── /authority/reports (Monthly municipal infrastructure & audit dossier)
│   ├── /authority/data (Import real road incident datasets via CSV)
│   └── /authority/settings (Dispatch zones, severity triggers, SLA targets)
│
└── 🔒 Admin Data Console (/admin)
    └── Global dataset inspector, one-click CSV template download, seed loader, and clean reset
```

---

## 📊 Strict Honest Data Policy

- **Zero Fake Business Data Inflation**: The platform does not display fabricated metrics.
- **Computed Aggregations**: All KPIs, counts, averages, and charts are derived dynamically from actual records in memory/LocalStorage.
- **Beautiful Empty States**: When datasets are cleared, pages render informative, polished empty states guiding the user on how to add or import data.
- **Full CSV Data Pipeline**: Support for importing and exporting:
  - Incident logs (`category`, `road_name`, `severity`, `trust_score`, `lat`, `lng`, etc.)
  - Employee rosters (`name`, `department`, `route_name`, `consent_status`, `shift_time`, etc.)
  - Journey records (`employee_name`, `origin`, `destination`, `delay_minutes`, `status`, etc.)

---

## 🔬 Core Signatures & Frameworks

### 1. The 8-Step Evidence Chain
```
INCIDENT → CITIZEN REPORT → GPS LOCATION → MATCHING REPORTS → SENSOR TELEMETRY → VERIFICATION → ROAD ALERT → MUNICIPAL ANALYSIS
```

### 2. The 6-Stage TrustScore Timeline
- **Level 1 (20%):** Citizen Reported (Crowdsourced notice)
- **Level 2 (40%):** GPS Location Confirmed (Device proximity < 50m of road axis)
- **Level 3 (60%):** Multiple Matching Reports (Consensus clustering)
- **Level 4 (75%):** Telemetry Validated (Stall speeds < 5 km/h)
- **Level 5 (90%):** Forensic Evidence (EXIF metadata & media)
- **Level 6 (100%):** Authority Certified (Official municipal dispatch stamp)

### 3. "Why is this road affected?" Modal
Available across alerts and maps. Explains:
- Root cause breakdown (weather, breakdown, lane closure)
- Verified evidence supporting the alert
- Recommended driver actions & alternate corridors

### 4. Forensic "Traffic Story" Narrative
Synthesizes timestamps, initial citizen report, telemetry confirmation, authority dispatch, and clearance status into a chronological timeline narrative for urban planners and traffic commissioners.

---

## 💻 Tech Stack

- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (Navy / Charcoal dark surfaces, Electric cyan & teal accents)
- **Maps:** Leaflet & OpenStreetMap (CartoDB Voyager dark/light tiles)
- **Charts:** Recharts (Responsive Area, Bar, Pie charts)
- **Icons:** Lucide React
- **Browser APIs:** HTML5 Geolocation API, MediaRecorder API, FileReader API
- **Storage:** LocalStorage with dynamic cross-tab synchronization

---

## 🚀 Running the Project Locally

```bash
# 1. Navigate to the project root
cd "C:\Users\Yukta A G\.gemini\antigravity\scratch\roadtruth"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the local development server
npm run dev
# The application will launch at http://localhost:5174/ (or http://localhost:5173/)

# 4. Build for production
npm run build
```

---

## 🔄 Simulated Demo Data vs. Production Integration Roadmap

| Module | Current Client-Side Implementation | Enterprise Production Integration |
|---|---|---|
| **Role Authentication** | Instant demo switcher + LocalStorage session | OAuth2 / OIDC / SAML SSO with JWT bearer tokens |
| **GPS Tracking** | Browser Geolocation API + simulated vehicle progression | Native iOS / Android Background Geofencing SDK |
| **Traffic Telemetry** | Mathematical route delay matrix based on active incident count | Live Google Maps Platform / TomTom / HERE Traffic API stream |
| **Media Verification** | Local Base64 FileReader preview + client EXIF parsing | Amazon S3 / Cloud Storage with serverless EXIF sanitization & anti-spoofing |
| **Real-time Alerts** | Dynamic React Context state | WebSockets (Socket.IO) / Server-Sent Events (SSE) / Push API |
| **Municipal Dispatch** | Frontend state escalation and audit trail log | City Traffic Control (CAD / ATCS) REST API webhook bridge |
| **Data Persistence** | HTML5 LocalStorage with CSV import/export | PostgreSQL with PostGIS extension + Prisma / TypeORM |
