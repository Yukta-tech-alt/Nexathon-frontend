import os
import sys
from pathlib import Path

# Base paths
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
VENV_PYTHON = BACKEND_DIR / "venv" / "Scripts" / "python.exe"

# If not running under venv and venv python exists, re-exec using venv python
if VENV_PYTHON.exists() and sys.executable.lower() != str(VENV_PYTHON).lower():
    import subprocess
    sys.exit(subprocess.call([str(VENV_PYTHON), str(BACKEND_DIR / "app.py")]))

# Otherwise import and run app directly
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from backend.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    print(f">> Starting RoadTruth Backend on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=debug)
