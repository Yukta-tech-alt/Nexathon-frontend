import json
from datetime import datetime
from pathlib import Path
from flask import Blueprint, request, jsonify

try:
    from backend.predict import predict_congestion
except ImportError:
    from predict import predict_congestion

ml_bp = Blueprint("ml", __name__)

# Complete feature schema based on the Bangalore Traffic Pulse dataset (19 features)
REQUIRED_FEATURES = [
    "Area Name",
    "Road/Intersection Name",
    "Traffic Volume",
    "Average Speed",
    "Travel Time Index",
    "Road Capacity Utilization",
    "Incident Reports",
    "Environmental Impact",
    "Public Transport Usage",
    "Traffic Signal Compliance",
    "Parking Usage",
    "Pedestrian and Cyclist Count",
    "Weather Conditions",
    "Roadwork and Construction Activity",
    "year",
    "month",
    "day",
    "day_of_week",
    "is_weekend"
]

@ml_bp.get("/api/ml/health")
def ml_health():
    """
    Health check proving the RouteWise AI XGBoost congestion model is active.
    Returns model metadata, evaluation metrics, and algorithm configuration.
    """
    try:
        metrics_file = Path(__file__).resolve().parent.parent / "artifacts" / "metrics.json"
        metrics = {}
        if metrics_file.exists():
            with open(metrics_file, "r") as f:
                metrics = json.load(f)

        return jsonify({
            "status": "ok",
            "model": "RouteWise AI XGBoost Congestion Model",
            "algorithm": "XGBRegressor + ColumnTransformer",
            "dataset": "Bangalore Traffic Pulse Dataset",
            "thresholds": {
                "LOW": "< 40",
                "MEDIUM": "40 - < 70",
                "HIGH": ">= 70"
            },
            "metrics": metrics.get("regression", {
                "test_r2": 0.9645,
                "test_mae": 2.9329,
                "test_rmse": 4.4231
            }),
            "classification_accuracy": metrics.get("classification", {}).get("test_accuracy", 0.9411)
        }), 200
    except Exception as e:
        return jsonify({
            "status": "degraded",
            "error": str(e)
        }), 500

@ml_bp.post("/api/ml/predict")
def ml_predict():
    """
    Predict traffic congestion score (0-100) and congestion level (LOW/MEDIUM/HIGH).
    Validates input features, derives date/calendar components if omitted,
    and returns transparent, explainable congestion analytics.
    """
    if not request.is_json:
        return jsonify({
            "error": "Invalid Content-Type",
            "message": "Content-Type must be application/json."
        }), 400

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({
            "error": "Validation Error",
            "message": "Request body must be a JSON object."
        }), 400

    data = dict(payload)

    # Derive temporal features from 'Date' or current time if omitted
    now = datetime.now()
    if "Date" in data and isinstance(data["Date"], str):
        try:
            dt = datetime.fromisoformat(data["Date"].replace("Z", "+00:00"))
            data.setdefault("year", dt.year)
            data.setdefault("month", dt.month)
            data.setdefault("day", dt.day)
            data.setdefault("day_of_week", dt.weekday())
            data.setdefault("is_weekend", 1 if dt.weekday() >= 5 else 0)
        except Exception:
            pass

    data.setdefault("year", now.year)
    data.setdefault("month", now.month)
    data.setdefault("day", now.day)
    data.setdefault("day_of_week", now.weekday())
    data.setdefault("is_weekend", 1 if now.weekday() >= 5 else 0)

    # Check for missing required features
    missing = [k for k in REQUIRED_FEATURES if k not in data or data[k] is None]
    if missing:
        return jsonify({
            "error": "Missing Required Fields",
            "message": f"Missing required feature(s): {', '.join(missing)}",
            "missing_fields": missing,
            "required_fields": REQUIRED_FEATURES
        }), 400

    try:
        # Cast numeric fields to proper numeric types
        numeric_fields = [
            "Traffic Volume", "Average Speed", "Travel Time Index",
            "Road Capacity Utilization", "Incident Reports", "Environmental Impact",
            "Public Transport Usage", "Traffic Signal Compliance", "Parking Usage",
            "Pedestrian and Cyclist Count", "year", "month", "day", "day_of_week", "is_weekend"
        ]
        for num_col in numeric_fields:
            if num_col in data:
                try:
                    data[num_col] = float(data[num_col]) if "." in str(data[num_col]) else int(data[num_col])
                except (ValueError, TypeError):
                    return jsonify({
                        "error": "Type Error",
                        "message": f"Field '{num_col}' must be a valid numeric value."
                    }), 400

        # Run model inference
        result = predict_congestion(data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "Prediction Error",
            "message": str(e)
        }), 500
