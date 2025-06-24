# Task Manager Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Google Gemini API Key (for AI task generation)

## Quick Start

1. **Clone and setup dependencies:**

   ```bash
   cd w3dev
   npm install  # Install root dependencies
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Setup PostgreSQL Database:**

   ```bash
   # If using Homebrew (macOS)
   brew install postgresql@15
   brew services start postgresql@15
   createdb task_manager
   ```

3. **Configure Environment Variables:**

   **Backend (.env):**

   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/task_manager
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
   JWT_SECRET=your_super_secret_jwt_key_for_development
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend (.env.local):**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Get Google Gemini API Key:**

   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Copy the API key to your backend .env file

5. **Run Database Migrations:**

   ```bash
   cd backend
   npm run db:migrate
   ```

6. **Start Development Servers:**

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

7. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

## Features

✅ **Completed Features:**

- User authentication (register/login)
- JWT-based authorization
- Task CRUD operations
- AI-powered task generation via Google Gemini
- PostgreSQL database with Drizzle ORM
- Modern React frontend with Next.js 15
- Responsive UI with ShadCN components
- Zustand state management
- Express.js backend with TypeScript
- Comprehensive API documentation
- Database migrations
- Input validation
- Error handling

🔧 **Development Features:**

- Hot reload for both frontend and backend
- TypeScript support
- ESLint configuration
- Prettier formatting
- Development database setup
- API endpoint testing

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get user tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `POST /api/tasks/generate` - Generate tasks with AI

## Database Schema

### Users

- id (UUID, primary key)
- email (unique)
- password (hashed)
- name
- createdAt, updatedAt

### Tasks

- id (UUID, primary key)
- userId (foreign key)
- title
- description
- status (pending, in_progress, completed)
- category (personal, work, education, health, other)
- isCompleted
- completedAt
- createdAt, updatedAt

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@15

# Check database exists
psql -l | grep task_manager
```

### Port Already in Use

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### API Key Issues

- Ensure your Gemini API key is valid
- Check quotas in Google AI Studio
- Verify the API key has proper permissions

## Production Deployment

### Backend (Render.com)

1. Connect GitHub repository
2. Set environment variables
3. Use render.yaml configuration

### Frontend (Netlify)

1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/.next`
4. Set environment variables

### Database (Neon.tech)

1. Create new PostgreSQL database
2. Update DATABASE_URL in production environment
3. Run migrations in production

## Development Scripts

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run build        # Build both applications
npm run setup        # Initial setup script

# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate new migration

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```
