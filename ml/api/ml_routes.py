from flask import Blueprint, request, jsonify
from predict import predict_congestion

ml_bp=Blueprint("ml",__name__)

@ml_bp.get("/api/ml/health")
def ml_health():
    return jsonify({"status":"ok","model":"RouteWise AI XGBoost congestion model"})

@ml_bp.post("/api/ml/predict")
def ml_predict():
    payload=request.get_json(silent=True) or {}
    required=[
        "Area Name","Road/Intersection Name","Traffic Volume","Average Speed",
        "Travel Time Index","Road Capacity Utilization","Incident Reports",
        "Environmental Impact","Public Transport Usage","Traffic Signal Compliance",
        "Parking Usage","Pedestrian and Cyclist Count","Weather Conditions",
        "Roadwork and Construction Activity","year","month","day","day_of_week","is_weekend"
    ]
    missing=[k for k in required if k not in payload]
    if missing:
        return jsonify({"error":"Missing fields","missing":missing}),400
    return jsonify(predict_congestion(payload))
