@echo off
echo ====================================================
echo Starting RoadTruth Backend Server...
echo ====================================================
cd /d "%~dp0"
if exist "backend\venv\Scripts\python.exe" (
    "backend\venv\Scripts\python.exe" backend\app.py
) else (
    python backend\app.py
)
pause
