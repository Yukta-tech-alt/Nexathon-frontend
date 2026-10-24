import unittest
import json
from unittest.mock import patch
from datetime import datetime, timezone, timedelta
from backend.app import create_app
from backend.models import db, User, Incident, IncidentVerification
from backend.config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

class RoadTruthBackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    # =========================================================================
    # PHASE 1 & 2 REGRESSION TESTS
    # =========================================================================

    def test_health_endpoint(self):
        """Test GET /api/health returns 200 and database is connected."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["database"], "connected")
        self.assertIn("timestamp", data)
        self.assertIn("service", data)

    def test_index_endpoint(self):
        """Test GET / root endpoint returns API info and all endpoint routes."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("RoadTruth", data["name"])
        self.assertIn("heatmap", data["endpoints"])
        self.assertIn("hotspots", data["endpoints"])
        self.assertIn("nearby", data["endpoints"])
        self.assertIn("analytics", data["endpoints"])

    def test_create_incident_valid(self):
        """Test POST /api/incidents with valid data saves and returns incident JSON."""
        payload = {
            "incident_type": "accident",
            "description": "Two car collision on left lane",
            "location_name": "MG Road near Central Mall",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "reporter_id": "user_42",
            "verification_status": "pending",
            "trust_score": 0.95
        }
        response = self.client.post(
            "/api/incidents",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertIn("id", data)
        self.assertEqual(data["incident_type"], "accident")
        self.assertEqual(data["location_name"], "MG Road near Central Mall")
        self.assertEqual(data["latitude"], 12.9716)
        self.assertEqual(data["longitude"], 77.5946)
        self.assertEqual(data["reporter_id"], "user_42")
        self.assertEqual(data["verification_status"], "pending")
        self.assertIn("possible_duplicates", data)
        self.assertIn("estimated_clearance_time", data)

        # Verify saved in database
        saved = db.session.get(Incident, data["id"])
        self.assertIsNotNone(saved)
        self.assertEqual(saved.location_name, "MG Road near Central Mall")

    def test_create_incident_validation_errors(self):
        """Test POST /api/incidents validation rejects missing or out-of-range fields."""
        invalid_payload = {
            "incident_type": "",
            "location_name": "",
            "latitude": 150.0,
            "longitude": "not-a-number",
            "reporter_id": ""
        }
        response = self.client.post(
            "/api/incidents",
            data=json.dumps(invalid_payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertEqual(data["error"], "Validation Error")
        errors = data["errors"]
        self.assertIn("incident_type", errors)
        self.assertIn("location_name", errors)
        self.assertIn("latitude", errors)
        self.assertIn("longitude", errors)
        self.assertIn("reporter_id", errors)

    def test_get_incidents_list_and_filters(self):
        """Test GET /api/incidents returns list with filters for type and status."""
        inc1 = Incident(
            incident_type="accident",
            description="Minor scrape",
            location_name="Koramangala 80ft Rd",
            latitude=12.9352,
            longitude=77.6245,
            reporter_id="rep_1",
            verification_status="verified",
            trust_score=1.0
        )
        inc2 = Incident(
            incident_type="congestion",
            description="Heavy traffic jam",
            location_name="Hebbal Flyover",
            latitude=13.0358,
            longitude=77.5970,
            reporter_id="rep_2",
            verification_status="pending",
            trust_score=0.8
        )
        db.session.add_all([inc1, inc2])
        db.session.commit()

        # Fetch all
        res_all = self.client.get("/api/incidents")
        self.assertEqual(res_all.status_code, 200)
        data_all = res_all.get_json()
        self.assertIsInstance(data_all, list)
        self.assertEqual(len(data_all), 2)

        # Filter by status
        res_filtered_status = self.client.get("/api/incidents?status=verified")
        self.assertEqual(res_filtered_status.status_code, 200)
        data_status = res_filtered_status.get_json()
        self.assertEqual(len(data_status), 1)
        self.assertEqual(data_status[0]["verification_status"], "verified")

        # Filter by type
        res_filtered_type = self.client.get("/api/incidents?type=congestion")
        self.assertEqual(res_filtered_type.status_code, 200)
        data_type = res_filtered_type.get_json()
        self.assertEqual(len(data_type), 1)
        self.assertEqual(data_type[0]["incident_type"], "congestion")

    def test_get_incident_by_id(self):
        """Test GET /api/incidents/<id> for existing and non-existing records."""
        inc = Incident(
            incident_type="roadwork",
            description="Pothole repair work",
            location_name="Ring Road Outer",
            latitude=12.9200,
            longitude=77.6100,
            reporter_id="rep_road_team",
            verification_status="verified"
        )
        db.session.add(inc)
        db.session.commit()

        res = self.client.get(f"/api/incidents/{inc.id}")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["id"], inc.id)
        self.assertIn("verifications", data)

        res_404 = self.client.get("/api/incidents/999999")
        self.assertEqual(res_404.status_code, 404)

    def test_incidents_stats_summary(self):
        """Test GET /api/incidents/stats/summary returns total count and counts by status."""
        inc1 = Incident(
            incident_type="accident",
            location_name="Loc A",
            latitude=12.9,
            longitude=77.6,
            reporter_id="u1",
            verification_status="verified"
        )
        inc2 = Incident(
            incident_type="hazard",
            location_name="Loc B",
            latitude=12.91,
            longitude=77.61,
            reporter_id="u2",
            verification_status="pending"
        )
        db.session.add_all([inc1, inc2])
        db.session.commit()

        res = self.client.get("/api/incidents/stats/summary")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["total_incidents"], 2)
        self.assertEqual(data["by_status"]["verified"], 1)
        self.assertEqual(data["by_status"]["pending"], 1)

    # =========================================================================
    # PHASE 3 & 4: TRUST SCORING & CLEARANCE TIME TESTS
    # =========================================================================

    def test_initial_trust_score_default(self):
        """Test that a new incident without explicit score receives realistic conservative score (0.40)."""
        payload = {
            "incident_type": "accident",
            "location_name": "Indiranagar 12th Main",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "reporter_id": "fresh_reporter"
        }
        res = self.client.post("/api/incidents", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data["trust_score"], 0.40)
        # Automatic baseline clearance time calculated
        self.assertIsNotNone(data["estimated_clearance_time"])
        self.assertEqual(data["baseline_duration_minutes"], 60)

    def test_verify_self_corroboration_rejected(self):
        """Test that original reporter cannot corroborate their own incident report."""
        inc = Incident(
            incident_type="accident",
            location_name="Residency Road",
            latitude=12.9700,
            longitude=77.6000,
            reporter_id="driver_sam",
            verification_status="pending"
        )
        db.session.add(inc)
        db.session.commit()

        verify_payload = {
            "verifier_id": "driver_sam",
            "verifier_role": "citizen",
            "action": "confirm"
        }
        res = self.client.post(f"/api/incidents/{inc.id}/verify", data=json.dumps(verify_payload), content_type="application/json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.get_json()["error"], "Self-Verification Forbidden")

    def test_verify_by_authorized_official(self):
        """Test that an authorized agency (traffic_police) immediately verifies incident and sets trust=1.0."""
        inc = Incident(
            incident_type="accident",
            location_name="Indiranagar 100ft",
            latitude=12.9780,
            longitude=77.6400,
            reporter_id="citizen_jane",
            verification_status="pending",
            trust_score=0.40
        )
        db.session.add(inc)
        db.session.commit()

        verify_payload = {
            "verifier_id": "officer_kumar_44",
            "verifier_role": "traffic_police",
            "action": "confirm",
            "supporting_info": "Patrol vehicle on scene, tow truck en route",
            "evidence_url": "https://traffic.gov.in/evidence/report-44.jpg"
        }
        res = self.client.post(f"/api/incidents/{inc.id}/verify", data=json.dumps(verify_payload), content_type="application/json")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["incident"]["verification_status"], "verified")
        self.assertEqual(data["incident"]["trust_score"], 1.0)

    def test_verify_citizen_pending_then_consensus(self):
        """Test citizen confirmation increases trust but keeps pending until 3 confirmations reached."""
        inc = Incident(
            incident_type="congestion",
            location_name="Hebbal Flyover",
            latitude=13.0350,
            longitude=77.5970,
            reporter_id="commuter_alpha",
            verification_status="pending",
            trust_score=0.40
        )
        db.session.add(inc)
        db.session.commit()

        # 1st citizen confirmation
        res1 = self.client.post(
            f"/api/incidents/{inc.id}/verify",
            data=json.dumps({"verifier_id": "c1", "verifier_role": "citizen", "action": "confirm"}),
            content_type="application/json"
        )
        self.assertEqual(res1.status_code, 200)
        self.assertEqual(res1.get_json()["incident"]["verification_status"], "pending")
        self.assertGreater(res1.get_json()["incident"]["trust_score"], 0.40)

        # 2nd citizen confirmation
        res2 = self.client.post(
            f"/api/incidents/{inc.id}/verify",
            data=json.dumps({"verifier_id": "c2", "verifier_role": "citizen", "action": "confirm"}),
            content_type="application/json"
        )
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(res2.get_json()["incident"]["verification_status"], "pending")

        # 3rd citizen confirmation -> consensus reached!
        res3 = self.client.post(
            f"/api/incidents/{inc.id}/verify",
            data=json.dumps({"verifier_id": "c3", "verifier_role": "citizen", "action": "confirm"}),
            content_type="application/json"
        )
        self.assertEqual(res3.status_code, 200)
        self.assertEqual(res3.get_json()["incident"]["verification_status"], "verified")

    def test_verify_duplicate_verifier_rejected(self):
        """Test same user cannot verify the same incident multiple times."""
        inc = Incident(
            incident_type="hazard",
            location_name="Bannerghatta Rd",
            latitude=12.8900,
            longitude=77.5950,
            reporter_id="citizen_orig",
            verification_status="pending"
        )
        db.session.add(inc)
        db.session.commit()

        payload = {"verifier_id": "verifier_tom", "verifier_role": "citizen", "action": "confirm"}
        res1 = self.client.post(f"/api/incidents/{inc.id}/verify", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res1.status_code, 200)

        res2 = self.client.post(f"/api/incidents/{inc.id}/verify", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res2.status_code, 409)
        self.assertEqual(res2.get_json()["error"], "Duplicate Verification")

    def test_clear_incident_endpoint(self):
        """Test POST /api/incidents/<id>/clear marks incident cleared and sets timestamp."""
        inc = Incident(
            incident_type="roadwork",
            location_name="Outer Ring Road",
            latitude=12.9200,
            longitude=77.6800,
            reporter_id="rep_rw",
            verification_status="verified"
        )
        db.session.add(inc)
        db.session.commit()

        # Unauthorized citizen clear attempt
        res_unauth = self.client.post(
            f"/api/incidents/{inc.id}/clear",
            data=json.dumps({"verifier_role": "citizen"}),
            content_type="application/json"
        )
        self.assertEqual(res_unauth.status_code, 403)

        # Authorized official clear
        res = self.client.post(
            f"/api/incidents/{inc.id}/clear",
            data=json.dumps({"verifier_role": "traffic_police", "cleared_by": "dsp_patil"}),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()["incident"]
        self.assertEqual(data["verification_status"], "cleared")
        self.assertTrue(data["is_cleared"])
        self.assertIsNotNone(data["cleared_at"])

    # =========================================================================
    # PHASE 5: HEATMAP, HOTSPOTS & ANALYTICS TESTS
    # =========================================================================

    def test_heatmap_empty_and_populated(self):
        """Test GET /api/incidents/heatmap returns Leaflet-ready data with filters."""
        # Empty DB
        res_empty = self.client.get("/api/incidents/heatmap")
        self.assertEqual(res_empty.status_code, 200)
        self.assertEqual(res_empty.get_json()["count"], 0)

        # Populate incidents
        inc1 = Incident(
            incident_type="accident",
            location_name="Location Central",
            latitude=12.9716,
            longitude=77.5946,
            reporter_id="secret_user_1",
            verification_status="verified",
            trust_score=0.9
        )
        inc2 = Incident(
            incident_type="congestion",
            location_name="Location South",
            latitude=12.9100,
            longitude=77.6000,
            reporter_id="secret_user_2",
            verification_status="pending",
            trust_score=0.5
        )
        db.session.add_all([inc1, inc2])
        db.session.commit()

        res = self.client.get("/api/incidents/heatmap")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["count"], 2)
        # Verify reporter_id is not exposed in heatmap data
        for pt in data["points"]:
            self.assertNotIn("reporter_id", pt)
            self.assertIn("latitude", pt)
            self.assertIn("longitude", pt)
            self.assertIn("trust_score", pt)

        # Filter by bounding box
        res_bbox = self.client.get("/api/incidents/heatmap?min_lat=12.95&max_lat=13.00&min_lon=77.55&max_lon=77.65")
        self.assertEqual(res_bbox.status_code, 200)
        bbox_data = res_bbox.get_json()
        self.assertEqual(bbox_data["count"], 1)
        self.assertEqual(bbox_data["points"][0]["id"], inc1.id)

    def test_historical_hotspots_endpoint(self):
        """Test GET /api/incidents/hotspots groups incidents by spatial grid."""
        # Add 3 incidents in the same ~1km cell (12.97, 77.59)
        for i in range(3):
            db.session.add(Incident(
                incident_type="accident",
                location_name=f"Spot {i}",
                latitude=12.9710 + (i * 0.0002),
                longitude=77.5940 + (i * 0.0002),
                reporter_id=f"rep_{i}",
                verification_status="verified"
            ))
        db.session.commit()


        res = self.client.get("/api/incidents/hotspots")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertGreaterEqual(data["total_hotspots"], 1)
        self.assertIn("disclaimer", data)
        hotspot = data["hotspots"][0]
        self.assertEqual(hotspot["incident_count"], 3)
        self.assertEqual(hotspot["severity_level"], "medium")

    def test_analytics_comprehensive(self):
        """Test GET /api/incidents/analytics returns actual database counts."""
        db.session.add(Incident(
            incident_type="accident",
            location_name="Loc 1",
            latitude=12.9,
            longitude=77.6,
            reporter_id="u1",
            verification_status="verified",
            trust_score=0.9
        ))
        db.session.add(Incident(
            incident_type="roadwork",
            location_name="Loc 2",
            latitude=12.91,
            longitude=77.61,
            reporter_id="u2",
            verification_status="cleared",
            cleared_at=datetime.now(timezone.utc),
            trust_score=1.0
        ))
        db.session.commit()

        res = self.client.get("/api/incidents/analytics")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["total_incidents"], 2)
        self.assertEqual(data["resolved_incidents"], 1)
        self.assertEqual(data["unresolved_incidents"], 1)
        self.assertIn("accident", data["by_type"])
        self.assertIn("roadwork", data["by_type"])
        self.assertGreater(data["average_trust_score"], 0.8)

    # =========================================================================
    # PHASE 6: NEARBY ALERTS TESTS
    # =========================================================================

    def test_nearby_incidents_alerts(self):
        """Test GET and POST /api/incidents/nearby retrieves incidents within distance."""
        # Incident 1 at MG Road (origin)
        inc1 = Incident(
            incident_type="accident",
            location_name="MG Road",
            latitude=12.9716,
            longitude=77.5946,
            reporter_id="u_mg",
            verification_status="verified",
            trust_score=0.95
        )
        # Incident 2 at Brigade Road (~600 meters away)
        inc2 = Incident(
            incident_type="congestion",
            location_name="Brigade Road",
            latitude=12.9730,
            longitude=77.6000,
            reporter_id="u_brigade",
            verification_status="pending",
            trust_score=0.70
        )
        # Incident 3 at Hebbal (~12 km away)
        inc3 = Incident(
            incident_type="accident",
            location_name="Hebbal Flyover",
            latitude=13.0350,
            longitude=77.5970,
            reporter_id="u_hebbal",
            verification_status="verified",
            trust_score=0.95
        )
        db.session.add_all([inc1, inc2, inc3])
        db.session.commit()

        # Query nearby with radius 2.0 km around MG Road
        res = self.client.get("/api/incidents/nearby?latitude=12.9716&longitude=77.5946&radius_km=2.0")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["count"], 2)
        # Sorted closest first
        self.assertEqual(data["incidents"][0]["id"], inc1.id)
        self.assertLess(data["incidents"][0]["distance_meters"], 50)
        self.assertEqual(data["incidents"][1]["id"], inc2.id)

        # POST format test
        res_post = self.client.post(
            "/api/incidents/nearby",
            data=json.dumps({"lat": 12.9716, "lon": 77.5946, "radius_km": 1.0}),
            content_type="application/json"
        )
        self.assertEqual(res_post.status_code, 200)
        self.assertEqual(res_post.get_json()["count"], 2)

    def test_nearby_incidents_invalid_coords(self):
        """Test /api/incidents/nearby rejects invalid coordinates with 400."""
        res = self.client.get("/api/incidents/nearby?latitude=999&longitude=77.0")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.get_json()["error"], "Validation Error")

    def test_nearby_incidents_empty_radius(self):
        """Test /api/incidents/nearby returns clean empty array when no incidents in radius."""
        res = self.client.get("/api/incidents/nearby?latitude=0.0&longitude=0.0&radius_km=5.0")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["count"], 0)
        self.assertEqual(data["incidents"], [])

    # =========================================================================
    # TRAFFIC INTELLIGENCE & ROUTING TESTS (FEATURES 1 - 6)
    # =========================================================================

    def test_incident_categories_and_synonyms(self):
        """Test reporting all requested incident categories and colloquial synonyms."""
        categories_to_test = [
            ("Traffic congestion", "congestion"),
            ("Roadblock or road closure", "roadblock"),
            ("Roadwork or construction", "roadwork"),
            ("Vehicle breakdown", "breakdown"),
            ("Road hazard", "hazard"),
            ("Weather-related disruption", "weather"),
            ("Accident", "accident")
        ]

        for input_category, expected_normalized in categories_to_test:
            payload = {
                "incident_type": input_category,
                "description": f"Testing incident for {input_category}",
                "location_name": "Outer Ring Road",
                "latitude": 12.9200,
                "longitude": 77.6800,
                "reporter_id": "traffic_unit_1"
            }
            res = self.client.post("/api/incidents", data=json.dumps(payload), content_type="application/json")
            self.assertEqual(res.status_code, 201, f"Failed for category: {input_category}")
            data = res.get_json()
            self.assertEqual(data["incident_type"], expected_normalized)
            self.assertIsNotNone(data["estimated_clearance_time"])
            self.assertIsNotNone(data["baseline_duration_minutes"])
            self.assertGreater(data["baseline_duration_minutes"], 0)

    def test_route_alternatives_input_validation(self):
        """Test input validation for POST /api/routes/alternatives."""
        # Non-JSON
        res = self.client.post("/api/routes/alternatives", data="not json", content_type="text/plain")
        self.assertEqual(res.status_code, 400)

        # Missing origin
        res = self.client.post(
            "/api/routes/alternatives",
            data=json.dumps({"destination": {"latitude": 12.93, "longitude": 77.62}}),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("origin", res.get_json()["errors"])

        # Missing destination
        res = self.client.post(
            "/api/routes/alternatives",
            data=json.dumps({"origin": {"latitude": 12.97, "longitude": 77.59}}),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("destination", res.get_json()["errors"])

        # Out-of-range coordinates
        res = self.client.post(
            "/api/routes/alternatives",
            data=json.dumps({
                "origin": {"latitude": 999.0, "longitude": 77.59},
                "destination": {"latitude": 12.93, "longitude": 77.62}
            }),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 400)

        # Identical origin and destination
        res = self.client.post(
            "/api/routes/alternatives",
            data=json.dumps({
                "origin": {"latitude": 12.9716, "longitude": 77.5946},
                "destination": {"latitude": 12.9716, "longitude": 77.5946}
            }),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("destination", res.get_json()["errors"])

    @patch("backend.routing_service.fetch_osrm_routes")
    def test_route_alternatives_provider_failure(self, mock_fetch):
        """Test handling external routing provider failure gracefully without fabricating routes."""
        mock_fetch.return_value = (False, {
            "error": "Routing Service Unavailable",
            "message": "The external routing engine is currently unreachable."
        }, 503)

        payload = {
            "origin": {"latitude": 12.9716, "longitude": 77.5946},
            "destination": {"latitude": 12.9352, "longitude": 77.6245}
        }
        res = self.client.post("/api/routes/alternatives", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res.status_code, 503)
        data = res.get_json()
        self.assertEqual(data["error"], "Routing Service Unavailable")
        self.assertNotIn("routes", data)

    @patch("backend.routing_service.fetch_osrm_routes")
    def test_route_alternatives_ranking_and_closure_avoidance(self, mock_fetch):
        """Test that alternative routing avoids confirmed road closures and ranks cleaner routes first."""
        # Route 1: passes through (12.9600, 77.6000) where a confirmed roadblock is located
        route_1_coords = [[77.5946, 12.9716], [77.6000, 12.9600], [77.6245, 12.9352]]
        # Route 2: passes through (77.6150, 12.9550) where only a minor hazard is located
        route_2_coords = [[77.5946, 12.9716], [77.6150, 12.9550], [77.6245, 12.9352]]

        # Mock OSRM returning 2 alternative routes
        # Note: Route 1 is nominally faster/shorter in raw geometry, but blocked by closure!
        mock_osrm_response = {
            "code": "Ok",
            "routes": [
                {
                    "distance": 5000.0,
                    "duration": 600.0,  # 10 mins
                    "geometry": {
                        "type": "LineString",
                        "coordinates": route_1_coords
                    },
                    "legs": [{"summary": "Via Richmond Circle (Direct)"}]
                },
                {
                    "distance": 6200.0,
                    "duration": 780.0,  # 13 mins
                    "geometry": {
                        "type": "LineString",
                        "coordinates": route_2_coords
                    },
                    "legs": [{"summary": "Via Koramangala Link (Bypass)"}]
                }
            ]
        }
        mock_fetch.return_value = (True, mock_osrm_response, 200)

        # Insert confirmed Roadblock directly on Route 1
        closure_inc = Incident(
            incident_type="roadblock",
            location_name="Richmond Road Overpass",
            latitude=12.9600,
            longitude=77.6000,
            reporter_id="traffic_police_central",
            verification_status="verified",
            trust_score=1.0
        )
        # Insert minor breakdown on Route 2
        minor_inc = Incident(
            incident_type="breakdown",
            location_name="Koramangala 1st Block",
            latitude=12.9550,
            longitude=77.6150,
            reporter_id="commuter_99",
            verification_status="pending",
            trust_score=0.4
        )
        db.session.add_all([closure_inc, minor_inc])
        db.session.commit()

        payload = {
            "origin": {"latitude": 12.9716, "longitude": 77.5946},
            "destination": {"latitude": 12.9352, "longitude": 77.6245},
            "corridor_buffer_meters": 200.0
        }
        res = self.client.post("/api/routes/alternatives", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()

        self.assertEqual(data["total_routes_found"], 2)
        routes = data["routes"]
        self.assertEqual(len(routes), 2)

        # Route 2 (Bypass) must be ranked #1 and recommended because Route 1 has a verified closure!
        recommended = routes[0]
        discouraged = routes[1]

        self.assertEqual(recommended["rank"], 1)
        self.assertTrue(recommended["is_recommended"])
        self.assertFalse(recommended["has_confirmed_closure"])
        self.assertIn("Recommended", recommended["recommendation_reason"])
        self.assertEqual(recommended["duration_type"], "routing_engine_estimate")

        self.assertEqual(discouraged["rank"], 2)
        self.assertFalse(discouraged["is_recommended"])
        self.assertTrue(discouraged["has_confirmed_closure"])
        self.assertIn("closure", discouraged["recommendation_reason"].lower())

        # Check traffic disclaimer
        self.assertIn("traffic_disclaimer", data)
        self.assertIn("routing estimates", data["traffic_disclaimer"].lower())

    def test_route_alerts_endpoint(self):
        """Test POST /api/routes/alerts identifies incidents along a route corridor."""
        # Incident on route
        on_route_inc = Incident(
            incident_type="hazard",
            location_name="Hosur Main Road",
            latitude=12.9400,
            longitude=77.6200,
            reporter_id="citizen_alert_1",
            verification_status="verified",
            trust_score=0.88
        )
        # Incident far off route (>50 km away)
        off_route_inc = Incident(
            incident_type="accident",
            location_name="Far Highway",
            latitude=13.3500,
            longitude=77.8500,
            reporter_id="remote_user",
            verification_status="pending",
            trust_score=0.50
        )
        db.session.add_all([on_route_inc, off_route_inc])
        db.session.commit()

        # Alert corridor coordinates passing right through (12.9400, 77.6200)
        coords = [
            [77.6100, 12.9500],
            [77.6200, 12.9400],
            [77.6300, 12.9300]
        ]
        payload = {
            "route_coordinates": coords,
            "buffer_meters": 200.0
        }
        res = self.client.post("/api/routes/alerts", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()

        self.assertEqual(data["total_alerts"], 1)
        alert = data["alerts"][0]
        self.assertEqual(alert["incident_id"], on_route_inc.id)
        self.assertEqual(alert["incident_type"], "hazard")
        self.assertEqual(alert["location_name"], "Hosur Main Road")
        self.assertEqual(alert["verification_status"], "verified")
        self.assertEqual(alert["trust_score"], 0.88)
        self.assertLessEqual(alert["distance_from_route_meters"], 200.0)

        # Test invalid corridor request (fewer than 2 points)
        bad_res = self.client.post(
            "/api/routes/alerts",
            data=json.dumps({"route_coordinates": [[77.61, 12.95]]}),
            content_type="application/json"
        )
        self.assertEqual(bad_res.status_code, 400)

    def test_dashboard_analytics_and_hotspots_support_new_categories(self):
        """Test analytics and heatmap represent new categories without mislabeling as live speed sensors."""
        inc_cong = Incident(
            incident_type="congestion",
            location_name="Silk Board Junction",
            latitude=12.9175,
            longitude=77.6238,
            reporter_id="commuter_silk",
            verification_status="verified",
            trust_score=0.90
        )
        inc_roadwork = Incident(
            incident_type="roadwork",
            location_name="Whitefield Main Road",
            latitude=12.9698,
            longitude=77.7500,
            reporter_id="metro_authority",
            verification_status="verified",
            trust_score=0.95
        )
        db.session.add_all([inc_cong, inc_roadwork])
        db.session.commit()

        # Check analytics endpoint
        analytics_res = self.client.get("/api/incidents/analytics")
        self.assertEqual(analytics_res.status_code, 200)
        analytics_data = analytics_res.get_json()
        self.assertGreaterEqual(analytics_data["total_incidents"], 2)
        self.assertIn("congestion", analytics_data["by_type"])
        self.assertIn("roadwork", analytics_data["by_type"])

        # Check hotspots endpoint disclaimer
        hotspots_res = self.client.get("/api/incidents/hotspots")
        self.assertEqual(hotspots_res.status_code, 200)
        hotspots_data = hotspots_res.get_json()
        self.assertIn("disclaimer", hotspots_data)
        self.assertIn("not represent live traffic", hotspots_data["disclaimer"].lower())

    # =========================================================================
    # BACKEND SECURITY, AUTHENTICATION & ACCESS CONTROL TESTS
    # =========================================================================

    def test_auth_registration_and_login_flow(self):
        """Test user registration, duplicate rejection, login, and profile access."""
        # 1. Register citizen
        reg_payload = {
            "username": "citizen_rahul",
            "email": "rahul@example.com",
            "password": "SecurePassword123",
            "role": "citizen"
        }
        res_reg = self.client.post("/api/auth/register", data=json.dumps(reg_payload), content_type="application/json")
        self.assertEqual(res_reg.status_code, 201)
        data_reg = res_reg.get_json()
        self.assertIn("token", data_reg)
        self.assertEqual(data_reg["user"]["username"], "citizen_rahul")
        self.assertEqual(data_reg["user"]["role"], "citizen")
        self.assertNotIn("password_hash", data_reg["user"])

        # 2. Duplicate registration rejected
        res_dup = self.client.post("/api/auth/register", data=json.dumps(reg_payload), content_type="application/json")
        self.assertEqual(res_dup.status_code, 409)

        # 3. Login with correct credentials
        login_payload = {
            "username": "citizen_rahul",
            "password": "SecurePassword123"
        }
        res_login = self.client.post("/api/auth/login", data=json.dumps(login_payload), content_type="application/json")
        self.assertEqual(res_login.status_code, 200)
        token = res_login.get_json()["token"]
        self.assertIsNotNone(token)

        # 4. Login with invalid password rejected
        bad_login = {
            "username": "citizen_rahul",
            "password": "WrongPassword!"
        }
        res_bad = self.client.post("/api/auth/login", data=json.dumps(bad_login), content_type="application/json")
        self.assertEqual(res_bad.status_code, 401)

        # 5. Access profile with token
        res_me = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.get_json()["user"]["username"], "citizen_rahul")

        # 6. Access profile without token rejected
        res_me_unauth = self.client.get("/api/auth/me")
        self.assertEqual(res_me_unauth.status_code, 401)

    def test_official_registration_requires_invite_key(self):
        """Test that registering as traffic_police requires valid server-side invite code."""
        # Attempt without code -> 400
        bad_reg = {
            "username": "fake_officer",
            "email": "fake@police.gov",
            "password": "Password123",
            "role": "traffic_police"
        }
        res_bad = self.client.post("/api/auth/register", data=json.dumps(bad_reg), content_type="application/json")
        self.assertEqual(res_bad.status_code, 400)
        self.assertIn("official", res_bad.get_json()["errors"]["role"].lower())

        # Attempt with valid invite code -> 201
        valid_reg = {
            "username": "real_officer_sharma",
            "email": "sharma@trafficpolice.gov",
            "password": "OfficialPassword123",
            "role": "traffic_police",
            "official_key": "ROADTRUTH_OFFICIAL_AUTH_2026",
            "badge_number": "KA-TP-502",
            "agency": "Bengaluru Traffic Police"
        }
        res_ok = self.client.post("/api/auth/register", data=json.dumps(valid_reg), content_type="application/json")
        self.assertEqual(res_ok.status_code, 201)
        self.assertEqual(res_ok.get_json()["user"]["role"], "traffic_police")

    def test_client_role_tampering_prevented(self):
        """Test that a citizen cannot elevate to traffic_police by passing verifier_role in body."""
        # 1. Register citizen reporter & create incident
        u1 = User(username="reporter_user", email="rep@test.com", role="citizen")
        u1.set_password("pass123")
        db.session.add(u1)

        inc = Incident(
            incident_type="accident",
            location_name="Koramangala 80ft",
            latitude=12.9350,
            longitude=77.6200,
            reporter_id="reporter_user",
            verification_status="pending",
            trust_score=0.40
        )
        db.session.add(inc)

        # 2. Register citizen verifier
        u2 = User(username="citizen_verifier", email="ver@test.com", role="citizen")
        u2.set_password("pass123")
        db.session.add(u2)
        db.session.commit()

        # Login as citizen verifier
        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "citizen_verifier", "password": "pass123"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        # Citizen sends verify request claiming "verifier_role": "traffic_police" in payload
        tampered_payload = {
            "verifier_role": "traffic_police",
            "action": "confirm",
            "supporting_info": "Attempting unauthorized instant verification"
        }
        res = self.client.post(
            f"/api/incidents/{inc.id}/verify",
            data=json.dumps(tampered_payload),
            headers={"Authorization": f"Bearer {token}"},
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()

        # Server MUST enforce citizen role from user account, keeping status pending!
        self.assertEqual(data["verification"]["verifier_role"], "citizen")
        self.assertEqual(data["incident"]["verification_status"], "pending")

    def test_trust_score_and_status_tampering_prevented(self):
        """Test that client-supplied trust_score and verification_status are ignored upon creation."""
        payload = {
            "incident_type": "accident",
            "location_name": "MG Road Corner",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "reporter_id": "malicious_actor",
            "trust_score": 1.0,
            "verification_status": "verified"
        }
        res = self.client.post("/api/incidents", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res.status_code, 201)
        data = res.get_json()

        # Server overrides client values with safe initial status and trust score
        self.assertEqual(data["verification_status"], "pending")
        self.assertEqual(data["trust_score"], 0.40)

        # Verify database record matches
        saved = db.session.get(Incident, data["id"])
        self.assertEqual(saved.verification_status, "pending")
        self.assertEqual(saved.trust_score, 0.40)

    def test_incident_clearance_role_authorization(self):
        """Test clearance permissions: unauthenticated -> 401, citizen -> 403, official -> 200."""
        # Create incident
        inc = Incident(
            incident_type="roadblock",
            location_name="Bellandur Junction",
            latitude=12.9300,
            longitude=77.6700,
            reporter_id="commuter_b",
            verification_status="verified",
            trust_score=1.0
        )
        db.session.add(inc)

        # Register citizen
        cit = User(username="citizen_bob", email="bob@test.com", role="citizen")
        cit.set_password("pass123")
        # Register police
        cop = User(username="officer_rao", email="rao@police.gov", role="traffic_police")
        cop.set_password("pass123")
        db.session.add_all([cit, cop])
        db.session.commit()

        # Tokens
        cit_token = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "citizen_bob", "password": "pass123"}),
            content_type="application/json"
        ).get_json()["token"]

        cop_token = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "officer_rao", "password": "pass123"}),
            content_type="application/json"
        ).get_json()["token"]

        # 1. Unauthenticated clearance without role -> 401
        res_unauth = self.client.post(f"/api/incidents/{inc.id}/clear", data=json.dumps({}), content_type="application/json")
        self.assertEqual(res_unauth.status_code, 401)

        # 2. Citizen attempt to clear -> 403 Forbidden
        res_cit = self.client.post(
            f"/api/incidents/{inc.id}/clear",
            headers={"Authorization": f"Bearer {cit_token}"},
            content_type="application/json"
        )
        self.assertEqual(res_cit.status_code, 403)

        # 3. Official clearance -> 200 OK
        res_cop = self.client.post(
            f"/api/incidents/{inc.id}/clear",
            headers={"Authorization": f"Bearer {cop_token}"},
            content_type="application/json"
        )
        self.assertEqual(res_cop.status_code, 200)
        data = res_cop.get_json()["incident"]
        self.assertEqual(data["verification_status"], "cleared")
        self.assertTrue(data["is_cleared"])
        self.assertIsNotNone(data["cleared_at"])

    def test_self_verification_prevented_with_token(self):
        """Test authenticated user cannot verify their own reported incident."""
        user = User(username="driver_alice", email="alice@test.com", role="citizen")
        user.set_password("pass123")
        db.session.add(user)
        db.session.commit()

        token = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "driver_alice", "password": "pass123"}),
            content_type="application/json"
        ).get_json()["token"]

        # Alice creates incident while authenticated
        res_create = self.client.post(
            "/api/incidents",
            data=json.dumps({
                "incident_type": "hazard",
                "location_name": "Marathahalli Bridge",
                "latitude": 12.9550,
                "longitude": 77.7000
            }),
            headers={"Authorization": f"Bearer {token}"},
            content_type="application/json"
        )
        self.assertEqual(res_create.status_code, 201)
        inc_id = res_create.get_json()["id"]

        # Alice attempts to verify her own incident
        res_self = self.client.post(
            f"/api/incidents/{inc_id}/verify",
            data=json.dumps({"action": "confirm"}),
            headers={"Authorization": f"Bearer {token}"},
            content_type="application/json"
        )
        self.assertEqual(res_self.status_code, 400)
        self.assertEqual(res_self.get_json()["error"], "Self-Verification Forbidden")

    def test_duplicate_verification_prevented_with_token(self):
        """Test authenticated user cannot verify the same incident twice."""
        reporter = User(username="rep_user", email="r@test.com", role="citizen")
        reporter.set_password("pass123")
        verifier = User(username="ver_user", email="v@test.com", role="citizen")
        verifier.set_password("pass123")
        db.session.add_all([reporter, verifier])
        db.session.commit()

        inc = Incident(
            incident_type="breakdown",
            location_name="Domlur Flyover",
            latitude=12.9600,
            longitude=77.6400,
            reporter_id="rep_user",
            verification_status="pending"
        )
        db.session.add(inc)
        db.session.commit()

        v_token = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "ver_user", "password": "pass123"}),
            content_type="application/json"
        ).get_json()["token"]

        # 1st verification -> 200
        res1 = self.client.post(
            f"/api/incidents/{inc.id}/verify",
            data=json.dumps({"action": "confirm"}),
            headers={"Authorization": f"Bearer {v_token}"},
            content_type="application/json"
        )
        self.assertEqual(res1.status_code, 200)

        # 2nd verification attempt -> 409 Conflict
        res2 = self.client.post(
            f"/api/incidents/{inc.id}/verify",
            data=json.dumps({"action": "confirm"}),
            headers={"Authorization": f"Bearer {v_token}"},
            content_type="application/json"
        )
        self.assertEqual(res2.status_code, 409)
        self.assertEqual(res2.get_json()["error"], "Duplicate Verification")

    # =========================================================================
    # INCIDENT SEVERITY TESTS (TASK 1)
    # =========================================================================

    def test_create_incident_valid_severity(self):
        """Test POST /api/incidents accepts all valid severity levels and persists to DB."""
        for level in ["minor", "moderate", "severe", "critical"]:
            payload = {
                "incident_type": "accident",
                "location_name": f"Severity Test {level}",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "reporter_id": "test_reporter",
                "severity": level
            }
            res = self.client.post(
                "/api/incidents",
                data=json.dumps(payload),
                content_type="application/json"
            )
            self.assertEqual(res.status_code, 201, f"Failed for valid severity: {level}")
            data = res.get_json()
            self.assertEqual(data["severity"], level)

            # Verify direct database persistence
            incident_id = data["id"]
            saved = db.session.get(Incident, incident_id)
            self.assertIsNotNone(saved)
            self.assertEqual(saved.severity, level)

    def test_create_incident_default_severity(self):
        """Test that omitting severity preserves backward compatibility and defaults to 'moderate'."""
        payload = {
            "incident_type": "congestion",
            "location_name": "Default Severity Location",
            "latitude": 12.9352,
            "longitude": 77.6245,
            "reporter_id": "test_reporter_default"
        }
        res = self.client.post(
            "/api/incidents",
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertIn("severity", data)
        self.assertEqual(data["severity"], "moderate")

        # Verify DB persistence of default value
        saved = db.session.get(Incident, data["id"])
        self.assertIsNotNone(saved)
        self.assertEqual(saved.severity, "moderate")

    def test_create_incident_invalid_severity(self):
        """Test that invalid severity values are rejected with HTTP 400 and clear error message."""
        invalid_cases = [
            "extreme",
            "urgent",
            "high",
            "",
            123,
            ["critical"]
        ]
        for bad_val in invalid_cases:
            payload = {
                "incident_type": "hazard",
                "location_name": "Invalid Severity Test",
                "latitude": 12.9800,
                "longitude": 77.6400,
                "reporter_id": "test_reporter_bad",
                "severity": bad_val
            }
            res = self.client.post(
                "/api/incidents",
                data=json.dumps(payload),
                content_type="application/json"
            )
            self.assertEqual(res.status_code, 400, f"Expected 400 for invalid severity {bad_val}")
            data = res.get_json()
            self.assertEqual(data["error"], "Validation Error")
            self.assertIn("severity", data["errors"])
            self.assertIn("Allowed values: ['minor', 'moderate', 'severe', 'critical']", data["errors"]["severity"])

    def test_filter_incidents_by_severity(self):
        """Test GET /api/incidents?severity=<level> filters correctly."""
        inc_minor = Incident(
            incident_type="hazard",
            location_name="Minor Pothole",
            latitude=12.9100,
            longitude=77.6100,
            reporter_id="u_min",
            severity="minor"
        )
        inc_critical = Incident(
            incident_type="closure",
            location_name="Major Bridge Collapse",
            latitude=12.9200,
            longitude=77.6200,
            reporter_id="u_crit",
            severity="critical"
        )
        db.session.add_all([inc_minor, inc_critical])
        db.session.commit()

        # Query severity=critical
        res = self.client.get("/api/incidents?severity=critical")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["severity"], "critical")
        self.assertEqual(data[0]["location_name"], "Major Bridge Collapse")

        # Query severity=minor
        res_min = self.client.get("/api/incidents?severity=minor")
        self.assertEqual(res_min.status_code, 200)
        data_min = res_min.get_json()
        self.assertEqual(len(data_min), 1)
        self.assertEqual(data_min[0]["severity"], "minor")

    # =========================================================================
    # CSV EXPORT TESTS (TASK 2)
    # =========================================================================

    def test_csv_export_unauthenticated_rejected(self):
        """Test GET /api/incidents/export/csv rejects unauthenticated requests with 401."""
        res = self.client.get("/api/incidents/export/csv")
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertEqual(data["error"], "Unauthorized")

    def test_csv_export_citizen_rejected(self):
        """Test GET /api/incidents/export/csv rejects ordinary citizen accounts with 403."""
        # Create citizen user
        user = User(username="citizen_export_test", email="citizen_export@example.com", role="citizen")
        user.set_password("pass123")
        db.session.add(user)
        db.session.commit()

        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "citizen_export_test", "password": "pass123"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        res = self.client.get(
            "/api/incidents/export/csv",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 403)
        data = res.get_json()
        self.assertEqual(data["error"], "Forbidden")
        self.assertIn("not authorized", data["message"])

    def test_csv_export_authorized_official_and_data_accuracy(self):
        """Test authorized official can download CSV with correct headers, data, and severity."""
        # Create official user
        official = User(
            username="official_export_test",
            email="official_export@btp.gov.in",
            role="traffic_police",
            badge_number="BTP-555",
            agency="Bangalore Traffic Police"
        )
        official.set_password("officialpass123")
        db.session.add(official)

        # Seed incidents with different severities and fields
        inc1 = Incident(
            incident_type="accident",
            description="Two cars collided at intersection",
            location_name="MG Road Trinity Junction",
            latitude=12.9738,
            longitude=77.6205,
            reporter_id="commuter_1",
            verification_status="verified",
            severity="critical",
            trust_score=0.95
        )
        inc2 = Incident(
            incident_type="congestion",
            description="Moderate rush hour queue",
            location_name="Silk Board Flyover",
            latitude=12.9175,
            longitude=77.6238,
            reporter_id="commuter_2",
            verification_status="pending",
            severity="moderate",
            trust_score=0.40
        )
        db.session.add_all([inc1, inc2])
        db.session.commit()

        # Login as official
        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "official_export_test", "password": "officialpass123"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        # Request CSV Export
        res = self.client.get(
            "/api/incidents/export/csv",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 200)
        self.assertIn("text/csv", res.headers.get("Content-Type", ""))
        self.assertIn('attachment; filename="roadtruth_incidents.csv"', res.headers.get("Content-Disposition", ""))

        # Parse CSV output
        import csv
        import io
        csv_text = res.data.decode("utf-8")
        reader = list(csv.reader(io.StringIO(csv_text)))

        # Verify Headers (Requirement 3)
        expected_headers = [
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
        self.assertEqual(reader[0], expected_headers)

        # Verify 2 data rows present
        self.assertEqual(len(reader), 3)

        # Verify row content and severity mapping
        row_dict = {row[1]: row for row in reader[1:]}
        self.assertIn("accident", row_dict)
        self.assertIn("congestion", row_dict)

        accident_row = row_dict["accident"]
        self.assertEqual(accident_row[2], "critical")  # Severity
        self.assertEqual(accident_row[3], "Two cars collided at intersection")  # Description
        self.assertEqual(accident_row[4], "MG Road Trinity Junction")  # Location name
        self.assertEqual(accident_row[7], "verified")  # Status
        self.assertEqual(accident_row[8], "0.95")  # Trust score

        congestion_row = row_dict["congestion"]
        self.assertEqual(congestion_row[2], "moderate")  # Default/moderate severity
        self.assertEqual(congestion_row[7], "pending")

    def test_csv_export_empty_database(self):
        """Test that CSV export on an empty database returns valid CSV headers and 0 data rows."""
        admin = User(username="admin_empty_test", email="admin_empty@example.com", role="admin")
        admin.set_password("adminpass")
        db.session.add(admin)
        db.session.commit()

        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "admin_empty_test", "password": "adminpass"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        res = self.client.get(
            "/api/incidents/export/csv",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 200)

        import csv
        import io
        csv_text = res.data.decode("utf-8")
        reader = list(csv.reader(io.StringIO(csv_text)))
        self.assertEqual(len(reader), 1)  # Only header row
        self.assertEqual(reader[0][0], "Incident ID")

    def test_csv_export_formula_injection_sanitization(self):
        """Test formula injection characters (=, +, -, @) are sanitized with leading single quote."""
        admin = User(username="admin_inject_test", email="admin_inject@example.com", role="admin")
        admin.set_password("adminpass")
        db.session.add(admin)

        malicious_inc = Incident(
            incident_type="hazard",
            description="=CMD|' /C calc'!A0",
            location_name="+12345 Dangerous Landmark",
            latitude=12.9000,
            longitude=77.6000,
            reporter_id="attacker",
            severity="severe"
        )
        db.session.add(malicious_inc)
        db.session.commit()

        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "admin_inject_test", "password": "adminpass"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        res = self.client.get(
            "/api/incidents/export/csv",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 200)

        import csv
        import io
        csv_text = res.data.decode("utf-8")
        reader = list(csv.reader(io.StringIO(csv_text)))

        data_row = reader[1]
        desc = data_row[3]
        loc = data_row[4]

        # Verify formula characters were safely neutralized with prepended quote
        self.assertTrue(desc.startswith("'="), f"Expected '= prefix, got {desc}")
        self.assertTrue(loc.startswith("'+"), f"Expected '+ prefix, got {loc}")

    # =========================================================================
    # EMERGENCY SOS TESTS (TASK 3)
    # =========================================================================

    def test_emergency_sos_unauthenticated_returns_401(self):
        """Test unauthenticated POST /api/emergency/sos request is rejected with 401."""
        payload = {
            "latitude": 12.9716,
            "longitude": 77.5946,
            "description": "Medical emergency on road"
        }
        res = self.client.post("/api/emergency/sos", data=json.dumps(payload), content_type="application/json")
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertEqual(data["error"], "Unauthorized")

    def test_emergency_sos_invalid_or_missing_coordinates(self):
        """Test invalid or missing coordinates in SOS payload are rejected with 400."""
        user = User(username="sos_user1", email="sos1@example.com", role="citizen")
        user.set_password("pass123")
        db.session.add(user)
        db.session.commit()

        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "sos_user1", "password": "pass123"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]
        auth_header = {"Authorization": f"Bearer {token}"}

        # 1. Missing latitude
        res_no_lat = self.client.post(
            "/api/emergency/sos",
            data=json.dumps({"longitude": 77.5946}),
            content_type="application/json",
            headers=auth_header
        )
        self.assertEqual(res_no_lat.status_code, 400)
        self.assertIn("latitude", res_no_lat.get_json().get("errors", {}))

        # 2. Out of bounds latitude (> 90.0)
        res_bad_lat = self.client.post(
            "/api/emergency/sos",
            data=json.dumps({"latitude": 99.5, "longitude": 77.5946}),
            content_type="application/json",
            headers=auth_header
        )
        self.assertEqual(res_bad_lat.status_code, 400)

        # 3. Non-numeric longitude
        res_non_num = self.client.post(
            "/api/emergency/sos",
            data=json.dumps({"latitude": 12.9716, "longitude": "invalid_coord"}),
            content_type="application/json",
            headers=auth_header
        )
        self.assertEqual(res_non_num.status_code, 400)

    def test_emergency_sos_valid_creation_and_attributes(self):
        """Test valid authenticated SOS creates an incident with critical severity and pending status."""
        user = User(username="sos_citizen", email="soscitizen@example.com", role="citizen")
        user.set_password("pass123")
        db.session.add(user)
        db.session.commit()

        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "sos_citizen", "password": "pass123"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        payload = {
            "latitude": 12.9352,
            "longitude": 77.6245,
            "description": "Multi-vehicle collision blocking intersection",
            "location_name": "Koramangala 80ft Road"
        }
        res = self.client.post(
            "/api/emergency/sos",
            data=json.dumps(payload),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 201)
        data = res.get_json()

        self.assertIn("incident_id", data)
        self.assertEqual(data["severity"], "critical")
        self.assertEqual(data["status"], "pending")
        self.assertEqual(data["verification_status"], "pending")
        self.assertIn("disclaimer", data)

        # Verify incident in database
        inc = db.session.get(Incident, data["incident_id"])
        self.assertIsNotNone(inc)
        self.assertEqual(inc.severity, "critical")
        self.assertEqual(inc.incident_type, "emergency")
        self.assertEqual(inc.verification_status, "pending")
        self.assertEqual(inc.reporter_id, "sos_citizen")
        self.assertEqual(inc.location_name, "Koramangala 80ft Road")
        self.assertAlmostEqual(inc.latitude, 12.9352, places=4)
        self.assertAlmostEqual(inc.longitude, 77.6245, places=4)
        self.assertIsNotNone(inc.created_at)

    def test_emergency_sos_reporter_impersonation_prevented(self):
        """Test client-supplied reporter_id or role cannot impersonate another user or authority."""
        victim = User(username="police_chief", email="chief@example.com", role="traffic_police")
        victim.set_password("chiefpass")
        citizen = User(username="sneaky_citizen", email="sneaky@example.com", role="citizen")
        citizen.set_password("sneakypass")
        db.session.add_all([victim, citizen])
        db.session.commit()

        login_res = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "sneaky_citizen", "password": "sneakypass"}),
            content_type="application/json"
        )
        token = login_res.get_json()["token"]

        # Attempt to spoof reporter_id and role in request body
        spoof_payload = {
            "latitude": 12.9716,
            "longitude": 77.5946,
            "reporter_id": "police_chief",
            "role": "traffic_police",
            "verifier_role": "traffic_police",
            "verification_status": "verified"
        }
        res = self.client.post(
            "/api/emergency/sos",
            data=json.dumps(spoof_payload),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 201)
        data = res.get_json()

        # Reporter must be derived from token (sneaky_citizen), NOT client spoofed (police_chief)
        inc = db.session.get(Incident, data["incident_id"])
        self.assertEqual(inc.reporter_id, "sneaky_citizen")
        self.assertNotEqual(inc.reporter_id, "police_chief")

        # Must not be automatically verified
        self.assertEqual(inc.verification_status, "pending")
        self.assertNotEqual(inc.verification_status, "verified")

        # Citizen role must NOT be elevated
        citizen_check = db.session.get(User, citizen.id)
        self.assertEqual(citizen_check.role, "citizen")

    def test_emergency_sos_requires_official_verification_to_verify(self):
        """Test SOS report remains pending until verified via official authority workflow."""
        citizen = User(username="sos_reporter", email="sosrep@example.com", role="citizen")
        citizen.set_password("pass123")
        police = User(username="official_responder", email="officer@example.com", role="traffic_police")
        police.set_password("cop123")
        db.session.add_all([citizen, police])
        db.session.commit()

        token_cit = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "sos_reporter", "password": "pass123"}),
            content_type="application/json"
        ).get_json()["token"]

        token_pol = self.client.post(
            "/api/auth/login",
            data=json.dumps({"username": "official_responder", "password": "cop123"}),
            content_type="application/json"
        ).get_json()["token"]

        # Create SOS
        res_sos = self.client.post(
            "/api/emergency/sos",
            data=json.dumps({"latitude": 12.9200, "longitude": 77.6100}),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token_cit}"}
        )
        inc_id = res_sos.get_json()["incident_id"]

        # Verify it is initially pending
        inc = db.session.get(Incident, inc_id)
        self.assertEqual(inc.verification_status, "pending")

        # Official verifies the emergency incident
        verify_payload = {
            "action": "confirm",
            "supporting_info": "Patrol unit en route to incident site"
        }
        res_ver = self.client.post(
            f"/api/incidents/{inc_id}/verify",
            data=json.dumps(verify_payload),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token_pol}"}
        )
        self.assertEqual(res_ver.status_code, 200)

        # Now verified
        inc_after = db.session.get(Incident, inc_id)
        self.assertEqual(inc_after.verification_status, "verified")
        self.assertEqual(inc_after.trust_score, 1.0)


if __name__ == "__main__":
    unittest.main()

