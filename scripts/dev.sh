#!/bin/bash

# Development startup script
echo "Starting Cyber Sanrakshak development environment..."

# Start backend
echo "Starting backend server..."
cd packages/backend && npm start &
BACKEND_PID=$!

# Start frontend  
echo "Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Start ML service
echo "Starting ML service..."
cd ../ml-service && python start.py &
ML_PID=$!

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID $ML_PID 2>/dev/null
    exit 0
}

trap cleanup INT
wait