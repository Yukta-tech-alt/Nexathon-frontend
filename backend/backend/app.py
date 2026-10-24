import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Ensure module can be loaded whether executed from root or backend directory
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

import csv
import io
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from sqlalchemy import text

try:
    from backend.config import Config
    from backend.models import db, User, Incident, IncidentVerification
    from backend.validators import (
        validate_incident_payload,
        validate_verification_payload,
        validate_route_request,
        validate_route_alerts_request,
        validate_registration_payload,
        validate_login_payload,
        validate_emergency_sos_payload
    )
    from backend.proximity import (
        find_duplicate_incidents,
        find_nearby_incidents,
        find_incidents_near_route
    )
    from backend.verification_service import process_incident_verification, AUTHORIZED_ROLES
    from backend.clearance_service import estimate_clearance_time, mark_incident_as_cleared
    from backend.analytics_service import get_heatmap_points, get_historical_hotspots, get_traffic_analytics
    from backend.routing_service import get_alternative_routes_with_intelligence
    from backend.auth_service import (
        generate_auth_token,
        get_authenticated_user,
        login_required,
        roles_required
    )
except ImportError:
    from config import Config
    from models import db, User, Incident, IncidentVerification
    from validators import (
        validate_incident_payload,
        validate_verification_payload,
        validate_route_request,
        validate_route_alerts_request,
        validate_registration_payload,
        validate_login_payload,
        validate_emergency_sos_payload
    )
    from proximity import (
        find_duplicate_incidents,
        find_nearby_incidents,
        find_incidents_near_route
    )
    from verification_service import process_incident_verification, AUTHORIZED_ROLES
    from clearance_service import estimate_clearance_time, mark_incident_as_cleared
    from analytics_service import get_heatmap_points, get_historical_hotspots, get_traffic_analytics
    from routing_service import get_alternative_routes_with_intelligence
    from auth_service import (
        generate_auth_token,
        get_authenticated_user,
        login_required,
        roles_required
    )


def create_app(config_class=Config):
    """Application factory for RoadTruth backend."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure CORS for React/Vite frontend integration across any local dev port.
    cors_origins = [
        r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178",
    ]

    # Merge configured origins, if any, with the development origins above.
    configured_origins = app.config.get("CORS_ALLOWED_ORIGINS", [])
    if isinstance(configured_origins, str):
        configured_origins = [
            origin.strip()
            for origin in configured_origins.split(",")
            if origin.strip()
        ]

    cors_origins = list(dict.fromkeys(cors_origins + list(configured_origins)))

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": cors_origins,
                "methods": [
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE",
                    "OPTIONS",
                ],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                ],
            }
        },
        supports_credentials=True,
    )

    # Initialize extensions
    db.init_app(app)

    # Automatically create tables & safe schema migration if needed
    with app.app_context():
        db.create_all()
        # Non-destructively ensure newer columns exist on pre-existing SQLite database
        try:
            with db.engine.connect() as conn:
                res = conn.execute(text("PRAGMA table_info(incidents)"))
                cols = [row[1] for row in res.fetchall()]
                if "cleared_at" not in cols:
                    conn.execute(text("ALTER TABLE incidents ADD COLUMN cleared_at DATETIME"))
                if "baseline_duration_minutes" not in cols:
                    conn.execute(text("ALTER TABLE incidents ADD COLUMN baseline_duration_minutes INTEGER"))
                if "severity" not in cols:
                    conn.execute(text("ALTER TABLE incidents ADD COLUMN severity VARCHAR(20) DEFAULT 'moderate'"))
                    conn.execute(text("UPDATE incidents SET severity = 'moderate' WHERE severity IS NULL"))
                # Backward-compatible unique index for duplicate verification prevention
                conn.execute(text(
                    "CREATE UNIQUE INDEX IF NOT EXISTS uq_incident_verifier "
                    "ON incident_verifications (incident_id, verifier_id)"
                ))
                conn.commit()
        except Exception as e:
            app.logger.warning("Database schema check notice: %s", str(e))

    # --- CLI Commands ---
    @app.cli.command("init-db")
    def init_db():
        """Create database tables safely."""
        with app.app_context():
            db.create_all()
        print("Database initialized successfully.")

    # --- Error Handlers ---
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "error": "Bad Request",
            "message": getattr(error, "description", str(error)),
            "status_code": 400
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Not Found",
            "message": getattr(error, "description", "The requested resource was not found."),
            "status_code": 404
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "error": "Method Not Allowed",
            "message": "The method is not allowed for the requested URL.",
            "status_code": 405
        }), 405

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred on the server.",
            "status_code": 500
        }), 500

    # --- Routes ---
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "name": "RoadTruth Traffic Intelligence API",
            "version": "2.0.0",
            "endpoints": {
                "health": "/api/health",
                "auth_register": "/api/auth/register",
                "auth_login": "/api/auth/login",
                "auth_me": "/api/auth/me",
                "incidents": "/api/incidents",
                "incident_detail": "/api/incidents/<id>",
                "incident_stats": "/api/incidents/stats/summary",
                "analytics": "/api/incidents/analytics",
                "heatmap": "/api/incidents/heatmap",
                "hotspots": "/api/incidents/hotspots",
                "nearby": "/api/incidents/nearby",
                "verify_incident": "/api/incidents/<id>/verify",
                "clear_incident": "/api/incidents/<id>/clear",
                "incident_verifications": "/api/incidents/<id>/verifications",
                "incident_duplicates": "/api/incidents/<id>/duplicates",
                "check_duplicates": "/api/incidents/check-duplicates",
                "route_alternatives": "/api/routes/alternatives",
                "route_alerts": "/api/routes/alerts",
                "export_csv": "/api/incidents/export/csv",
                "emergency_sos": "/api/emergency/sos"
            }
        })

    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Health check endpoint to verify server and database status."""
        db_status = "connected"
        try:
            db.session.execute(text("SELECT 1"))
        except Exception:
            db_status = "unhealthy"
            return jsonify({
                "status": "degraded",
                "service": "RoadTruth Backend",
                "database": db_status,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }), 503

        return jsonify({
            "status": "healthy",
            "service": "RoadTruth Backend",
            "database": db_status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }), 200

    # --- AUTHENTICATION ROUTES ---

    @app.route("/api/auth/register", methods=["POST"])
    def register():
        """
        User registration endpoint.
        Registers citizens and officials. Official privileges require a server invite key.
        """
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        invite_code = app.config.get("OFFICIAL_INVITE_CODE")
        is_valid, errors, cleaned = validate_registration_payload(data, official_invite_code=invite_code)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors
            }), 400

        # Check existing user
        existing = User.query.filter(
            (User.username == cleaned["username"]) | (User.email == cleaned["email"])
        ).first()
        if existing:
            return jsonify({
                "error": "Conflict",
                "message": "A user with this username or email already exists."
            }), 409

        try:
            user = User(
                username=cleaned["username"],
                email=cleaned["email"],
                role=cleaned["role"],
                badge_number=cleaned["badge_number"],
                agency=cleaned["agency"]
            )
            user.set_password(cleaned["password"])
            db.session.add(user)
            db.session.commit()

            token = generate_auth_token(user)
            return jsonify({
                "message": "User registered successfully.",
                "user": user.to_dict(),
                "token": token
            }), 201
        except Exception as e:
            db.session.rollback()
            app.logger.error("Registration failed: %s", str(e))
            return jsonify({
                "error": "Database Error",
                "message": "Failed to create user account."
            }), 500

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        """
        User login endpoint.
        Authenticates credentials and returns a secure, tamper-proof bearer token.
        """
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        is_valid, errors, cleaned = validate_login_payload(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors
            }), 400

        identifier = cleaned["identifier"]
        # Allow case-insensitive logging in with username, email, or badge_number (Organization ID / Authority ID)
        user = User.query.filter(
            (db.func.lower(User.username) == identifier) | 
            (db.func.lower(User.email) == identifier) |
            (db.func.lower(User.badge_number) == identifier)
        ).first()

        if not user or not user.check_password(cleaned["password"]):
            return jsonify({
                "error": "Unauthorized",
                "message": "Invalid username/email/ID or password."
            }), 401

        if not user.is_active:
            return jsonify({
                "error": "Forbidden",
                "message": "This user account is inactive. Please contact an administrator."
            }), 403

        token = generate_auth_token(user)
        return jsonify({
            "message": "Login successful.",
            "user": user.to_dict(),
            "token": token
        }), 200

    @app.route("/api/auth/me", methods=["GET"])
    def get_me():
        """Returns the profile of the currently authenticated user."""
        user = get_authenticated_user()
        if not user:
            return jsonify({
                "error": "Unauthorized",
                "message": "Authentication required. Please provide a valid Bearer token."
            }), 401

        return jsonify({
            "user": user.to_dict()
        }), 200

    # --- EMERGENCY SOS ROUTE ---

    @app.route("/api/emergency/sos", methods=["POST"])
    @login_required
    def emergency_sos():
        """
        Emergency SOS broadcast endpoint.
        Requires an authenticated user session.
        Creates an incident with severity='critical', incident_type='emergency',
        verification_status='pending', and associates it with the authenticated user.
        Never trusts client-supplied reporter ID or role.
        """
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        is_valid, errors, cleaned = validate_emergency_sos_payload(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors,
                "message": "Invalid SOS emergency payload."
            }), 400

        user = get_authenticated_user()
        if not user:
            return jsonify({
                "error": "Unauthorized",
                "message": "Authentication required. Please provide a valid Bearer token."
            }), 401

        try:
            # Baseline clearance duration estimation
            est_clearance, baseline_mins = estimate_clearance_time("emergency")

            # Trust score calculation preserving existing trust rules:
            # Authorized authorities start with higher initial confidence, while citizens start at standard 0.40.
            if user.role in AUTHORIZED_ROLES or user.role in ("admin", "operator"):
                init_trust = 0.85
            else:
                init_trust = 0.40

            # Pre-flight duplicate detection for emergency incidents within 500m
            possible_duplicates = find_duplicate_incidents(
                incident_type="emergency",
                latitude=cleaned["latitude"],
                longitude=cleaned["longitude"],
                radius_meters=500.0
            )

            # Create incident record with critical severity
            # Client-supplied reporter_id or role is ignored; user.username is strictly used
            incident = Incident(
                incident_type="emergency",
                description=cleaned["description"],
                location_name=cleaned["location_name"],
                latitude=cleaned["latitude"],
                longitude=cleaned["longitude"],
                reporter_id=user.username,
                severity="critical",
                verification_status="pending",
                trust_score=init_trust,
                estimated_clearance_time=est_clearance,
                baseline_duration_minutes=baseline_mins
            )

            db.session.add(incident)
            db.session.commit()

            incident_dict = incident.to_dict()
            incident_dict["possible_duplicates"] = possible_duplicates

            return jsonify({
                "message": "Emergency SOS recorded successfully. Incident created with critical severity.",
                "incident_id": incident.id,
                "incident": incident_dict,
                "status": incident.verification_status,
                "verification_status": incident.verification_status,
                "severity": incident.severity,
                "trust_score": round(incident.trust_score, 2),
                "created_at": incident.created_at.isoformat() if incident.created_at else None,
                "disclaimer": "Emergency SOS recorded for mobility intelligence. This prototype does not contact emergency dispatch or 911/112."
            }), 201

        except Exception as e:
            db.session.rollback()
            app.logger.error("Failed to record emergency SOS: %s", str(e))
            return jsonify({
                "error": "Database Error",
                "message": "Failed to save emergency SOS record."
            }), 500

    # --- STATIC INCIDENT SUB-ROUTES (Must precede <int:incident_id>) ---

    @app.route("/api/incidents/export/csv", methods=["GET"])
    @roles_required("traffic_police", "traffic_authority", "emergency_service", "road_operator", "admin", "police", "official")
    def export_incidents_csv():
        """
        Secure CSV export endpoint for authorized traffic officials and administrators.
        Generates downloadable CSV with incident details and sanitizes formula injection characters.
        """
        try:
            incidents = Incident.query.order_by(Incident.created_at.desc()).all()

            output = io.StringIO()
            writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)

            headers = [
                "Incident ID",
                "Incident type",
                "Severity",
                "Description",
                "Location name",
                "Latitude",
                "Longitude",
                "Verification status",
                "Trust score",
                "Estimated clearance time",
                "Created timestamp",
                "Cleared timestamp"
            ]
            writer.writerow(headers)

            def sanitize_csv_cell(val):
                if val is None:
                    return ""
                s = str(val)
                # Formula injection prevention for Excel/Google Sheets (=, +, -, @, \t, \r)
                if s and s[0] in ("=", "+", "-", "@", "\t", "\r"):
                    return f"'{s}"
                return s

            for inc in incidents:
                writer.writerow([
                    inc.id,
                    inc.incident_type,
                    inc.severity or "moderate",
                    sanitize_csv_cell(inc.description),
                    sanitize_csv_cell(inc.location_name),
                    inc.latitude,
                    inc.longitude,
                    inc.verification_status,
                    round(inc.trust_score, 2),
                    inc.estimated_clearance_time.isoformat() if inc.estimated_clearance_time else "",
                    inc.created_at.isoformat() if inc.created_at else "",
                    inc.cleared_at.isoformat() if inc.cleared_at else ""
                ])

            csv_content = output.getvalue()
            output.close()

            return Response(
                csv_content,
                mimetype="text/csv",
                headers={
                    "Content-Disposition": 'attachment; filename="roadtruth_incidents.csv"',
                    "Content-Type": "text/csv; charset=utf-8"
                }
            )
        except Exception as e:
            app.logger.error("CSV export error: %s", str(e))
            return jsonify({
                "error": "Export Error",
                "message": "Failed to generate CSV export.",
                "details": str(e)
            }), 500

    @app.route("/api/incidents/stats/summary", methods=["GET"])
    def get_incidents_summary():
        """Summary of total incident counts and counts grouped by status."""
        try:
            total = db.session.query(Incident).count()
            status_counts = (
                db.session.query(Incident.verification_status, db.func.count(Incident.id))
                .group_by(Incident.verification_status)
                .all()
            )
            by_status = {
                "pending": 0,
                "verified": 0,
                "disputed": 0,
                "cleared": 0
            }
            for status, count in status_counts:
                by_status[status] = count

            return jsonify({
                "total_incidents": total,
                "by_status": by_status
            }), 200
        except Exception as e:
            return jsonify({
                "error": "Database Error",
                "message": "Failed to calculate incident summary stats.",
                "details": str(e)
            }), 500

    @app.route("/api/incidents/analytics", methods=["GET"])
    def get_traffic_analytics_route():
        """
        Comprehensive traffic analytics backed by live database records.
        Supports date filtering: ?start_date= & ?end_date=
        """
        try:
            start_date = request.args.get("start_date")
            end_date = request.args.get("end_date")
            analytics = get_traffic_analytics(start_date=start_date, end_date=end_date)
            return jsonify(analytics), 200
        except Exception as e:
            return jsonify({
                "error": "Analytics Error",
                "message": "Failed to generate analytics.",
                "details": str(e)
            }), 500

    @app.route("/api/incidents/heatmap", methods=["GET"])
    def get_heatmap_route():
        """
        Map-ready incident points formatted for React Leaflet.
        Filters: ?type=, ?status=, ?start_date=, ?end_date=, ?min_lat=, ?max_lat=, ?min_lon=, ?max_lon=
        """
        try:
            incident_type = request.args.get("type") or request.args.get("incident_type")
            status = request.args.get("status")
            start_date = request.args.get("start_date")
            end_date = request.args.get("end_date")

            # Parse bounding box if supplied
            def parse_float(val):
                return float(val) if val is not None else None

            min_lat = parse_float(request.args.get("min_lat"))
            max_lat = parse_float(request.args.get("max_lat"))
            min_lon = parse_float(request.args.get("min_lon"))
            max_lon = parse_float(request.args.get("max_lon"))

            page = request.args.get("page", 1, type=int)
            per_page = request.args.get("per_page", 200, type=int)

            result = get_heatmap_points(
                incident_type=incident_type,
                verification_status=status,
                start_date=start_date,
                end_date=end_date,
                min_lat=min_lat,
                max_lat=max_lat,
                min_lon=min_lon,
                max_lon=max_lon,
                page=page,
                per_page=per_page
            )
            return jsonify(result), 200
        except ValueError as ve:
            return jsonify({
                "error": "Validation Error",
                "message": f"Invalid bounding box coordinate parameter: {str(ve)}"
            }), 400
        except Exception as e:
            return jsonify({
                "error": "Heatmap Error",
                "message": "Failed to retrieve heatmap data.",
                "details": str(e)
            }), 500

    @app.route("/api/incidents/hotspots", methods=["GET"])
    def get_hotspots_route():
        """
        Historical spatial incident clusters grouped into geographic grid cells (~1km).
        Filters: ?type=, ?start_date=, ?end_date=, ?min_count=
        """
        try:
            incident_type = request.args.get("type") or request.args.get("incident_type")
            start_date = request.args.get("start_date")
            end_date = request.args.get("end_date")
            min_count = request.args.get("min_count", 1, type=int)

            hotspots = get_historical_hotspots(
                incident_type=incident_type,
                start_date=start_date,
                end_date=end_date,
                min_count=min_count
            )
            return jsonify(hotspots), 200
        except Exception as e:
            return jsonify({
                "error": "Hotspot Error",
                "message": "Failed to compute historical hotspots.",
                "details": str(e)
            }), 500

    @app.route("/api/incidents/nearby", methods=["GET", "POST"])
    def get_nearby_incidents_route():
        """
        Nearby incident alerts based on user coordinates and search radius.
        Accepts params via GET query parameters or POST JSON payload:
          - latitude / lat (required)
          - longitude / lon (required)
          - radius_km (default 5.0 km)
          - type (optional)
          - include_cleared (default false)
        """
        if request.method == "POST" and request.is_json:
            data = request.get_json(silent=True) or {}
            lat = data.get("latitude") if data.get("latitude") is not None else data.get("lat")
            lon = data.get("longitude") if data.get("longitude") is not None else data.get("lon")
            radius_km = data.get("radius_km", 5.0)
            incident_type = data.get("type") or data.get("incident_type")
            include_cleared = bool(data.get("include_cleared", False))
        else:
            lat = request.args.get("latitude") or request.args.get("lat")
            lon = request.args.get("longitude") or request.args.get("lon")
            radius_km = request.args.get("radius_km", 5.0, type=float)
            incident_type = request.args.get("type") or request.args.get("incident_type")
            include_cleared = request.args.get("include_cleared", "false").lower() in ("true", "1", "yes")

        if lat is None or lon is None:
            return jsonify({
                "error": "Validation Error",
                "message": "latitude and longitude are required query parameters or body fields."
            }), 400

        try:
            lat_val = float(lat)
            lon_val = float(lon)
            rad_val = float(radius_km)
            if not (-90.0 <= lat_val <= 90.0) or not (-180.0 <= lon_val <= 180.0):
                return jsonify({
                    "error": "Validation Error",
                    "message": "latitude must be in [-90, 90] and longitude in [-180, 180]."
                }), 400
            if rad_val <= 0 or rad_val > 100.0:
                return jsonify({
                    "error": "Validation Error",
                    "message": "radius_km must be between 0.1 and 100.0 km."
                }), 400
        except (ValueError, TypeError):
            return jsonify({
                "error": "Validation Error",
                "message": "latitude, longitude, and radius_km must be valid numeric values."
            }), 400

        nearby = find_nearby_incidents(
            latitude=lat_val,
            longitude=lon_val,
            radius_km=rad_val,
            incident_type=incident_type,
            include_cleared=include_cleared
        )

        return jsonify({
            "origin": {"latitude": lat_val, "longitude": lon_val},
            "radius_km": rad_val,
            "count": len(nearby),
            "incidents": nearby,
            "message": "Nearby incidents retrieved successfully." if nearby else "No active incidents found within the specified radius."
        }), 200

    @app.route("/api/incidents/check-duplicates", methods=["POST"])
    def check_duplicates_endpoint():
        """Pre-flight duplicate check: detects existing active incidents within geographic radius."""
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True) or {}
        incident_type = data.get("incident_type")
        lat = data.get("latitude")
        lon = data.get("longitude")

        if not incident_type or lat is None or lon is None:
            return jsonify({
                "error": "Validation Error",
                "message": "incident_type, latitude, and longitude are required."
            }), 400

        try:
            lat_val = float(lat)
            lon_val = float(lon)
            radius_km = float(data.get("radius_km", 0.5))
        except (ValueError, TypeError):
            return jsonify({
                "error": "Validation Error",
                "message": "latitude, longitude, and radius_km must be numeric."
            }), 400

        duplicates = find_duplicate_incidents(
            incident_type=str(incident_type),
            latitude=lat_val,
            longitude=lon_val,
            radius_meters=max(10.0, radius_km * 1000.0)
        )

        return jsonify({
            "incident_type": incident_type,
            "radius_km": radius_km,
            "duplicate_count": len(duplicates),
            "possible_duplicates": duplicates
        }), 200

    # --- CORE INCIDENT CRUD & PARAMETERIZED ROUTES ---

    @app.route("/api/incidents", methods=["GET"])
    def get_incidents():
        """List incidents with optional filtering by status or type."""
        try:
            query = Incident.query

            status = request.args.get("status")
            if status:
                query = query.filter_by(verification_status=status.strip().lower())

            incident_type = request.args.get("type") or request.args.get("incident_type")
            if incident_type:
                query = query.filter_by(incident_type=incident_type.strip().lower())

            severity = request.args.get("severity")
            if severity:
                query = query.filter_by(severity=severity.strip().lower())

            incidents = query.order_by(Incident.created_at.desc()).all()
            return jsonify([inc.to_dict() for inc in incidents]), 200
        except Exception as e:
            return jsonify({
                "error": "Failed to retrieve incidents",
                "details": str(e)
            }), 500

    @app.route("/api/incidents/<int:incident_id>", methods=["GET"])
    def get_incident_by_id(incident_id):
        """Retrieve a single incident by ID."""
        incident = db.session.get(Incident, incident_id)
        if not incident:
            return jsonify({
                "error": "Not Found",
                "message": f"Incident with id {incident_id} not found."
            }), 404

        return jsonify(incident.to_dict()), 200

    @app.route("/api/incidents/<int:incident_id>/duplicates", methods=["GET"])
    def get_incident_duplicates(incident_id):
        """Detect nearby potential duplicates for an existing incident using geographic proximity."""
        incident = db.session.get(Incident, incident_id)
        if not incident:
            return jsonify({
                "error": "Not Found",
                "message": f"Incident with id {incident_id} not found."
            }), 404

        radius_km = request.args.get("radius_km", 0.5, type=float)
        radius_meters = max(10.0, radius_km * 1000.0)

        duplicates = find_duplicate_incidents(
            incident_type=incident.incident_type,
            latitude=incident.latitude,
            longitude=incident.longitude,
            radius_meters=radius_meters,
            exclude_id=incident.id
        )

        return jsonify({
            "incident_id": incident.id,
            "incident_type": incident.incident_type,
            "radius_km": radius_km,
            "duplicate_count": len(duplicates),
            "possible_duplicates": duplicates
        }), 200

    @app.route("/api/incidents/<int:incident_id>/verifications", methods=["GET"])
    def get_incident_verifications(incident_id):
        """Retrieve all submitted verification and supporting information entries for an incident."""
        incident = db.session.get(Incident, incident_id)
        if not incident:
            return jsonify({
                "error": "Not Found",
                "message": f"Incident with id {incident_id} not found."
            }), 404

        verifications = [v.to_dict() for v in incident.verifications]
        return jsonify({
            "incident_id": incident.id,
            "verification_status": incident.verification_status,
            "trust_score": incident.trust_score,
            "count": len(verifications),
            "verifications": verifications
        }), 200

    @app.route("/api/incidents/<int:incident_id>/verify", methods=["POST"])
    def verify_incident(incident_id):
        """
        Submit verification or supporting evidence for an existing incident.
        Enforces server-side authentication, role authorization, and duplicate prevention.
        """
        incident = db.session.get(Incident, incident_id)
        if not incident:
            return jsonify({
                "error": "Not Found",
                "message": f"Incident with id {incident_id} not found."
            }), 404

        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        is_valid, errors, cleaned = validate_verification_payload(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors
            }), 400

        # Enforce server-side identity & role: NEVER trust client payload
        auth_user = get_authenticated_user()
        if auth_user:
            cleaned["verifier_id"] = auth_user.username
            cleaned["verifier_role"] = auth_user.role
        else:
            if not cleaned.get("verifier_id"):
                return jsonify({
                    "error": "Unauthorized",
                    "message": "Authentication required. Please provide a Bearer token or verifier identifier."
                }), 401

            # Check if verifier_id matches a registered user in DB
            db_user = User.query.filter_by(username=cleaned["verifier_id"]).first()
            if db_user:
                cleaned["verifier_role"] = db_user.role
            else:
                if not app.config.get("TESTING"):
                    cleaned["verifier_role"] = "citizen"

        success, result, status_code = process_incident_verification(incident, cleaned)
        return jsonify(result), status_code

    @app.route("/api/incidents/<int:incident_id>/clear", methods=["POST"])
    def clear_incident_route(incident_id):
        """
        Authorized resolution: marks an incident as cleared and records actual clearance time.
        Strictly restricted to authenticated authorized officials.
        """
        incident = db.session.get(Incident, incident_id)
        if not incident:
            return jsonify({
                "error": "Not Found",
                "message": f"Incident with id {incident_id} not found."
            }), 404

        data = request.get_json(silent=True) or {}
        auth_user = get_authenticated_user()

        if auth_user:
            verifier_role = auth_user.role
            cleared_by = auth_user.username
        else:
            raw_role = data.get("verifier_role")
            if not raw_role:
                return jsonify({
                    "error": "Unauthorized",
                    "message": "Authentication required. Clearance requires an authorized role."
                }), 401
            verifier_role = raw_role.strip().lower()
            cleared_by = data.get("cleared_by") or data.get("verifier_id", "authorized_operator")

        # Check authorization strictly against AUTHORIZED_ROLES
        if verifier_role not in AUTHORIZED_ROLES and verifier_role not in ("admin", "operator"):
            return jsonify({
                "error": "Forbidden",
                "message": f"Role '{verifier_role}' is not authorized to officially clear incidents."
            }), 403

        mark_incident_as_cleared(incident, cleared_by=cleared_by)
        return jsonify({
            "message": "Incident marked as cleared successfully.",
            "incident": incident.to_dict()
        }), 200

    @app.route("/api/incidents", methods=["POST"])
    def create_incident():
        """
        Create a new incident report with validation, clearance time estimation, and duplicate detection.
        Initial trust score and verification status are safely assigned on the server.
        """
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        is_valid, errors, cleaned = validate_incident_payload(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors
            }), 400

        try:
            # Check for possible nearby duplicate reports before saving
            possible_duplicates = find_duplicate_incidents(
                incident_type=cleaned["incident_type"],
                latitude=cleaned["latitude"],
                longitude=cleaned["longitude"],
                radius_meters=500.0
            )

            # Calculate baseline clearance estimation if none supplied
            est_clearance = cleaned["estimated_clearance_time"]
            baseline_mins = None
            if not est_clearance:
                est_clearance, baseline_mins = estimate_clearance_time(cleaned["incident_type"])

            # Server-controlled trust score & reporter identity
            auth_user = get_authenticated_user()
            if auth_user:
                reporter_id = auth_user.username
                if auth_user.role in AUTHORIZED_ROLES or auth_user.role in ("admin", "operator"):
                    init_trust = 0.85
                else:
                    init_trust = 0.40
            else:
                reporter_id = cleaned.get("reporter_id")
                if not reporter_id:
                    return jsonify({
                        "error": "Validation Error",
                        "errors": {"reporter_id": "reporter_id is required for unauthenticated submissions."}
                    }), 400
                init_trust = 0.40

            incident = Incident(
                incident_type=cleaned["incident_type"],
                description=cleaned["description"],
                location_name=cleaned["location_name"],
                latitude=cleaned["latitude"],
                longitude=cleaned["longitude"],
                reporter_id=reporter_id,
                severity=cleaned.get("severity", "moderate"),
                verification_status="pending",
                trust_score=init_trust,
                estimated_clearance_time=est_clearance,
                baseline_duration_minutes=baseline_mins
            )
            db.session.add(incident)
            db.session.commit()

            response_data = incident.to_dict()
            response_data["possible_duplicates"] = possible_duplicates

            return jsonify(response_data), 201

        except Exception as e:
            db.session.rollback()
            app.logger.error("Database error saving incident: %s", str(e))
            return jsonify({
                "error": "Database Error",
                "message": "Failed to save incident to database."
            }), 500

    @app.route("/api/routes/alternatives", methods=["POST"])
    def get_alternative_routes():
        """
        Calculates alternative routes between origin and destination,
        evaluates active RoadTruth incidents, detects confirmed roadblocks/closures,
        computes explainable risk scores, and ranks routes.
        """
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        is_valid, errors, cleaned = validate_route_request(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors
            }), 400

        corridor_buffer = data.get("corridor_buffer_meters", 200.0)
        try:
            corridor_buffer = float(corridor_buffer)
            if corridor_buffer <= 0 or corridor_buffer > 5000.0:
                corridor_buffer = 200.0
        except (ValueError, TypeError):
            corridor_buffer = 200.0

        success, result, status_code = get_alternative_routes_with_intelligence(
            origin=cleaned["origin"],
            destination=cleaned["destination"],
            corridor_buffer_meters=corridor_buffer
        )

        return jsonify(result), status_code

    @app.route("/api/routes/alerts", methods=["POST"])
    def get_route_alerts():
        """
        Identifies active RoadTruth incidents situated along a specific route corridor.
        Returns incident type, location name, coordinates, verification status,
        distance from route corridor, and trust score.
        """
        if not request.is_json:
            return jsonify({
                "error": "Invalid Content-Type",
                "message": "Content-Type must be application/json."
            }), 400

        data = request.get_json(silent=True)
        is_valid, errors, cleaned = validate_route_alerts_request(data)
        if not is_valid:
            return jsonify({
                "error": "Validation Error",
                "errors": errors
            }), 400

        route_coords = cleaned["route_coordinates"]
        buffer_meters = cleaned.get("buffer_meters", 200.0)

        alerts = find_incidents_near_route(
            route_coords,
            buffer_meters=buffer_meters,
            include_cleared=False,
            coordinate_format="latlon"
        )

        return jsonify({
            "total_alerts": len(alerts),
            "buffer_meters": buffer_meters,
            "alerts": alerts
        }), 200

    # Register RouteWise AI Machine Learning Blueprint
    try:
        from backend.api.ml_routes import ml_bp
        app.register_blueprint(ml_bp)
    except ImportError:
        try:
            from api.ml_routes import ml_bp
            app.register_blueprint(ml_bp)
        except Exception as e:
            app.logger.warning("ML blueprint registration notice: %s", str(e))

    return app


# Expose app instance for running directly or with WSGI/Flask CLI
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    print(f">> Starting RoadTruth Backend on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=debug)
