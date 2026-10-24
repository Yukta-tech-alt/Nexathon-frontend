from datetime import datetime, timezone
from collections import defaultdict
from sqlalchemy import func
from backend.models import db, Incident

def parse_iso_datetime(date_str: str):
    """Safely parse an ISO datetime string."""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None

def get_heatmap_points(
    incident_type: str = None,
    verification_status: str = None,
    start_date: str = None,
    end_date: str = None,
    min_lat: float = None,
    max_lat: float = None,
    min_lon: float = None,
    max_lon: float = None,
    page: int = 1,
    per_page: int = 200
):
    """
    Returns sanitized, Leaflet-ready map incident data.
    Excludes invalid coordinates and omits private reporter details.
    """
    query = Incident.query.filter(
        Incident.latitude.isnot(None),
        Incident.longitude.isnot(None),
        Incident.latitude >= -90.0,
        Incident.latitude <= 90.0,
        Incident.longitude >= -180.0,
        Incident.longitude <= 180.0
    )

    if incident_type:
        query = query.filter(Incident.incident_type == incident_type.strip().lower())

    if verification_status:
        query = query.filter(Incident.verification_status == verification_status.strip().lower())

    start_dt = parse_iso_datetime(start_date)
    if start_dt:
        query = query.filter(Incident.created_at >= start_dt)

    end_dt = parse_iso_datetime(end_date)
    if end_dt:
        query = query.filter(Incident.created_at <= end_dt)

    if min_lat is not None:
        query = query.filter(Incident.latitude >= min_lat)
    if max_lat is not None:
        query = query.filter(Incident.latitude <= max_lat)
    if min_lon is not None:
        query = query.filter(Incident.longitude >= min_lon)
    if max_lon is not None:
        query = query.filter(Incident.longitude <= max_lon)

    total_count = query.count()
    page = max(1, page)
    per_page = min(1000, max(1, per_page))
    incidents = query.order_by(Incident.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    points = []
    for inc in incidents:
        is_cleared = (inc.verification_status == "cleared") or (inc.cleared_at is not None)
        points.append({
            "id": inc.id,
            "incident_type": inc.incident_type,
            "latitude": inc.latitude,
            "longitude": inc.longitude,
            "location_name": inc.location_name,
            "verification_status": inc.verification_status,
            "status": "cleared" if is_cleared else "active",
            "is_cleared": is_cleared,
            "severity": getattr(inc, "severity", "moderate") or "moderate",
            "trust_score": round(inc.trust_score, 2),
            "created_at": inc.created_at.isoformat() if inc.created_at else None,
            "estimated_clearance_time": inc.estimated_clearance_time.isoformat() if inc.estimated_clearance_time else None
        })

    return {
        "total": total_count,
        "page": page,
        "per_page": per_page,
        "count": len(points),
        "points": points
    }


def get_historical_hotspots(
    incident_type: str = None,
    start_date: str = None,
    end_date: str = None,
    grid_precision: int = 2,
    min_count: int = 1
):
    """
    Groups historical incidents into spatial grid cells (rounded coordinates ~1km precision).
    Distinguishes historical report concentration from live sensor congestion.
    """
    query = Incident.query.filter(
        Incident.latitude.isnot(None),
        Incident.longitude.isnot(None),
        Incident.latitude >= -90.0,
        Incident.latitude <= 90.0,
        Incident.longitude >= -180.0,
        Incident.longitude <= 180.0
    )

    if incident_type:
        query = query.filter(Incident.incident_type == incident_type.strip().lower())

    start_dt = parse_iso_datetime(start_date)
    if start_dt:
        query = query.filter(Incident.created_at >= start_dt)

    end_dt = parse_iso_datetime(end_date)
    if end_dt:
        query = query.filter(Incident.created_at <= end_dt)

    incidents = query.all()
    cells = defaultdict(list)

    for inc in incidents:
        cell_lat = round(inc.latitude, grid_precision)
        cell_lon = round(inc.longitude, grid_precision)
        cells[(cell_lat, cell_lon)].append(inc)

    hotspots = []
    for (cell_lat, cell_lon), cell_incidents in cells.items():
        count = len(cell_incidents)
        if count < min_count:
            continue

        type_counts = defaultdict(int)
        trust_scores = []
        for inc in cell_incidents:
            type_counts[inc.incident_type] += 1
            trust_scores.append(inc.trust_score)

        avg_trust = round(sum(trust_scores) / len(trust_scores), 2) if trust_scores else 0.0

        if count >= 5:
            severity = "high"
        elif count >= 3:
            severity = "medium"
        else:
            severity = "low"

        hotspots.append({
            "grid_cell": f"{cell_lat:.{grid_precision}f},{cell_lon:.{grid_precision}f}",
            "center_latitude": cell_lat,
            "center_longitude": cell_lon,
            "incident_count": count,
            "severity_level": severity,
            "average_trust_score": avg_trust,
            "incident_types": dict(type_counts),
            "sample_locations": list({inc.location_name for inc in cell_incidents})[:3]
        })

    # Sort hotspots by incident count descending
    hotspots.sort(key=lambda h: h["incident_count"], reverse=True)

    return {
        "total_hotspots": len(hotspots),
        "hotspots": hotspots,
        "disclaimer": "Historical hotspots indicate spatial clusters of community & agency reported events. "
                      "They reflect report density and do not represent live traffic speed sensor measurements."
    }


def get_traffic_analytics(start_date: str = None, end_date: str = None):
    """
    Computes comprehensive traffic analytics using actual database queries.
    """
    query = Incident.query

    start_dt = parse_iso_datetime(start_date)
    if start_dt:
        query = query.filter(Incident.created_at >= start_dt)

    end_dt = parse_iso_datetime(end_date)
    if end_dt:
        query = query.filter(Incident.created_at <= end_dt)

    total_incidents = query.count()

    # Counts by incident type
    type_counts_query = (
        db.session.query(Incident.incident_type, func.count(Incident.id))
        .filter(Incident.id.in_([i.id for i in query.all()]) if total_incidents > 0 else False)
        .group_by(Incident.incident_type)
        .all()
    ) if total_incidents > 0 else []
    by_type = {t: c for t, c in type_counts_query}

    # Counts by status
    status_counts_query = (
        db.session.query(Incident.verification_status, func.count(Incident.id))
        .filter(Incident.id.in_([i.id for i in query.all()]) if total_incidents > 0 else False)
        .group_by(Incident.verification_status)
        .all()
    ) if total_incidents > 0 else []
    by_status = {
        "pending": 0,
        "verified": 0,
        "disputed": 0,
        "cleared": 0
    }
    for s, c in status_counts_query:
        by_status[s] = c

    # Resolved vs Unresolved
    cleared_count = by_status.get("cleared", 0)
    unresolved_count = total_incidents - cleared_count

    # Average trust score
    avg_trust = (
        db.session.query(func.avg(Incident.trust_score))
        .filter(Incident.id.in_([i.id for i in query.all()]))
        .scalar()
    ) if total_incidents > 0 else 0.0

    # Counts over time (daily buckets)
    all_incidents = query.order_by(Incident.created_at.asc()).all()
    daily_buckets = defaultdict(int)
    for inc in all_incidents:
        if inc.created_at:
            day_str = inc.created_at.strftime("%Y-%m-%d")
            daily_buckets[day_str] += 1

    time_series = [{"date": d, "count": c} for d, c in sorted(daily_buckets.items())]

    return {
        "total_incidents": total_incidents,
        "resolved_incidents": cleared_count,
        "unresolved_incidents": unresolved_count,
        "average_trust_score": round(float(avg_trust or 0.0), 2),
        "by_type": by_type,
        "by_status": by_status,
        "time_series": time_series
    }
