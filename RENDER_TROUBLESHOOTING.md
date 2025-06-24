# Render Deployment Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. Build Command Issues

**If you see build errors:**

**Update Render Service Settings:**

- Build Command: `cd backend && npm ci && npm run build`
- Start Command: `cd backend && npm start`
- Environment: Node.js

**Or use this simplified approach:**

- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Root Directory: `backend`

### 2. Environment Variables

**Required Environment Variables in Render Dashboard:**

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://serverdb_5sr3_user:eFxFYcFGeI8oLTDI5LWRgY84iBadwQ2z@dpg-d1cpurbipnbc73c2os20-a/serverdb_5sr3
GEMINI_API_KEY=AIzaSyA7eYAbx_a49AybeQnprOPugZ5J49QjN94
JWT_SECRET=eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1MDY5OTM3MywiaWF0IjoxNzUwNjk5MzczfQ.lFPmc-xdj-EoCdzwsYikJkfW0_p9QTSgdLBuPufArVw
CORS_ORIGIN=https://task-manager-kappa-ebon.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Important:** Render automatically sets PORT, so make sure your app uses `process.env.PORT`

### 3. Database Migration Issues

**Problem:** Database migrations fail during build

**Solution:** Remove migrations from postbuild

Update `backend/package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "postbuild": "echo 'Build completed'"
  }
}
```

Run migrations manually after first deployment:

```bash
# In Render shell or locally pointing to production DB
npm run db:migrate
```

### 4. TypeScript Build Issues

**Problem:** TypeScript compilation fails

**Solution:** Check these files exist and are configured correctly:

`backend/tsconfig.json` should include:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Port Configuration

**Problem:** App not responding or health check failing

**Solution:** Ensure your Express app uses the correct port:

In `backend/src/index.ts`:

```typescript
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
```

### 6. Health Check Failing

**Problem:** Render can't reach your health check endpoint

**Solution:** Ensure your root endpoint (`/`) returns a response:

```typescript
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});
```

### 7. CORS Issues

**Problem:** Frontend can't connect to backend

**Solution:** Update CORS configuration:

```typescript
app.use(
  cors({
    origin: [
      'https://task-manager-kappa-ebon.vercel.app',
      'http://localhost:3000', // for development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

## 🔧 Quick Fixes

### Fix 1: Update Package.json for Render

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "tsx src/db/migrate.ts"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Fix 2: Create Render-Specific Start Script

Create `backend/start-render.js`:

```javascript
require('dotenv').config();
require('./dist/index.js');
```

Update start command to: `node start-render.js`

### Fix 3: Database Connection for Production

Update `backend/src/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

// Disable SSL for local development, enable for production
const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

export const db = drizzle(sql);
```

## 📱 Deployment Steps

1. **Push to GitHub** (if not already done)
2. **Connect Repository** to Render
3. **Create Web Service** with these settings:

   - Environment: Node
   - Build Command: `cd backend && npm ci && npm run build`
   - Start Command: `cd backend && npm start`
   - Auto-Deploy: Yes

4. **Set Environment Variables** in Render dashboard
5. **Deploy** and check logs

## 🔍 Debugging

**Check Render Logs:**

1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Look for specific error messages

**Common Error Messages:**

- `EADDRINUSE`: Port already in use (check PORT env var)
- `Module not found`: Missing dependencies (check package.json)
- `Database connection failed`: Check DATABASE_URL
- `Build failed`: Check build command and tsconfig.json

## 📞 Need Help?

If you're still having issues, please share:

1. The exact error message from Render logs
2. Your current Render service configuration
3. Any specific build or runtime errors

This will help provide more targeted assistance!
