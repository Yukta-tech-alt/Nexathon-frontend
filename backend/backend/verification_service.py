from datetime import datetime, timezone
from backend.models import db, Incident, IncidentVerification

# Authorized official roles with immediate verification privilege
AUTHORIZED_ROLES = {
    "police",
    "traffic_police",
    "traffic_authority",
    "emergency_service",
    "road_operator",
    "official"
}

# Thresholds for community consensus
REQUIRED_COMMUNITY_CONFIRMATIONS = 3
REQUIRED_EVIDENCE_CONFIRMATIONS = 2

def process_incident_verification(incident: Incident, cleaned_data: dict):
    """
    Applies strict verification rules to update incident status and trust score.
    
    Rules:
    1. A reporter cannot verify their own incident report.
    2. A verifier cannot submit multiple duplicate verifications for the same incident.
    3. Official authorities (police, traffic authority, emergency service, road operators)
       can immediately mark an incident as 'verified', 'cleared', or 'disputed'.
    4. Citizen reports:
       - Single citizen reports increase trust score but keep status 'pending'.
       - Requires >= 3 independent confirmations OR >= 2 confirmations with photographic/sensor
         evidence before transitioning status to 'verified'.
    5. Disputes from official authorities immediately set status to 'disputed'. Multiple
       citizen disputes mark the report as 'disputed'.
    """
    verifier_id = cleaned_data["verifier_id"]
    verifier_role = cleaned_data["verifier_role"]
    action = cleaned_data["action"]
    supporting_info = cleaned_data.get("supporting_info")
    evidence_url = cleaned_data.get("evidence_url")
    est_clearance = cleaned_data.get("estimated_clearance_time")

    # Rule 1: Reporter cannot corroborate their own incident
    if incident.reporter_id == verifier_id:
        return False, {
            "error": "Self-Verification Forbidden",
            "message": "Reporters cannot verify or corroborate their own incident reports."
        }, 400

    # Rule 2: Verifier cannot submit duplicate reviews for the same incident
    existing_verification = IncidentVerification.query.filter_by(
        incident_id=incident.id,
        verifier_id=verifier_id
    ).first()
    if existing_verification:
        return False, {
            "error": "Duplicate Verification",
            "message": f"Verifier '{verifier_id}' has already submitted verification for this incident."
        }, 409

    # Record the new verification entry
    verification = IncidentVerification(
        incident_id=incident.id,
        verifier_id=verifier_id,
        verifier_role=verifier_role,
        action=action,
        supporting_info=supporting_info,
        evidence_url=evidence_url
    )
    db.session.add(verification)

    # Optional clearance time update
    if est_clearance:
        incident.estimated_clearance_time = est_clearance

    # Fetch existing verifications to calculate consensus
    prior_verifications = list(getattr(incident, "verifications", None) or [])
    all_verifications = prior_verifications + [verification]

    confirmations = [v for v in all_verifications if v.action == "confirm"]
    disputes = [v for v in all_verifications if v.action == "dispute"]
    clearances = [v for v in all_verifications if v.action == "clear"]

    is_official = verifier_role in AUTHORIZED_ROLES
    status_changed = False
    old_status = incident.verification_status
    rationale = ""

    # --- ACTION: CONFIRM ---
    if action == "confirm":
        if is_official:
            incident.verification_status = "verified"
            incident.trust_score = 1.0
            status_changed = (old_status != "verified")
            rationale = f"Officially confirmed by authorized agency ({verifier_role})."
        else:
            # Check community consensus rules
            total_confirms = len(confirmations)
            with_evidence = sum(1 for v in confirmations if v.evidence_url)

            if total_confirms >= REQUIRED_COMMUNITY_CONFIRMATIONS:
                incident.verification_status = "verified"
                incident.trust_score = min(1.0, round(0.70 + (0.10 * total_confirms), 2))
                status_changed = (old_status != "verified")
                rationale = (
                    f"Verified via community consensus: {total_confirms} independent confirmations recorded."
                )
            elif with_evidence >= REQUIRED_EVIDENCE_CONFIRMATIONS:
                incident.verification_status = "verified"
                incident.trust_score = min(1.0, round(0.80 + (0.10 * with_evidence), 2))
                status_changed = (old_status != "verified")
                rationale = (
                    f"Verified via corroborating evidence: {with_evidence} reports submitted with photo/sensor evidence."
                )
            else:
                # Remains pending - trust score incrementally raised
                incident.trust_score = min(0.85, round(incident.trust_score + 0.10, 2))
                rationale = (
                    f"Supporting confirmation recorded. Currently {total_confirms}/{REQUIRED_COMMUNITY_CONFIRMATIONS} "
                    f"confirmations needed for community verification."
                )

    # --- ACTION: DISPUTE ---
    elif action == "dispute":
        if is_official:
            incident.verification_status = "disputed"
            incident.trust_score = 0.10
            status_changed = (old_status != "disputed")
            rationale = f"Officially disputed by authorized agency ({verifier_role})."
        else:
            total_disputes = len(disputes)
            if total_disputes >= 2:
                incident.verification_status = "disputed"
                incident.trust_score = max(0.10, round(incident.trust_score - 0.30, 2))
                status_changed = (old_status != "disputed")
                rationale = f"Multiple independent community disputes ({total_disputes}) received."
            else:
                incident.trust_score = max(0.20, round(incident.trust_score - 0.15, 2))
                rationale = "Dispute recorded and under community review."

    # --- ACTION: CLEAR ---
    elif action == "clear":
        if is_official or len(clearances) >= 2:
            incident.verification_status = "cleared"
            incident.cleared_at = datetime.now(timezone.utc)
            incident.trust_score = 1.0
            status_changed = (old_status != "cleared")
            rationale = f"Hazard reported resolved and roadway cleared by {verifier_role}."
        else:
            rationale = "Road clearance report received; awaiting independent confirmation."


    db.session.commit()

    return True, {
        "message": "Verification submitted successfully.",
        "rationale": rationale,
        "status_changed": status_changed,
        "verification": verification.to_dict(),
        "incident": incident.to_dict(include_verifications=True)
    }, 200
