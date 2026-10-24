from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """
    Represents an authenticated RoadTruth account (citizen or official).
    Stores account role server-side to prevent privilege escalation.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False, default="citizen", index=True)
    badge_number = db.Column(db.String(100), nullable=True)
    agency = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def __init__(
        self,
        username=None,
        email=None,
        password=None,
        password_hash=None,
        role="citizen",
        badge_number=None,
        agency=None,
        is_active=True,
        created_at=None,
        **kwargs
    ):
        super().__init__(**kwargs)
        if username is not None:
            self.username = username
        if email is not None:
            self.email = email
        if password_hash is not None:
            self.password_hash = password_hash
        elif password is not None:
            self.set_password(password)
        if role is not None:
            self.role = role
        self.badge_number = badge_number
        self.agency = agency
        self.is_active = is_active
        if created_at is not None:
            self.created_at = created_at

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Serialize user to safe public dictionary without exposing password_hash."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "badge_number": self.badge_number,
            "agency": self.agency,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User id={self.id} username='{self.username}' role='{self.role}'>"


class Incident(db.Model):
    """
    Represents a verified or community-reported road traffic incident.
    """
    __tablename__ = "incidents"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Type of incident: e.g., 'accident', 'congestion', 'roadwork', 'hazard', 'weather'
    incident_type = db.Column(db.String(50), nullable=False, index=True)
    
    # Detailed description of the incident
    description = db.Column(db.Text, nullable=True)
    
    # Human-readable location / landmark name
    location_name = db.Column(db.String(255), nullable=False)
    
    # GPS Coordinates
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    # Identifier of the reporter (e.g. user_id, device_hash, or system source)
    reporter_id = db.Column(db.String(100), nullable=False, index=True)
    
    # Verification status: 'pending', 'verified', 'disputed', 'cleared'
    verification_status = db.Column(db.String(30), nullable=False, default="pending", index=True)
    
    # Trust score: weighted score (e.g., 0.0 to 1.0) based on consensus & reporter reputation
    trust_score = db.Column(db.Float, nullable=False, default=1.0)
    
    # Estimated time when the incident will clear
    estimated_clearance_time = db.Column(db.DateTime, nullable=True)

    # Actual time when the incident was cleared / resolved
    cleared_at = db.Column(db.DateTime, nullable=True)

    # Baseline clearance duration in minutes for this incident category
    baseline_duration_minutes = db.Column(db.Integer, nullable=True)
    
    # Severity level: 'minor', 'moderate', 'severe', 'critical'
    severity = db.Column(db.String(20), nullable=False, default="moderate", index=True)
    
    # When this incident report was created
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationship to verifications / supporting info
    verifications = db.relationship(
        "IncidentVerification",
        back_populates="incident",
        cascade="all, delete-orphan",
        lazy="select",
        order_by="desc(IncidentVerification.created_at)"
    )

    def __init__(
        self,
        incident_type=None,
        description=None,
        location_name=None,
        latitude=None,
        longitude=None,
        reporter_id=None,
        verification_status="pending",
        trust_score=0.40,
        estimated_clearance_time=None,
        cleared_at=None,
        baseline_duration_minutes=None,
        severity="moderate",
        created_at=None,
        **kwargs
    ):
        super().__init__(**kwargs)
        if incident_type is not None:
            self.incident_type = incident_type
        self.description = description
        if location_name is not None:
            self.location_name = location_name
        if latitude is not None:
            self.latitude = latitude
        if longitude is not None:
            self.longitude = longitude
        if reporter_id is not None:
            self.reporter_id = reporter_id
        if verification_status is not None:
            self.verification_status = verification_status
        if trust_score is not None:
            self.trust_score = trust_score
        self.estimated_clearance_time = estimated_clearance_time
        self.cleared_at = cleared_at
        self.baseline_duration_minutes = baseline_duration_minutes
        if severity is not None:
            self.severity = severity
        if created_at is not None:
            self.created_at = created_at

    def to_dict(self, include_verifications=True, public_view=False):
        """
        Serialize incident to JSON-friendly dictionary.
        public_view=True omits reporter_id to protect user privacy in public feeds.
        """
        is_cleared = (self.verification_status == "cleared") or (self.cleared_at is not None)
        
        # Calculate actual duration if cleared
        duration_mins = None
        if is_cleared and self.cleared_at and self.created_at:
            delta = self.cleared_at - self.created_at
            duration_mins = max(1, int(delta.total_seconds() / 60.0))

        ver_list = list(getattr(self, "verifications", None) or [])

        data = {
            "id": self.id,
            "incident_type": self.incident_type,
            "description": self.description,
            "location_name": self.location_name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "verification_status": self.verification_status,
            "status": "cleared" if is_cleared else "active",
            "is_cleared": is_cleared,
            "severity": self.severity or "moderate",
            "trust_score": round(self.trust_score, 2),
            "estimated_clearance_time": (
                self.estimated_clearance_time.isoformat()
                if self.estimated_clearance_time else None
            ),
            "cleared_at": (
                self.cleared_at.isoformat()
                if self.cleared_at else None
            ),
            "baseline_duration_minutes": self.baseline_duration_minutes,
            "actual_duration_minutes": duration_mins,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),
            "verification_count": len(ver_list)
        }

        if not public_view:
            data["reporter_id"] = self.reporter_id

        if include_verifications and ver_list:
            data["verifications"] = [v.to_dict() for v in ver_list]
        else:
            data["verifications"] = []
        return data


    def __repr__(self):
        return f"<Incident id={self.id} type='{self.incident_type}' location='{self.location_name}' status='{self.verification_status}'>"


class IncidentVerification(db.Model):
    """
    Represents supporting evidence, community confirmation, or official verification for an incident.
    """
    __tablename__ = "incident_verifications"
    __table_args__ = (
        db.UniqueConstraint("incident_id", "verifier_id", name="uq_incident_verifier"),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    incident_id = db.Column(
        db.Integer,
        db.ForeignKey("incidents.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Identifier of person/authority providing confirmation/evidence
    verifier_id = db.Column(db.String(100), nullable=False, index=True)
    
    # Role: 'police', 'traffic_authority', 'emergency_service', 'road_operator', 'citizen', etc.
    verifier_role = db.Column(db.String(50), nullable=False, default="citizen")
    
    # Action taken: 'confirm', 'dispute', 'clear'
    action = db.Column(db.String(30), nullable=False)
    
    # Supporting notes or observations
    supporting_info = db.Column(db.Text, nullable=True)
    
    # Optional URL to photo/video/dashcam proof
    evidence_url = db.Column(db.String(500), nullable=True)
    
    # Verification timestamp
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    incident = db.relationship("Incident", back_populates="verifications")

    def __init__(
        self,
        incident_id=None,
        verifier_id=None,
        verifier_role="citizen",
        action=None,
        supporting_info=None,
        evidence_url=None,
        created_at=None,
        **kwargs
    ):
        super().__init__(**kwargs)
        if incident_id is not None:
            self.incident_id = incident_id
        if verifier_id is not None:
            self.verifier_id = verifier_id
        if verifier_role is not None:
            self.verifier_role = verifier_role
        if action is not None:
            self.action = action
        self.supporting_info = supporting_info
        self.evidence_url = evidence_url
        if created_at is not None:
            self.created_at = created_at

    def to_dict(self):
        """Serialize verification to JSON-friendly dictionary."""
        return {
            "id": self.id,
            "incident_id": self.incident_id,
            "verifier_id": self.verifier_id,
            "verifier_role": self.verifier_role,
            "action": self.action,
            "supporting_info": self.supporting_info,
            "evidence_url": self.evidence_url,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }

    def __repr__(self):
        return f"<IncidentVerification id={self.id} incident_id={self.incident_id} action='{self.action}' by='{self.verifier_id}'>"

