#!/bin/bash

echo "🚀 Setting up Task Manager Application..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Copy environment files
echo "📝 Setting up environment files..."
cp backend/.env.example backend/.env

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Add your Google Gemini API key to backend/.env"
echo "2. Update DATABASE_URL in backend/.env if using external database"
echo "3. Run 'npm run docker:up' to start with Docker"
echo "4. Or run 'npm run dev' for local development"
echo ""
echo "📚 API Documentation will be available at: http://localhost:3001/docs"
echo "🌐 Frontend will be available at: http://localhost:3000"
