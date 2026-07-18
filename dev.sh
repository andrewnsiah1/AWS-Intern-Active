#!/bin/bash
# Local development script
# Starts both the backend (FastAPI) and serves the frontend

echo "🧙‍♂️ Starting the AWS Wizard Game locally..."
echo ""

# Check if running backend or frontend
case "${1:-all}" in
    backend)
        echo "Starting backend on http://localhost:8000"
        cd backend
        pip install -r requirements.txt -q
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ;;
    frontend)
        echo "Starting frontend on http://localhost:3000"
        cd frontend
        python3 -m http.server 3000
        ;;
    all)
        echo "Starting backend on http://localhost:8000"
        echo "Starting frontend on http://localhost:3000"
        echo ""
        echo "Run in separate terminals:"
        echo "  ./dev.sh backend"
        echo "  ./dev.sh frontend"
        echo ""
        echo "Or run just the frontend (uses fallback mode without backend):"
        echo "  ./dev.sh frontend"
        ;;
esac
