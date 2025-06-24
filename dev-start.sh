#!/bin/bash

echo "🚀 Starting Task Manager Development Environment..."

# Check if PostgreSQL is running (local installation)
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting PostgreSQL..."
    if command -v brew &> /dev/null; then
        brew services start postgresql@15
    else
        echo "❌ Please start PostgreSQL manually"
        exit 1
    fi
    sleep 2
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw task_manager; then
    echo "📦 Creating task_manager database..."
    createdb task_manager
fi

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Kill existing processes on ports 3000 and 3001
if check_port 3000; then
    echo "🔄 Killing existing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
fi

if check_port 3001; then
    echo "🔄 Killing existing process on port 3001..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Run database migrations
echo "🗄️  Running database migrations..."
cd backend && npm run db:migrate && cd ..

# Check if .env files exist with proper values
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please check SETUP.md for configuration."
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file not found. Please check SETUP.md for configuration."
    exit 1
fi

# Start backend server in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend server in background
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
wait
