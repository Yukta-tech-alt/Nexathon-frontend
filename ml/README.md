# RouteWise AI — ML V2

This package uses the uploaded **Banglore_traffic_Dataset.csv** with the real `Congestion Level` target.

## Dataset
- Rows: 8,936
- Columns: 16 original fields
- Date range: 2022-01-01 to 2024-08-09
- Missing values: 0
- Duplicate rows: 0

## Models
1. **XGBoost Regression** — predicts a congestion score from 0–100.
2. **XGBoost Classification** — maps the score into:
   - LOW: <40
   - MEDIUM: 40–<70
   - HIGH: >=70

## Unseen-test results
Regression:
- MAE: 2.933
- RMSE: 4.423
- R²: 0.9645

Classification:
- Accuracy: 94.11%
- Macro F1: 89.17%

## Flask integration
Add:
`from api.ml_routes import ml_bp`
`app.register_blueprint(ml_bp)`

Then call:
POST `/api/ml/predict`

No frontend redesign is required. Connect this endpoint to the existing RouteWise AI UI.
