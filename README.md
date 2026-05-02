# 🎵 Music Learning App - MVP

A modern web-based music learning platform with teacher and student roles, lessons, assignments, and real-time messaging.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** FastAPI (Python)
- **Database & Auth:** Supabase
- **Deployment:** Vercel (frontend)

## Features

### Authentication
- Email/password signup & login via Supabase
- Role-based access (Student/Teacher)

### Pages
1. **Login/Signup** - User authentication with role selection
2. **Home (Lobby)** - Feed of lessons created by teachers
3. **Teacher Dashboard** - Create lessons and assignments
4. **Student Dashboard** - View lessons, submit assignments
5. **Navbar** - Navigation and user info

### API Endpoints
- `POST/GET/PUT/DELETE /lessons`
- `POST/GET/PUT/DELETE /assignments`
- `POST/GET /submissions`
- `POST/GET /messages`
- `GET /users`

---

## Setup Instructions

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or login
3. Create a new project
4. Copy your **Project URL** and **Anon Public Key** (you'll need these)

#### Create Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'teacher')),
  created_at timestamp DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id),
  student_id uuid NOT NULL REFERENCES users(id),
  content text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id),
  receiver_id uuid NOT NULL REFERENCES users(id),
  content text NOT NULL,
  created_at timestamp DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

---

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

#### Run the Backend Server
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

---

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
VITE_API_URL=http://localhost:8000
```

#### Run the Frontend Dev Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Running the Full App Locally

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Access the App
Open `http://localhost:5173` in your browser

---

## Test Users

After setup, create test accounts:

**Teacher Account:**
- Email: `teacher@example.com`
- Password: `Test123!`
- Role: Teacher

**Student Account:**
- Email: `student@example.com`
- Password: `Test123!`
- Role: Student

---

## Project Structure

```
MyMusicApp/
├── backend/
│   ├── main.py              # FastAPI app + all endpoints
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment template
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx           # Main app component + routing
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── package.json          # npm dependencies
│   ├── vite.config.js        # Vite configuration
│   └── .env.example          # Environment template
└── README.md
```

---

## Deployment to Vercel

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repo
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
   - `VITE_API_URL` (your backend URL)
4. Click Deploy

### Deploy Backend
The backend can be deployed to:
- **Railway** (recommended for FastAPI)
- **Heroku**
- **AWS EC2**
- **DigitalOcean**

Example with Railway:
1. Push your code to GitHub
2. Connect Railway to your GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy

---

## API Documentation

### Lessons
- `GET /lessons` - Get all lessons
- `GET /lessons?teacher_id=UUID` - Get lessons by teacher
- `POST /lessons` - Create a lesson
- `PUT /lessons/{id}` - Update a lesson
- `DELETE /lessons/{id}` - Delete a lesson

### Assignments
- `GET /assignments` - Get all assignments
- `GET /assignments?lesson_id=UUID` - Get by lesson
- `POST /assignments` - Create assignment
- `PUT /assignments/{id}` - Update assignment
- `DELETE /assignments/{id}` - Delete assignment

### Submissions
- `GET /submissions` - Get all submissions
- `GET /submissions?student_id=UUID` - Get by student
- `POST /submissions` - Create submission

### Messages
- `GET /messages?user_id=UUID` - Get messages for user
- `POST /messages` - Send message

---

## Future Enhancements

- File uploads (audio, video)
- Real-time messaging with WebSockets
- Progress tracking
- Ratings & feedback
- Search functionality
- Profile pages
- Notifications

---

## Support

For issues or questions, check the code comments or refer to:
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
