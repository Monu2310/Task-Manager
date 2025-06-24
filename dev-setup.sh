#!/bin/bash

echo "🚀 Task Manager Development Setup (No Docker)"
echo "=============================================="
echo ""
echo "⚠️  This setup assumes you have PostgreSQL installed locally."
echo "   If you don't have PostgreSQL, you can:"
echo "   - Install via Homebrew: brew install postgresql"
echo "   - Or use a cloud database like Neon.tech"
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  IMPORTANT: Please add your GEMINI_API_KEY to backend/.env"
    echo "   Get it from: https://aistudio.google.com/"
    echo ""
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend .env.local file..."
    cp frontend/.env.example frontend/.env.local
fi

echo "📊 Setting up database (if PostgreSQL is running)..."
echo "   Database URL: postgresql://postgres:password123@localhost:5432/task_manager"
echo ""

# Try to create database
echo "Creating database..."
createdb task_manager 2>/dev/null || echo "Database might already exist or PostgreSQL not running"

# Run migrations
echo "🔄 Running database migrations..."
cd backend
npm run db:migrate 2>/dev/null || echo "⚠️  Migration failed - check your database connection"
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Add your GEMINI_API_KEY to backend/.env"
echo "2. Ensure PostgreSQL is running on port 5432"
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "📚 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Documentation: http://localhost:3001/docs"
