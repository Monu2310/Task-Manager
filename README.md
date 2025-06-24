# Task Manager - AI-Powered Task Generation

A full-stack web application that leverages the Google Gemini API to generate and manage tasks with a modern, responsive UI.

## 🚀 Features

- **AI Task Generation**: Generate 5 actionable tasks for any topic using Google Gemini API
- **User Authentication**: Secure signup and login with JWT tokens
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Management**:
  - Mark tasks as completed
  - Categorize tasks (Personal, Work, Education, Health, Other)
  - Filter by status and category
  - Progress tracking and statistics
- **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Backend

- **Framework**: Express.js (Node.js web framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Documentation**: Swagger UI
- **AI Integration**: Google Gemini API
- **Deployment**: Render.com (backend) + Vercel (frontend)

### Frontend

- **Framework**: Next.js 15+ with App Router
- **UI Library**: ShadCN UI components
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd task-manager-app
chmod +x setup.sh
./setup.sh
```

### 2. Environment Configuration

#### Backend Environment

Copy `backend/.env.example` to `backend/.env` and update:

```env
# Database
DATABASE_URL=postgresql://postgres:password123@localhost:5432/task_manager

# Google Gemini API (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Frontend Environment

Copy `frontend/.env.example` to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key to your backend `.env` file

### 4. Start the Application

```bash
# Start both backend and frontend
npm run dev

# Or start individually:
npm run dev:backend  # Backend on port 3001
npm run dev:frontend # Frontend on port 3000
```

### 5. Run Locally (Alternative)

```bash
# Install all dependencies
npm run install:all

# Start backend and frontend concurrently
npm run dev
```

## 📱 Usage

1. **Access the Application**:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

2. **Create an Account**:

   - Go to http://localhost:3000/auth/register
   - Fill in your details and register

3. **Generate Tasks**:

   - Enter a topic (e.g., "Learn Python", "Improve Fitness")
   - Click "Generate" to get AI-generated tasks
   - Save individual tasks or save all at once

4. **Manage Tasks**:
   - Mark tasks as completed
   - Edit task titles
   - Change categories
   - Filter by status or category
   - View progress statistics

## 🚀 Deployment

### Backend Deployment (Render.com)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables:
   - `DATABASE_URL`: Use Neon.tech or Render PostgreSQL
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `JWT_SECRET`: A secure random string
4. Deploy

### Frontend Deployment (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
4. Deploy

### Database Setup (Neon.tech)

1. Create account at [Neon.tech](https://neon.tech/)
2. Create a new database
3. Copy the connection string
4. Update `DATABASE_URL` in your environment variables

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/generate` - Generate tasks with AI
- `GET /api/tasks/stats/overview` - Get task statistics

### Documentation

- `GET /docs` - Swagger UI documentation
- `GET /api/docs` - OpenAPI JSON specification

## 🏗 Project Structure

```
task-manager-app/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── db/             # Database schema and migrations
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication & CORS
│   │   └── utils/          # Utilities (auth, Gemini API)
│   └── package.json
├── frontend/               # Next.js React application
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities, types, store
│   └── package.json
└── README.md
```

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Database Operations

```bash
# Generate new migration
cd backend && npm run db:generate

# Run migrations
cd backend && npm run db:migrate

# Open Drizzle Studio
cd backend && npm run db:studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console output in your terminal
2. Ensure all environment variables are set
3. Verify your Gemini API key is valid
4. Check the [GitHub Issues](link-to-issues) for common problems

## 🎯 Future Enhancements

- [ ] Task due dates and reminders
- [ ] Collaborative task sharing
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Task templates
- [ ] Integration with calendar apps
- [ ] Voice-to-task conversion
- [ ] AI task recommendations based on history
