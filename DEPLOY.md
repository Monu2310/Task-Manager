# Production Deployment Guide

## 🚀 Quick Deploy

### Prerequisites

- GitHub repository
- [Render.com](https://render.com) account for backend
- [Netlify](https://netlify.com) account for frontend
- [Neon.tech](https://neon.tech) account for database (recommended)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## Backend Deployment (Render.com)

### 1. Database Setup

**Option A: Neon.tech (Recommended)**

1. Create account at [Neon.tech](https://neon.tech)
2. Create new database project
3. Copy the connection string

**Option B: Render PostgreSQL**

1. Create PostgreSQL database in Render
2. Note the connection details

### 2. Backend Service

1. Connect GitHub repository to Render
2. Create new **Web Service**
3. Use these settings:

   - **Build Command:** `cd backend && npm ci && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
   - **Plan:** Starter (or higher)

4. Set environment variables:

   ```
   NODE_ENV=production
   DATABASE_URL=your_neon_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_secure_random_string
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   ```

5. Deploy and note your backend URL

## Frontend Deployment (Netlify)

### 1. Site Setup

1. Connect GitHub repository to Netlify
2. Create new site with these settings:
   - **Base directory:** `frontend/`
   - **Build command:** `npm ci && npm run build`
   - **Publish directory:** `frontend/.next`

### 2. Environment Variables

Set in Netlify dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### 3. Deploy

1. Deploy the site
2. Note your frontend URL
3. Update backend CORS_ORIGIN with your frontend URL

## Local Production Testing

### 1. Environment Setup

```bash
# Copy production environment template
cp .env.production .env

# Update .env with your actual values
```

### 2. Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Secure database password
- [ ] CORS configured with actual domains
- [ ] Environment variables set (no defaults)
- [ ] SSL/HTTPS enabled on all services
- [ ] Rate limiting configured
- [ ] Health checks enabled

## Monitoring

### Health Checks

- Backend: `https://your-backend-url.onrender.com/`
- Frontend: `https://your-frontend-url.netlify.app/`

### API Documentation

- Swagger UI: `https://your-backend-url.onrender.com/docs`

## Troubleshooting

### Common Issues

**Build Failures:**

- Check Node.js version (requires 18+)
- Verify all environment variables are set
- Check build logs for specific errors

**Database Connection:**

- Verify DATABASE_URL format
- Check database server status
- Ensure IP whitelist includes Render IPs

**CORS Errors:**

- Update CORS_ORIGIN with exact frontend URL
- Include both www and non-www versions if needed

**API Errors:**

- Check backend logs in Render dashboard
- Verify Gemini API key is valid
- Check rate limiting settings

## Performance Optimization

### Backend

- Enable database connection pooling
- Implement Redis caching (optional)
- Use CDN for static assets

### Frontend

- Enable Next.js optimization features
- Use image optimization
- Implement service worker caching

## Scaling

### Backend Scaling

- Upgrade Render plan as needed
- Add horizontal scaling with load balancer
- Implement database read replicas

### Frontend Scaling

- Netlify automatically scales
- Consider edge functions for dynamic content
- Implement ISR for better performance

## Cost Optimization

### Free Tier Limits

- **Render:** 750 hours/month (free tier)
- **Netlify:** 100GB bandwidth, 300 build minutes/month
- **Neon:** 0.5 vCPU, 256MB RAM, 512MB storage

### Upgrade Recommendations

- Backend: Start with Starter plan ($7/month)
- Database: Scale based on storage needs
- Frontend: Pro plan only if advanced features needed

## Support

For deployment issues:

1. Check service status pages
2. Review deployment logs
3. Consult platform documentation
4. Contact support if needed

---

**🎉 Your AI-powered Task Manager is now production-ready!**
