import math
from typing import Optional
from backend.models import Incident

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two GPS coordinates in meters
    using the Haversine formula (pure Python standard library).
    """
    earth_radius_m = 6371000.0  # Earth's mean radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    
    # Clamp to [-1.0, 1.0] to prevent domain errors due to precision
    a = min(1.0, max(0.0, a))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return earth_radius_m * c


def find_duplicate_incidents(
    incident_type: str,
    latitude: float,
    longitude: float,
    radius_meters: float = 500.0,
    exclude_id: Optional[int] = None
):
    """
    Detect active incidents of the same type within a geographic proximity radius.
    Excludes cleared reports and optionally an incident by ID.
    Returns: list of dicts describing nearby potential duplicate incidents.
    """
    norm_type = incident_type.strip().lower()

    # Query active incidents matching the incident type
    query = Incident.query.filter(
        Incident.incident_type == norm_type,
        Incident.verification_status != "cleared"
    )

    if exclude_id is not None:
        query = query.filter(Incident.id != exclude_id)

    candidates = query.all()
    duplicates = []

    for inc in candidates:
        distance = haversine_distance_meters(latitude, longitude, inc.latitude, inc.longitude)
        if distance <= radius_meters:
            duplicates.append({
                "id": inc.id,
                "incident_type": inc.incident_type,
                "location_name": inc.location_name,
                "distance_meters": round(distance, 1),
                "distance_km": round(distance / 1000.0, 3),
                "verification_status": inc.verification_status,
                "trust_score": inc.trust_score,
                "reporter_id": inc.reporter_id,
                "created_at": inc.created_at.isoformat() if inc.created_at else None
            })

    # Sort closest first
    duplicates.sort(key=lambda d: d["distance_meters"])
    return duplicates


def find_nearby_incidents(
    latitude: float,
    longitude: float,
    radius_km: float = 5.0,
    incident_type: Optional[str] = None,
    include_cleared: bool = False,
    min_trust_score: float = 0.0,
    limit: int = 50
):
    """
    Search for relevant incidents around coordinates within a radius (km).
    Excludes cleared reports by default. Sorts results closest first.
    """
    radius_meters = max(50.0, radius_km * 1000.0)

    query = Incident.query.filter(
        Incident.latitude.isnot(None),
        Incident.longitude.isnot(None),
        Incident.latitude >= -90.0,
        Incident.latitude <= 90.0,
        Incident.longitude >= -180.0,
        Incident.longitude <= 180.0
    )

    if not include_cleared:
        query = query.filter(
            Incident.verification_status != "cleared",
            Incident.cleared_at.is_(None)
        )

    if incident_type:
        query = query.filter(Incident.incident_type == incident_type.strip().lower())

    if min_trust_score and min_trust_score > 0.0:
        query = query.filter(Incident.trust_score >= min_trust_score)

    candidates = query.all()
    nearby_list = []

    for inc in candidates:
        distance = haversine_distance_meters(latitude, longitude, inc.latitude, inc.longitude)
        if distance <= radius_meters:
            is_cleared = (inc.verification_status == "cleared") or (inc.cleared_at is not None)
            nearby_list.append({
                "id": inc.id,
                "incident_type": inc.incident_type,
                "description": inc.description,
                "location_name": inc.location_name,
                "latitude": inc.latitude,
                "longitude": inc.longitude,
                "distance_meters": round(distance, 1),
                "distance_km": round(distance / 1000.0, 2),
                "verification_status": inc.verification_status,
                "status": "cleared" if is_cleared else "active",
                "is_cleared": is_cleared,
                "severity": getattr(inc, "severity", "moderate") or "moderate",
                "trust_score": round(inc.trust_score, 2),
                "estimated_clearance_time": inc.estimated_clearance_time.isoformat() if inc.estimated_clearance_time else None,
                "created_at": inc.created_at.isoformat() if inc.created_at else None
            })

    # Sort closest first
    nearby_list.sort(key=lambda item: item["distance_meters"])

    return nearby_list[:limit]


def distance_point_to_segment_meters(
    p_lat: float, p_lon: float,
    a_lat: float, a_lon: float,
    b_lat: float, b_lon: float
) -> float:
    """
    Calculates the shortest distance in meters from a point (p_lat, p_lon)
    to a line segment (a_lat, a_lon)-(b_lat, b_lon) using local Cartesian projection.
    """
    mid_lat = (a_lat + b_lat) / 2.0
    kx = math.cos(math.radians(mid_lat)) * 111320.0
    ky = 111132.0

    ax = a_lon * kx
    ay = a_lat * ky
    bx = b_lon * kx
    by = b_lat * ky
    px = p_lon * kx
    py = p_lat * ky

    dx = bx - ax
    dy = by - ay
    seg_len_sq = dx * dx + dy * dy

    if seg_len_sq == 0.0:
        return math.hypot(px - ax, py - ay)

    t = ((px - ax) * dx + (py - ay) * dy) / seg_len_sq
    t = max(0.0, min(1.0, t))
    proj_x = ax + t * dx
    proj_y = ay + t * dy

    return math.hypot(px - proj_x, py - proj_y)


def distance_point_to_route_meters(point_lat: float, point_lon: float, route_points) -> float:
    """
    Computes minimum geodesic distance from point (lat, lon) to a sequence of (lat, lon) route vertices.
    """
    if not route_points or len(route_points) < 2:
        if route_points and len(route_points) == 1:
            return haversine_distance_meters(point_lat, point_lon, route_points[0][0], route_points[0][1])
        return float("inf")

    min_dist = float("inf")
    for i in range(len(route_points) - 1):
        a_lat, a_lon = route_points[i]
        b_lat, b_lon = route_points[i + 1]
        dist = distance_point_to_segment_meters(point_lat, point_lon, a_lat, a_lon, b_lat, b_lon)
        if dist < min_dist:
            min_dist = dist
            if min_dist <= 1.0:
                break

    return min_dist


def find_incidents_near_route(
    route_coords,
    buffer_meters: float = 200.0,
    include_cleared: bool = False,
    coordinate_format: str = "geojson"
):
    """
    Identifies active RoadTruth incidents situated within buffer_meters of a route corridor.
    route_coords can be:
      - GeoJSON coordinate pairs: [[lon, lat], [lon, lat], ...] (when coordinate_format="geojson")
      - Lat-lon pairs: [[lat, lon], [lat, lon], ...] (when coordinate_format="latlon")
      - Dicts: [{"latitude": lat, "longitude": lon}, ...]
    Returns list of incident alert dicts with distance_from_route_meters.
    """
    if not route_coords or len(route_coords) < 2:
        return []

    # Normalize to list of (lat, lon) using explicit format specification
    norm_pts = []
    for pt in route_coords:
        if isinstance(pt, dict):
            lat = pt.get("latitude") if pt.get("latitude") is not None else pt.get("lat")
            lon = pt.get("longitude") if pt.get("longitude") is not None else pt.get("lon")
            if lat is not None and lon is not None:
                norm_pts.append((float(lat), float(lon)))
        elif isinstance(pt, (list, tuple)) and len(pt) >= 2:
            if coordinate_format.lower() == "geojson" or coordinate_format.lower() == "lonlat":
                # GeoJSON standard RFC 7946 specifies [longitude, latitude]
                lon = float(pt[0])
                lat = float(pt[1])
                norm_pts.append((lat, lon))
            else:
                # Lat-Lon ordering
                lat = float(pt[0])
                lon = float(pt[1])
                norm_pts.append((lat, lon))

    if len(norm_pts) < 2:
        return []

    # Calculate bounding box with search buffer
    deg_buffer = (buffer_meters + 500.0) / 111000.0
    lats = [p[0] for p in norm_pts]
    lons = [p[1] for p in norm_pts]
    min_lat, max_lat = min(lats) - deg_buffer, max(lats) + deg_buffer
    min_lon, max_lon = min(lons) - deg_buffer, max(lons) + deg_buffer

    query = Incident.query.filter(
        Incident.latitude.isnot(None),
        Incident.longitude.isnot(None),
        Incident.latitude >= min_lat,
        Incident.latitude <= max_lat,
        Incident.longitude >= min_lon,
        Incident.longitude <= max_lon
    )

    if not include_cleared:
        query = query.filter(
            Incident.verification_status != "cleared",
            Incident.cleared_at.is_(None)
        )

    candidates = query.all()
    route_incidents = []

    for inc in candidates:
        dist_m = distance_point_to_route_meters(inc.latitude, inc.longitude, norm_pts)
        if dist_m <= buffer_meters:
            is_closure = inc.incident_type.lower() in ("closure", "road_closure", "roadblock")
            is_cleared = (inc.verification_status == "cleared") or (inc.cleared_at is not None)
            route_incidents.append({
                "incident_id": inc.id,
                "incident_type": inc.incident_type,
                "description": inc.description,
                "location_name": inc.location_name,
                "latitude": inc.latitude,
                "longitude": inc.longitude,
                "distance_from_route_meters": round(dist_m, 1),
                "verification_status": inc.verification_status,
                "status": "cleared" if is_cleared else "active",
                "is_cleared": is_cleared,
                "is_closure": is_closure,
                "is_confirmed_closure": is_closure and inc.verification_status == "verified",
                "trust_score": round(inc.trust_score, 2),
                "estimated_clearance_time": inc.estimated_clearance_time.isoformat() if inc.estimated_clearance_time else None,
                "created_at": inc.created_at.isoformat() if inc.created_at else None
            })

    # Sort closest to route corridor first
    route_incidents.sort(key=lambda item: item["distance_from_route_meters"])
    return route_incidents


