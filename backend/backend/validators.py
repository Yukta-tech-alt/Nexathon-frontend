from datetime import datetime

ALLOWED_INCIDENT_TYPES = {
    "accident",
    "congestion",
    "traffic_congestion",
    "roadwork",
    "construction",
    "hazard",
    "road_hazard",
    "weather",
    "weather_disruption",
    "closure",
    "road_closure",
    "roadblock",
    "breakdown",
    "vehicle_breakdown",
    "emergency",
    "sos",
    "emergency_sos",
    "other"
}

INCIDENT_TYPE_SYNONYMS = {
    "accident": "accident",
    "congestion": "congestion",
    "traffic congestion": "congestion",
    "traffic_congestion": "congestion",
    "roadwork": "roadwork",
    "construction": "construction",
    "roadwork or construction": "roadwork",
    "road hazard": "hazard",
    "road_hazard": "hazard",
    "hazard": "hazard",
    "weather": "weather",
    "weather disruption": "weather",
    "weather_disruption": "weather",
    "weather-related disruption": "weather",
    "closure": "closure",
    "road closure": "closure",
    "road_closure": "closure",
    "roadblock": "roadblock",
    "roadblock or road closure": "roadblock",
    "breakdown": "breakdown",
    "vehicle breakdown": "breakdown",
    "vehicle_breakdown": "breakdown",
    "emergency": "emergency",
    "sos": "emergency",
    "emergency sos": "emergency",
    "emergency_sos": "emergency",
    "other": "other"
}

ALLOWED_VERIFICATION_STATUSES = {
    "pending",
    "verified",
    "disputed",
    "cleared",
    "rejected"
}

ALLOWED_SEVERITIES = {
    "minor",
    "moderate",
    "severe",
    "critical"
}

def validate_incident_payload(data):
    """
    Validates input data for incident creation or update.
    Returns: (is_valid: bool, errors: dict, cleaned_data: dict)
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    # incident_type
    incident_type = data.get("incident_type")
    if not incident_type or not isinstance(incident_type, str):
        errors["incident_type"] = "incident_type is required and must be a string."
    else:
        norm_type = incident_type.strip().lower()
        if not norm_type:
            errors["incident_type"] = "incident_type cannot be empty."
        else:
            canonical_type = INCIDENT_TYPE_SYNONYMS.get(norm_type, norm_type)
            if canonical_type not in ALLOWED_INCIDENT_TYPES:
                errors["incident_type"] = (
                    f"Unsupported incident type '{incident_type}'. Supported categories: "
                    "Accident, Traffic congestion, Roadblock or road closure, Roadwork or construction, "
                    "Vehicle breakdown, Road hazard, Weather-related disruption."
                )
            else:
                cleaned["incident_type"] = canonical_type


    # location_name
    location_name = data.get("location_name")
    if not location_name or not isinstance(location_name, str):
        errors["location_name"] = "location_name is required and must be a string."
    else:
        norm_loc = location_name.strip()
        if not norm_loc:
            errors["location_name"] = "location_name cannot be empty."
        else:
            cleaned["location_name"] = norm_loc

    # latitude
    lat = data.get("latitude")
    if lat is None:
        errors["latitude"] = "latitude is required."
    else:
        try:
            lat_val = float(lat)
            if not (-90.0 <= lat_val <= 90.0):
                errors["latitude"] = "latitude must be between -90.0 and 90.0 degrees."
            else:
                cleaned["latitude"] = lat_val
        except (ValueError, TypeError):
            errors["latitude"] = "latitude must be a valid numeric floating point value."

    # longitude
    lon = data.get("longitude")
    if lon is None:
        errors["longitude"] = "longitude is required."
    else:
        try:
            lon_val = float(lon)
            if not (-180.0 <= lon_val <= 180.0):
                errors["longitude"] = "longitude must be between -180.0 and 180.0 degrees."
            else:
                cleaned["longitude"] = lon_val
        except (ValueError, TypeError):
            errors["longitude"] = "longitude must be a valid numeric floating point value."

    # reporter_id (optional if authenticated user, validated if provided)
    reporter_id = data.get("reporter_id")
    if reporter_id is not None:
        if not isinstance(reporter_id, str):
            errors["reporter_id"] = "reporter_id must be a string."
        else:
            norm_rep = reporter_id.strip()
            if not norm_rep:
                errors["reporter_id"] = "reporter_id cannot be empty."
            else:
                cleaned["reporter_id"] = norm_rep
    else:
        cleaned["reporter_id"] = None

    # description (optional)
    description = data.get("description")
    if description is not None:
        if not isinstance(description, str):
            errors["description"] = "description must be a string."
        else:
            cleaned["description"] = description.strip()
    else:
        cleaned["description"] = None

    # severity (optional, defaults to "moderate")
    severity = data.get("severity")
    if severity is not None:
        if not isinstance(severity, str):
            errors["severity"] = "severity must be a string. Allowed values: ['minor', 'moderate', 'severe', 'critical']."
        else:
            norm_sev = severity.strip().lower()
            if norm_sev not in ALLOWED_SEVERITIES:
                errors["severity"] = (
                    f"Invalid severity '{severity}'. Allowed values: ['minor', 'moderate', 'severe', 'critical']."
                )
            else:
                cleaned["severity"] = norm_sev
    else:
        cleaned["severity"] = "moderate"

    # Server-enforced safety: Never trust client-supplied verification_status or trust_score
    cleaned["verification_status"] = "pending"
    cleaned["trust_score"] = 0.40

    # estimated_clearance_time (optional, ISO datetime string)
    est_clearance = data.get("estimated_clearance_time")
    if est_clearance is not None:
        if isinstance(est_clearance, str):
            try:
                # Handle standard ISO formats, including Z or offset
                cleaned["estimated_clearance_time"] = datetime.fromisoformat(est_clearance.replace("Z", "+00:00"))
            except ValueError:
                errors["estimated_clearance_time"] = "estimated_clearance_time must be a valid ISO 8601 string (e.g., 2026-10-23T14:30:00)."
        else:
            errors["estimated_clearance_time"] = "estimated_clearance_time must be an ISO formatted string."
    else:
        cleaned["estimated_clearance_time"] = None

    if errors:
        return False, errors, None

    return True, {}, cleaned


ALLOWED_VERIFICATION_ACTIONS = {
    "confirm",
    "verify",
    "dispute",
    "clear",
    "resolve"
}

ALLOWED_VERIFIER_ROLES = {
    "police",
    "traffic_police",
    "traffic_authority",
    "emergency_service",
    "road_operator",
    "official",
    "citizen",
    "commuter",
    "driver",
    "public"
}

def validate_verification_payload(data):
    """
    Validates payload for incident verification or supporting info submission.
    Returns: (is_valid: bool, errors: dict, cleaned_data: dict)
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    # verifier_id (optional if authenticated, validated if provided)
    verifier_id = data.get("verifier_id")
    if verifier_id is not None:
        if not isinstance(verifier_id, str):
            errors["verifier_id"] = "verifier_id must be a string."
        else:
            norm_ver = verifier_id.strip()
            if not norm_ver:
                errors["verifier_id"] = "verifier_id cannot be empty."
            else:
                cleaned["verifier_id"] = norm_ver
    else:
        cleaned["verifier_id"] = None

    # action (required: 'confirm', 'dispute', 'clear')
    action = data.get("action")
    if not action or not isinstance(action, str):
        errors["action"] = "action is required. Allowed values: ['confirm', 'dispute', 'clear']."
    else:
        norm_action = action.strip().lower()
        if norm_action in ("confirm", "verify"):
            cleaned["action"] = "confirm"
        elif norm_action in ("clear", "resolve"):
            cleaned["action"] = "clear"
        elif norm_action == "dispute":
            cleaned["action"] = "dispute"
        else:
            errors["action"] = f"Invalid action '{action}'. Allowed: ['confirm', 'dispute', 'clear']."

    # verifier_role (optional, default: 'citizen')
    verifier_role = data.get("verifier_role")
    if verifier_role is not None:
        if not isinstance(verifier_role, str):
            errors["verifier_role"] = "verifier_role must be a string."
        else:
            norm_role = verifier_role.strip().lower()
            if norm_role not in ALLOWED_VERIFIER_ROLES:
                errors["verifier_role"] = (
                    f"Invalid verifier_role '{verifier_role}'. Allowed: {sorted(list(ALLOWED_VERIFIER_ROLES))}"
                )
            else:
                cleaned["verifier_role"] = norm_role
    else:
        cleaned["verifier_role"] = "citizen"

    # supporting_info (optional notes)
    supporting_info = data.get("supporting_info") or data.get("notes") or data.get("comment")
    if supporting_info is not None:
        if not isinstance(supporting_info, str):
            errors["supporting_info"] = "supporting_info must be a string."
        else:
            cleaned["supporting_info"] = supporting_info.strip()
    else:
        cleaned["supporting_info"] = None

    # evidence_url (optional photo/video URL)
    evidence_url = data.get("evidence_url") or data.get("photo_url")
    if evidence_url is not None:
        if not isinstance(evidence_url, str):
            errors["evidence_url"] = "evidence_url must be a string."
        else:
            norm_url = evidence_url.strip()
            if norm_url and not (norm_url.startswith("http://") or norm_url.startswith("https://")):
                errors["evidence_url"] = "evidence_url must start with http:// or https://"
            else:
                cleaned["evidence_url"] = norm_url or None
    else:
        cleaned["evidence_url"] = None

    # estimated_clearance_time (optional, ISO datetime string)
    est_clearance = data.get("estimated_clearance_time")
    if est_clearance is not None:
        if isinstance(est_clearance, str):
            try:
                cleaned["estimated_clearance_time"] = datetime.fromisoformat(est_clearance.replace("Z", "+00:00"))
            except ValueError:
                errors["estimated_clearance_time"] = "estimated_clearance_time must be an ISO 8601 string."
        else:
            errors["estimated_clearance_time"] = "estimated_clearance_time must be an ISO formatted string."
    else:
        cleaned["estimated_clearance_time"] = None

    if errors:
        return False, errors, None

    return True, {}, cleaned


def validate_route_request(data):
    """
    Validates request payload for alternative route suggestions.
    Expected: {
      "origin": {"latitude": float, "longitude": float},
      "destination": {"latitude": float, "longitude": float}
    }
    Returns: (is_valid: bool, errors: dict, cleaned: dict)
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    # Validate origin
    origin = data.get("origin")
    if not isinstance(origin, dict):
        errors["origin"] = "origin is required and must be an object with latitude and longitude."
    else:
        orig_lat = origin.get("latitude") if origin.get("latitude") is not None else origin.get("lat")
        orig_lon = origin.get("longitude") if origin.get("longitude") is not None else origin.get("lon")
        if orig_lat is None or orig_lon is None:
            errors["origin"] = "origin requires both latitude and longitude."
        else:
            try:
                lat_f = float(orig_lat)
                lon_f = float(orig_lon)
                if not (-90.0 <= lat_f <= 90.0) or not (-180.0 <= lon_f <= 180.0):
                    errors["origin"] = "origin latitude must be [-90, 90] and longitude [-180, 180]."
                else:
                    cleaned["origin"] = {"latitude": lat_f, "longitude": lon_f}
            except (ValueError, TypeError):
                errors["origin"] = "origin coordinates must be numeric."

    # Validate destination
    destination = data.get("destination")
    if not isinstance(destination, dict):
        errors["destination"] = "destination is required and must be an object with latitude and longitude."
    else:
        dest_lat = destination.get("latitude") if destination.get("latitude") is not None else destination.get("lat")
        dest_lon = destination.get("longitude") if destination.get("longitude") is not None else destination.get("lon")
        if dest_lat is None or dest_lon is None:
            errors["destination"] = "destination requires both latitude and longitude."
        else:
            try:
                lat_f = float(dest_lat)
                lon_f = float(dest_lon)
                if not (-90.0 <= lat_f <= 90.0) or not (-180.0 <= lon_f <= 180.0):
                    errors["destination"] = "destination latitude must be [-90, 90] and longitude [-180, 180]."
                else:
                    cleaned["destination"] = {"latitude": lat_f, "longitude": lon_f}
            except (ValueError, TypeError):
                errors["destination"] = "destination coordinates must be numeric."

    # Prevent identical origin and destination
    if "origin" in cleaned and "destination" in cleaned:
        if (abs(cleaned["origin"]["latitude"] - cleaned["destination"]["latitude"]) < 1e-6 and
            abs(cleaned["origin"]["longitude"] - cleaned["destination"]["longitude"]) < 1e-6):
            errors["destination"] = "destination coordinates must be different from origin coordinates."

    if errors:
        return False, errors, None

    return True, {}, cleaned


def validate_route_alerts_request(data):
    """
    Validates payload for route-based alerts.
    Expected: {
      "route_coordinates": [[lon, lat], ...] OR [{"latitude": ..., "longitude": ...}, ...],
      "buffer_meters": Optional float (default 200.0)
    }
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    coords = data.get("route_coordinates") or data.get("coordinates") or data.get("points")
    if not coords or not isinstance(coords, list) or len(coords) < 2:
        errors["route_coordinates"] = "route_coordinates is required and must contain at least 2 coordinate points."
        return False, errors, None

    normalized_coords = []
    for idx, pt in enumerate(coords):
        if isinstance(pt, (list, tuple)) and len(pt) >= 2:
            try:
                # GeoJSON standard is [longitude, latitude]
                lon = float(pt[0])
                lat = float(pt[1])
                if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
                    errors["route_coordinates"] = f"Point at index {idx} has coordinates out of valid range."
                    break
                normalized_coords.append((lat, lon))
            except (ValueError, TypeError):
                errors["route_coordinates"] = f"Point at index {idx} must contain numeric coordinates."
                break
        elif isinstance(pt, dict):
            lat_val = pt.get("latitude") if pt.get("latitude") is not None else pt.get("lat")
            lon_val = pt.get("longitude") if pt.get("longitude") is not None else pt.get("lon")
            if lat_val is None or lon_val is None:
                errors["route_coordinates"] = f"Point at index {idx} is missing latitude or longitude."
                break
            try:
                lat = float(lat_val)
                lon = float(lon_val)
                if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
                    errors["route_coordinates"] = f"Point at index {idx} has coordinates out of valid range."
                    break
                normalized_coords.append((lat, lon))
            except (ValueError, TypeError):
                errors["route_coordinates"] = f"Point at index {idx} coordinates must be numeric."
                break
        else:
            errors["route_coordinates"] = f"Invalid point format at index {idx}."
            break

    if "route_coordinates" in errors:
        return False, errors, None

    cleaned["route_coordinates"] = normalized_coords

    # buffer_meters (optional)
    buf = data.get("buffer_meters", 200.0)
    try:
        buf_val = float(buf)
        if buf_val <= 0 or buf_val > 5000.0:
            errors["buffer_meters"] = "buffer_meters must be between 1 and 5000 meters."
        else:
            cleaned["buffer_meters"] = buf_val
    except (ValueError, TypeError):
        errors["buffer_meters"] = "buffer_meters must be a valid numeric value."

    if errors:
        return False, errors, None

    return True, {}, cleaned


ALLOWED_USER_ROLES = {
    "citizen",
    "employer",
    "traffic_police",
    "traffic_authority",
    "emergency_service",
    "road_operator",
    "admin"
}


def validate_registration_payload(data, official_invite_code=None):
    """
    Validates user registration payload.
    Ensures that claiming an authorized official role requires a matching official invite code.
    Employer and citizen roles can register without an official municipal code.
    Returns: (is_valid: bool, errors: dict, cleaned: dict)
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    username = data.get("username")
    if not username or not isinstance(username, str):
        errors["username"] = "username is required and must be a string."
    else:
        u = username.strip().lower()
        if len(u) < 3 or len(u) > 30:
            errors["username"] = "username must be between 3 and 30 characters long."
        elif not all(c.isalnum() or c == "_" for c in u):
            errors["username"] = "username can only contain alphanumeric characters and underscores."
        else:
            cleaned["username"] = u

    email = data.get("email")
    if not email or not isinstance(email, str):
        errors["email"] = "email is required and must be a valid email string."
    else:
        em = email.strip().lower()
        if "@" not in em or "." not in em.split("@")[-1] or len(em) < 5:
            errors["email"] = "Please provide a valid email address."
        else:
            cleaned["email"] = em

    password = data.get("password")
    if not password or not isinstance(password, str):
        errors["password"] = "password is required."
    elif len(password) < 6:
        errors["password"] = "password must be at least 6 characters long."
    else:
        cleaned["password"] = password

    role = data.get("role", "citizen")
    if not isinstance(role, str):
        errors["role"] = "role must be a string."
    else:
        r = role.strip().lower()
        if r not in ALLOWED_USER_ROLES:
            errors["role"] = f"Invalid role '{role}'. Allowed roles: {sorted(list(ALLOWED_USER_ROLES))}"
        else:
            if r in ("citizen", "employer"):
                cleaned["role"] = r
            else:
                # Official privileged role requested: verify official invite code
                code = data.get("official_key") or data.get("invite_code")
                if not code or (official_invite_code and code != official_invite_code):
                    errors["role"] = f"A valid official invite code is required to register with role '{r}'."
                else:
                    cleaned["role"] = r

    badge = data.get("badge_number")
    cleaned["badge_number"] = badge.strip() if isinstance(badge, str) else None
    agency = data.get("agency")
    cleaned["agency"] = agency.strip() if isinstance(agency, str) else None

    if errors:
        return False, errors, None

    return True, {}, cleaned


def validate_login_payload(data):
    """
    Validates user login payload.
    Returns: (is_valid: bool, errors: dict, cleaned: dict)
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    identifier = data.get("username") or data.get("email")
    if not identifier or not isinstance(identifier, str) or not identifier.strip():
        errors["username"] = "username or email is required."
    else:
        cleaned["identifier"] = identifier.strip().lower()

    password = data.get("password")
    if not password or not isinstance(password, str) or not password:
        errors["password"] = "password is required."
    else:
        cleaned["password"] = password

    if errors:
        return False, errors, None

    return True, {}, cleaned


def validate_emergency_sos_payload(data):
    """
    Validates request payload for Emergency SOS endpoint.
    Accepts:
      - latitude (required, numeric, -90.0 to 90.0)
      - longitude (required, numeric, -180.0 to 180.0)
      - description (optional string)
      - location_name (optional string)
    Returns: (is_valid: bool, errors: dict, cleaned: dict)
    """
    if not isinstance(data, dict):
        return False, {"error": "Request body must be a JSON object."}, None

    errors = {}
    cleaned = {}

    # latitude
    lat = data.get("latitude") if data.get("latitude") is not None else data.get("lat")
    if lat is None:
        errors["latitude"] = "latitude is required."
    else:
        try:
            lat_val = float(lat)
            if not (-90.0 <= lat_val <= 90.0):
                errors["latitude"] = "latitude must be between -90.0 and 90.0 degrees."
            else:
                cleaned["latitude"] = lat_val
        except (ValueError, TypeError):
            errors["latitude"] = "latitude must be a valid numeric floating point value."

    # longitude
    lon = data.get("longitude") if data.get("longitude") is not None else data.get("lon")
    if lon is None:
        errors["longitude"] = "longitude is required."
    else:
        try:
            lon_val = float(lon)
            if not (-180.0 <= lon_val <= 180.0):
                errors["longitude"] = "longitude must be between -180.0 and 180.0 degrees."
            else:
                cleaned["longitude"] = lon_val
        except (ValueError, TypeError):
            errors["longitude"] = "longitude must be a valid numeric floating point value."

    # description (optional)
    description = data.get("description")
    if description is not None:
        if not isinstance(description, str):
            errors["description"] = "description must be a string."
        else:
            cleaned["description"] = description.strip() or "Emergency SOS broadcast"
    else:
        cleaned["description"] = "Emergency SOS broadcast"

    # location_name (optional)
    location_name = data.get("location_name")
    if location_name is not None:
        if not isinstance(location_name, str):
            errors["location_name"] = "location_name must be a string."
        else:
            cleaned["location_name"] = location_name.strip()
    else:
        cleaned["location_name"] = None

    if errors:
        return False, errors, None

    # Fallback to coordinate-based location name if empty or omitted
    if not cleaned.get("location_name"):
        cleaned["location_name"] = f"Emergency SOS ({cleaned['latitude']:.4f}, {cleaned['longitude']:.4f})"

    return True, {}, cleaned




