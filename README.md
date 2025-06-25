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
- **HTTP Client**: Axios
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)


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


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🎯 Future Enhancements

- [ ] Task due dates and reminders
- [ ] Collaborative task sharing
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Task templates
- [ ] Integration with calendar apps
- [ ] Voice-to-task conversion
- [ ] AI task recommendations based on history
