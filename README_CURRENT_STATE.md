# RouteWise AI — Complete Project (Current State)

This archive contains the complete, working, integrated **RouteWise AI** Smart Mobility & Traffic Intelligence platform as of October 24, 2026.

> **Important**: This README accurately describes the project in its current state and does not represent newly added or modified functionality.

---

## 1. Project Overview & Current Technology Stack

RouteWise AI connects citizen crowdsourced incident reporting, automated multi-factor TrustScore verification, real-time XGBoost ML congestion forecasting, multi-route alternative comparison, and dedicated workforce commute intelligence.

* **Frontend**:
  * React 18 + Vite
  * Tailwind CSS
  * React Router v6
  * Lucide React Icons
  * Leaflet / OpenStreetMap (interactive map layers, custom markers, live route paths)
  * Recharts (traffic trend charts)
* **Backend**:
  * Python 3.11+ / 3.14
  * Flask + Flask-CORS
  * Flask-SQLAlchemy (SQLite database at `backend/instance/roadtruth.sqlite3`)
  * REST API architecture with role-based JWT authentication
* **Machine Learning / AI Engine**:
  * XGBoost Regressor (`routewise_xgboost_congestion_regressor.joblib`)
  * XGBoost Classifier (`routewise_xgboost_congestion_classifier.joblib`)
  * Trained on real Bangalore Traffic Pulse dataset (14 input features, $R^2 = 0.9645$, $\text{MAE} = 2.93$, $\text{Accuracy} = 94.11\%$)
  * Integrated directly via Flask blueprint `/api/ml/predict`

---

## 2. Directory Structure

```text
RouteWise_AI/
│
├── frontend/                                # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/                     # Layouts, Navigation, Modals, Cards
│   │   ├── context/                        # RouteWiseContext (global state, theme, auth)
│   │   ├── pages/
│   │   │   ├── public/                     # LandingPage, RoleSelectionPage, LoginPage, RegisterPage
│   │   │   ├── passenger/                  # PassengerDashboard, RoutePlanner, MyJourneys
│   │   │   ├── employer/                   # EmployerDashboard, CommuteFleet, DelayReports
│   │   │   └── authority/                  # AuthorityDashboard, HotspotInspector, AuditLogs
│   │   ├── services/                       # api.js (REST API client, auth & ML endpoints)
│   │   ├── App.jsx                         # Main application routes & ProtectedRoute guards
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/                                 # Flask + SQLAlchemy Backend Application
│   ├── backend/
│   │   ├── api/
│   │   │   ├── ml_routes.py                # ML prediction endpoint (/api/ml/predict)
│   │   │   └── ...
│   │   ├── artifacts/                      # Model artifacts loaded by Flask
│   │   │   ├── routewise_xgboost_congestion_regressor.joblib
│   │   │   ├── routewise_xgboost_congestion_classifier.joblib
│   │   │   ├── dataset_profile.json
│   │   │   └── metrics.json
│   │   ├── instance/
│   │   │   └── roadtruth.sqlite3           # SQLite database with schema & seed accounts
│   │   ├── app.py                          # Main Flask application & blueprint registration
│   │   ├── auth_service.py                 # JWT token generation, role verification, police badge auth
│   │   ├── models.py                       # User, Incident, Journey, Organization models
│   │   ├── predict.py                      # Real-time XGBoost inference pipeline
│   │   ├── proximity.py                    # Geo-spatial clustering & corridor proximity
│   │   └── routing_service.py              # OSRM alternative route calculation
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
├── ml/                                      # Standalone Machine Learning Package & Training Pipeline
│   ├── data/
│   │   ├── Banglore_traffic_Dataset.csv    # Real training dataset
│   │   └── banglore_traffic_cleaned_enriched.csv
│   ├── artifacts/                          # Standalone model checkpoints & evaluation metrics
│   ├── train_model.py                      # Retraining script with cross-validation
│   ├── predict.py                          # Standalone CLI / batch prediction script
│   └── README.md                           # Detailed ML documentation
│
└── README_CURRENT_STATE.md
```

---

## 3. How to Run the Application

### A. Start the Backend API
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
* Backend runs on: `http://127.0.0.1:5000`
* API Base URL: `http://127.0.0.1:5000/api`
* Health Check: `http://127.0.0.1:5000/api/health`

### B. Start the Frontend UI
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs on: `http://localhost:5173` (or `5174`)

---

## 4. Default Seed Credentials

| Role | Username / Identifier | Password | Default Portal |
| :--- | :--- | :--- | :--- |
| **Passenger** | `commuter@routewise.ai` | `password123` | `/passenger` |
| **Employer** | `admin@techcorp.com` | `password123` | `/employer` |
| **Traffic Authority** | `BLRP001` *(Badge)* or `officer.sharma@blr.police.gov.in` | `officer123` | `/authority` |
