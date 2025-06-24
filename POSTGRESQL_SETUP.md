# PostgreSQL Setup Guide (Port 5439)

## 🗄️ Option 1: Docker Setup (Recommended for Development)

### Using Docker Compose

This is the easiest way to set up PostgreSQL with your custom port:

```bash
# 1. Create environment file
cp .env.production .env

# 2. Update .env with your settings
# Set POSTGRES_PASSWORD to a secure password

# 3. Start PostgreSQL container
docker-compose up postgres -d

# 4. Verify connection
docker-compose logs postgres
```

The PostgreSQL server will be running on **port 5439** on your local machine.

**Connection Details:**

- Host: `localhost`
- Port: `5439`
- Database: `task_manager`
- Username: `postgres`
- Password: (whatever you set in POSTGRES_PASSWORD)

### Connect to Database

```bash
# Using psql (if installed locally)
psql -h localhost -p 5439 -U postgres -d task_manager

# Using Docker exec
docker-compose exec postgres psql -U postgres -d task_manager
```

---

## 🖥️ Option 2: Local PostgreSQL Installation

### macOS Installation

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Add PostgreSQL binaries to your PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Start PostgreSQL service
brew services start postgresql@15

# Create database (if it doesn't exist)
createdb -p 5439 task_manager
```

### Configure Custom Port (5439)

1. **Find PostgreSQL configuration file:**

```bash
# Find the config file location
brew --prefix postgresql@15
# Usually: /opt/homebrew/var/postgresql@15/postgresql.conf
```

2. **Edit configuration:**

```bash
# Open config file
nano /opt/homebrew/var/postgresql@15/postgresql.conf

# Find and change the port line:
port = 5439
```

3. **Restart PostgreSQL:**

```bash
brew services restart postgresql@15
```

4. **Create database and user:**

```bash
# Connect to PostgreSQL
psql -h localhost -p 5439 -U $(whoami) postgres

# In psql prompt:
CREATE DATABASE task_manager;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE task_manager TO postgres;
\q
```

### Ubuntu/Debian Installation

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Switch to postgres user
sudo -u postgres psql

# In psql prompt:
ALTER USER postgres PASSWORD 'password123';
CREATE DATABASE task_manager;
\q
```

**Configure custom port:**

```bash
# Edit configuration
sudo nano /etc/postgresql/15/main/postgresql.conf

# Change port
port = 5439

# Restart service
sudo systemctl restart postgresql
```

---

## ☁️ Option 3: Cloud Database (Production)

### Neon.tech (Recommended)

1. Visit [neon.tech](https://neon.tech)
2. Create account and new project
3. Copy connection string
4. Update your `.env` file:

```bash
DATABASE_URL=postgresql://username:password@hostname:5432/database_name?sslmode=require
```

### Render.com PostgreSQL

1. In Render dashboard, create new PostgreSQL service
2. Note connection details
3. Update your environment variables

### Railway

1. Create new PostgreSQL service on Railway
2. Copy connection string from dashboard
3. Update environment variables

---

## 🔧 Backend Configuration

### Update Environment File

Create or update `backend/.env`:

```bash
# For local development
DATABASE_URL=postgresql://postgres:password123@localhost:5439/task_manager

# For production (replace with your actual credentials)
DATABASE_URL=postgresql://username:password@host:5439/database_name
```

### Test Connection

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

---

## 🐳 Complete Docker Setup

### 1. Environment Setup

```bash
# Copy environment template
cp .env.production .env

# Edit the .env file with your settings:
POSTGRES_PASSWORD=your_secure_password_here
GEMINI_API_KEY=your_actual_api_key
JWT_SECRET=your_secure_jwt_secret
```

### 2. Start All Services

```bash
# Build and start all containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check container status
docker-compose ps
```

### 3. Database Operations

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d task_manager

# Run backend migrations
docker-compose exec backend npm run db:migrate

# View backend logs
docker-compose logs backend
```

### 4. Access Applications

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/docs
- **Database:** localhost:5439

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 5439
lsof -i :5439

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or stop all PostgreSQL services
brew services stop postgresql@15
```

### Connection Errors

1. **Check PostgreSQL is running:**

```bash
# For Docker
docker-compose ps postgres

# For local installation
brew services list | grep postgresql
```

2. **Test connection:**

```bash
# Using psql
psql -h localhost -p 5439 -U postgres -d task_manager

# Using telnet
telnet localhost 5439
```

3. **Check firewall settings:**

```bash
# macOS - check if port is listening
netstat -an | grep 5439

# Linux - check firewall
sudo ufw status
```

### Database Migration Issues

```bash
# Reset database (⚠️ This will delete all data)
docker-compose down -v
docker-compose up postgres -d

# Run migrations manually
cd backend
npm run db:migrate
```

---

## 📊 Database Management Tools

### GUI Tools

- **pgAdmin:** Full-featured PostgreSQL administration
- **DBeaver:** Universal database tool
- **Postico:** macOS native PostgreSQL client

### Command Line

```bash
# Connect with psql
psql -h localhost -p 5439 -U postgres -d task_manager

# Useful commands in psql:
\l          # List databases
\dt         # List tables
\d users    # Describe users table
\q          # Quit
```

### Drizzle Studio (Included)

```bash
# Open database studio in browser
cd backend
npm run db:studio
```

---

## 🚀 Production Deployment

When deploying to production, use cloud databases with standard ports (usually 5432) for better compatibility:

1. **Neon.tech:** Automatically uses port 5432
2. **Render PostgreSQL:** Uses port 5432
3. **AWS RDS:** Uses port 5432 by default

Update your production environment variables accordingly.

---

## ✅ Quick Verification

After setup, verify everything works:

1. **Database connection:**

```bash
psql -h localhost -p 5439 -U postgres -d task_manager -c "SELECT 1;"
```

2. **Backend startup:**

```bash
cd backend && npm run dev
```

3. **Full application:**

```bash
docker-compose up -d
curl http://localhost:3001
curl http://localhost:3000
```

Your PostgreSQL server is now running on port 5439! 🎉

---

## 🎯 **SETUP COMPLETE!**

✅ **Successfully Configured:**

- PostgreSQL running on port 5439
- Backend API running on port 3001
- Frontend running on port 3000
- Database migrations completed
- Google Gemini AI integration working
- User authentication system active

### 🌐 **Access Your Application:**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/docs
- **Database:** localhost:5439 (user: mayankmonu)

### 🧪 **Test Commands:**

```bash
# Test database connection
psql -h localhost -p 5439 -U mayankmonu -d task_manager -c "SELECT 1;"

# Test backend health
curl http://localhost:3001

# Test AI task generation (requires login first)
curl -X POST http://localhost:3001/api/tasks/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"topic":"Learn something new"}'
```

🎊 **Your AI-powered Task Manager is ready!**
