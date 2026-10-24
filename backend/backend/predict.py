import os
import warnings
from pathlib import Path
import joblib
import pandas as pd

# Suppress serialization version notices from scikit-learn / xgboost
warnings.filterwarnings("ignore")

CURRENT_DIR = Path(__file__).resolve().parent
REG_MODEL_PATH = CURRENT_DIR / "artifacts" / "routewise_xgboost_congestion_regressor.joblib"

# Lazy-loaded model instance to minimize cold start overhead
_model = None

def get_model():
    """Retrieve or load the cached XGBoost congestion regressor pipeline."""
    global _model
    if _model is None:
        if REG_MODEL_PATH.exists():
            _model = joblib.load(str(REG_MODEL_PATH))
        else:
            # Fallback path if invoked from different working directory
            alt_path = Path("artifacts") / "routewise_xgboost_congestion_regressor.joblib"
            if alt_path.exists():
                _model = joblib.load(str(alt_path))
            else:
                raise FileNotFoundError(f"Trained RouteWise XGBoost model not found at {REG_MODEL_PATH}")
    return _model

def predict_congestion(payload: dict):
    """
    Predict traffic congestion score (0-100) and congestion level (LOW/MEDIUM/HIGH)
    using the trained XGBoost model pipeline.
    """
    model = get_model()
    row = pd.DataFrame([payload])
    raw_score = float(model.predict(row)[0])
    score = max(0.0, min(100.0, raw_score))

    if score < 40.0:
        level = "LOW"
    elif score < 70.0:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return {
        "congestion_score": round(score, 2),
        "congestion_level": level,
        "model_type": "RouteWise AI XGBoost Congestion Regressor (R² = 0.9645)"
    }
