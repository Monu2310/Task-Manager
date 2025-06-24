# 🚀 Quick Start Guide

## Prerequisites Check ✅

- [x] PostgreSQL running on port 5439
- [x] Node.js 18+ installed
- [x] Google Gemini API key configured
- [x] All dependencies installed

## Start Development Servers

### Option 1: Start Everything at Once

```bash
# From project root
npm run dev
```

### Option 2: Start Individually

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Access Applications

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/docs
- **Database:** localhost:5439

## Test the Application

1. **Register a new user:**

   - Go to http://localhost:3000
   - Click "Register" and create an account

2. **Generate AI tasks:**

   - Login to your account
   - Use the "AI Task Generator"
   - Enter any topic (e.g., "Learn Python")
   - Click "Generate" to get 5 AI-powered tasks

3. **Manage tasks:**
   - Save generated tasks
   - Mark tasks as complete
   - Edit task titles
   - Filter by category/status

## Useful Commands

```bash
# Database operations
psql -h localhost -p 5439 -U mayankmonu -d task_manager

# Check server status
curl http://localhost:3001
curl http://localhost:3000

# View database tables
cd backend && npm run db:studio

# Reset database (⚠️ deletes all data)
docker-compose down -v
docker-compose up postgres -d
cd backend && npm run db:migrate
```

## Troubleshooting

**Port conflicts:**

```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5439 | xargs kill -9  # PostgreSQL
```

**PostgreSQL not running:**

```bash
brew services restart postgresql@15
```

**Environment issues:**

- Check `backend/.env` has correct DATABASE_URL
- Verify GEMINI_API_KEY is set
- Ensure JWT_SECRET is configured

---

🎉 **Your AI-powered Task Manager is ready to use!**
