import pandas as pd, joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor, XGBClassifier

CSV="data/Banglore_traffic_Dataset.csv"
df=pd.read_csv(CSV)
df["Date"]=pd.to_datetime(df["Date"])
df=df.sort_values("Date").reset_index(drop=True)
df["year"]=df["Date"].dt.year
df["month"]=df["Date"].dt.month
df["day"]=df["Date"].dt.day
df["day_of_week"]=df["Date"].dt.dayofweek
df["is_weekend"]=(df["day_of_week"]>=5).astype(int)
df["Congestion Class"]=pd.cut(
    df["Congestion Level"], bins=[-float("inf"),40,70,float("inf")],
    labels=["LOW","MEDIUM","HIGH"], right=False
)
features=[c for c in df.columns if c not in ["Date","Congestion Level","Congestion Class"]]
X=df[features]; y=df["Congestion Level"]
cat=[c for c in features if X[c].dtype=="object"]
num=[c for c in features if c not in cat]
prep=ColumnTransformer([("cat",OneHotEncoder(handle_unknown="ignore"),cat),("num","passthrough",num)])
reg=Pipeline([("prep",prep),("model",XGBRegressor(
    n_estimators=500,max_depth=6,learning_rate=.04,subsample=.9,
    colsample_bytree=.9,objective="reg:squarederror",random_state=42,n_jobs=4))])
reg.fit(X,y)
joblib.dump(reg,"artifacts/routewise_xgboost_congestion_regressor.joblib")
print("Saved regression model.")
