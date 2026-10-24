import functools
from typing import Optional
from flask import request, jsonify, g, current_app
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from backend.models import User

AUTH_SALT = "roadtruth-auth-token-salt"

def get_serializer():
    """Returns itsdangerous URLSafeTimedSerializer using application SECRET_KEY."""
    secret = current_app.config.get("SECRET_KEY") or "default-dev-secret-roadtruth"
    return URLSafeTimedSerializer(secret)

def generate_auth_token(user: User, expires_in_sec: Optional[int] = None) -> str:
    """Generates a secure, signed URL-safe authentication token."""
    s = get_serializer()
    payload = {
        "user_id": user.id,
        "username": user.username,
        "role": user.role
    }
    return s.dumps(payload, salt=AUTH_SALT)

def decode_auth_token(token: str, max_age: Optional[int] = None):
    """
    Decodes and verifies token signature and expiration.
    Returns: payload dict or None if invalid/expired.
    """
    s = get_serializer()
    if max_age is None:
        max_age = current_app.config.get("TOKEN_EXPIRATION_SECONDS", 86400)
    try:
        data = s.loads(token, salt=AUTH_SALT, max_age=max_age)
        return data
    except (SignatureExpired, BadSignature, Exception):
        return None

def get_authenticated_user():
    """
    Extracts Bearer token from Authorization header or X-Auth-Token for the current request,
    validates the signature, and retrieves the active User from database.
    """
    auth_header = request.headers.get("Authorization") or request.headers.get("X-Auth-Token")
    if not auth_header:
        g.current_user = None
        return None

    token = None
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    else:
        token = auth_header.strip()

    if not token:
        g.current_user = None
        return None

    payload = decode_auth_token(token)
    if not payload or not isinstance(payload, dict):
        g.current_user = None
        return None

    user_id = payload.get("user_id")
    if not user_id:
        g.current_user = None
        return None

    user = User.query.filter_by(id=user_id, is_active=True).first()
    g.current_user = user
    return user

def login_required(f):
    """Decorator requiring a valid authenticated user session."""
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_authenticated_user()
        if not user:
            return jsonify({
                "error": "Unauthorized",
                "message": "Authentication required. Please provide a valid Bearer token in Authorization header."
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def roles_required(*allowed_roles):
    """Decorator restricting route access to specific server-side user roles."""
    def decorator(f):
        @functools.wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_authenticated_user()
            if not user:
                return jsonify({
                    "error": "Unauthorized",
                    "message": "Authentication required. Please provide a valid Bearer token."
                }), 401
            if user.role not in allowed_roles:
                return jsonify({
                    "error": "Forbidden",
                    "message": f"Access denied. User role '{user.role}' is not authorized for this action.",
                    "required_roles": list(allowed_roles)
                }), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
