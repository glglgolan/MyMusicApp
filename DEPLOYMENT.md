# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Code
```bash
cd frontend
npm run build
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Select `frontend` as root directory
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-anon-key
   VITE_API_URL=https://your-backend-url.com
   ```
6. Click "Deploy"

Your frontend is now live! 🚀

---

## Backend Deployment Options

### Option 1: Railway (Recommended)

**Why Railway:** Easy, fast, good free tier for FastAPI

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create New Project → GitHub repo
4. Add environment variables:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   ```
5. Railway auto-detects Python → deploys to production
6. Copy your railway domain → use as `VITE_API_URL` in Vercel

**Cost:** Free tier includes enough for MVP

---

### Option 2: Heroku (with procfile)

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create `Procfile` in backend folder:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Login and deploy:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set SUPABASE_URL=https://your-project.supabase.co
   heroku config:set SUPABASE_KEY=your-anon-key
   git push heroku main
   ```

---

### Option 3: AWS EC2

1. Launch Ubuntu EC2 instance
2. SSH into it and run:
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv
   git clone your-repo
   cd MyMusicApp/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Create `.env` with Supabase keys
4. Run with Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 main:app
   ```
5. Use nginx as reverse proxy
6. Get domain and SSL (Let's Encrypt)

---

### Option 4: DigitalOcean App Platform

1. Go to [digitalocean.com](https://digitalocean.com)
2. Click Apps → Create App
3. Connect GitHub repo
4. Configure:
   - Framework: Python
   - Build command: `pip install -r requirements.txt`
   - Run command: `uvicorn main:app --host 0.0.0.0 --port 8080`
5. Add environment variables
6. Deploy

---

## Production Checklist

- [ ] Environment variables set correctly
- [ ] CORS origins updated in FastAPI (`main.py`)
- [ ] Supabase RLS policies reviewed
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Health check endpoint working
- [ ] Rate limiting added
- [ ] Database indexes created for better performance

---

## Environment Variables Checklist

### Frontend (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
VITE_API_URL=  # Your deployed backend URL
```

### Backend (.env)
```
SUPABASE_URL=
SUPABASE_KEY=
```

---

## Monitoring

### Sentry (Error Tracking)
Add to `main.py`:
```python
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

### Vercel Analytics
- Automatic in Vercel dashboard

### Railway/Heroku Logs
- Check logs from dashboard or CLI

---

## Custom Domain

### Frontend (Vercel)
1. Domains → Add domain
2. Point DNS to Vercel nameservers
3. Auto-generated SSL certificate

### Backend (Railway/Heroku)
1. Add custom domain in settings
2. Update DNS CNAME
3. Auto SSL with Let's Encrypt

---

## Cost Estimates (Monthly)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | ✅ Included | 100GB bandwidth |
| Railway | ✅ $5 credit | Pay as you go |
| Heroku | ❌ Paid ($7+) | Killed free tier |
| DigitalOcean | ✅ $6/month | Cheapest VPS |
| Supabase | ✅ Included | 500MB storage |

**Total:** $0-6/month for MVP

---

## Quick Deploy Commands

```bash
# Build frontend
cd frontend && npm run build

# Test production build locally
npm run preview

# Deploy to Vercel (if using Vercel CLI)
vercel --prod

# Deploy to Railway (if using Railway CLI)
railway up
```

---

Enjoy your deployed app! 🎉
