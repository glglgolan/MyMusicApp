# Quick Start Guide - 5 Minutes

## Prerequisites
- Python 3.8+
- Node.js 16+
- Supabase account (free)

---

## Step 1: Supabase Setup (2 min)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project → Save your credentials:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Public Key** → `SUPABASE_KEY`
3. Open **SQL Editor** → Paste this and run:

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'teacher')),
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id),
  student_id uuid NOT NULL REFERENCES users(id),
  content text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id),
  receiver_id uuid NOT NULL REFERENCES users(id),
  content text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

---

## Step 2: Backend Setup (1.5 min)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-anon-key

# Start server
uvicorn main:app --reload --port 8000
```

✅ Backend running at `http://localhost:8000`

---

## Step 3: Frontend Setup (1.5 min)

```bash
# In a NEW terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_KEY=your-anon-key
# VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

---

## Step 4: Test It (1 min)

1. Open `http://localhost:5173` in browser
2. **Sign up:**
   - Email: `teacher@example.com`
   - Password: `Test123!`
   - Role: **Teacher** → Sign up
3. Wait for email verification (or skip in dev mode)
4. **Sign up again** (new tab/incognito) with:
   - Email: `student@example.com`
   - Password: `Test123!`
   - Role: **Student**
5. **As Teacher:**
   - Click Dashboard → Create Lesson → Add content
   - Create Assignment from lesson
6. **As Student:**
   - Click Dashboard → View assignments → Submit

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Backend won't start | Check `SUPABASE_URL` and `SUPABASE_KEY` in `.env` |
| Frontend won't load | Make sure backend is running on port 8000 |
| Can't sign up | Check Supabase auth settings, email verification might be off in dev |
| 404 on API calls | Make sure `VITE_API_URL` in `.env.local` points to `http://localhost:8000` |

---

## Next Steps

- Deploy backend to Railway, Heroku, or AWS
- Deploy frontend to Vercel
- Add file uploads
- Add real-time messaging
- Customize with your branding

Enjoy! 🎵
