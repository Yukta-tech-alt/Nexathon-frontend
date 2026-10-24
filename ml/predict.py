import joblib, pandas as pd

REG_MODEL="artifacts/routewise_xgboost_congestion_regressor.joblib"
reg_model=joblib.load(REG_MODEL)

def predict_congestion(payload: dict):
    row=pd.DataFrame([payload])
    score=float(reg_model.predict(row)[0])
    score=max(0.0,min(100.0,score))
    if score < 40:
        level="LOW"
    elif score < 70:
        level="MEDIUM"
    else:
        level="HIGH"
    return {"congestion_score":round(score,2),"congestion_level":level}
