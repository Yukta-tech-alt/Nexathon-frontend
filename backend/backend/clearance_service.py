from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple
from backend.models import db, Incident

# Configurable baseline clearance duration in minutes by incident category
BASELINE_CLEARANCE_MINUTES = {
    "accident": 60,                 # 1 hour: vehicle towing and lane clearing
    "congestion": 45,               # 45 mins: rush hour traffic dispersal
    "traffic_congestion": 45,       # 45 mins: rush hour traffic dispersal
    "roadwork": 240,                # 4 hours: active construction / maintenance
    "construction": 240,            # 4 hours: active construction / maintenance
    "hazard": 90,                   # 1.5 hours: debris / oil spill removal
    "road_hazard": 90,              # 1.5 hours: debris / obstacle clearing
    "weather": 120,                 # 2 hours: localized flooding or storm cleanup
    "weather_disruption": 120,      # 2 hours: weather disruption
    "closure": 180,                 # 3 hours: road blockage / structural clearance
    "road_closure": 180,            # 3 hours: road closure
    "roadblock": 180,               # 3 hours: roadblock
    "breakdown": 40,                # 40 mins: roadside assistance / towing
    "vehicle_breakdown": 40,        # 40 mins: roadside breakdown
    "emergency": 60,                # 1 hour: emergency incident clearance
    "sos": 60,                      # 1 hour: emergency SOS incident clearance
    "other": 60                     # 1 hour: general baseline
}


def get_baseline_duration_minutes(incident_type: str) -> Optional[int]:
    """Return baseline duration for an incident category, or None if unknown."""
    if not incident_type:
        return None
    return BASELINE_CLEARANCE_MINUTES.get(incident_type.strip().lower(), 60)

def estimate_clearance_time(
    incident_type: str,
    created_at: Optional[datetime] = None,
    custom_minutes: Optional[int] = None
) -> Tuple[Optional[datetime], Optional[int]]:
    """
    Calculates estimated clearance time based on incident category baseline.
    Returns: (estimated_clearance_datetime, baseline_minutes)
    """
    if custom_minutes and custom_minutes > 0:
        duration = custom_minutes
    else:
        duration = get_baseline_duration_minutes(incident_type)

    if duration is None:
        return None, None

    start_time = created_at or datetime.now(timezone.utc)
    # Ensure start_time has timezone
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)

    estimated_time = start_time + timedelta(minutes=duration)
    return estimated_time, duration

def mark_incident_as_cleared(
    incident: Incident,
    cleared_at: Optional[datetime] = None,
    cleared_by: Optional[str] = None
) -> Incident:
    """
    Marks an incident as officially cleared and records actual clearance timestamp.
    """
    actual_cleared_time = cleared_at or datetime.now(timezone.utc)
    if actual_cleared_time.tzinfo is None:
        actual_cleared_time = actual_cleared_time.replace(tzinfo=timezone.utc)

    incident.verification_status = "cleared"
    incident.cleared_at = actual_cleared_time
    incident.trust_score = 1.0  # High confidence that clearance state is recorded
    db.session.commit()
    return incident
