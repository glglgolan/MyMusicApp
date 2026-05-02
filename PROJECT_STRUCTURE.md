# Project Structure

```
MyMusicApp/
│
├── backend/                          # FastAPI Backend
│   ├── main.py                       # All API endpoints (FastAPI app)
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                  # Environment variables template
│   └── .gitignore                    # Git ignore for Python
│
├── frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Auth page (signup/login)
│   │   │   ├── Home.jsx              # Lesson feed (lobby)
│   │   │   ├── TeacherDashboard.jsx  # Create lessons & assignments
│   │   │   └── StudentDashboard.jsx  # View lessons & submit assignments
│   │   │
│   │   ├── components/
│   │   │   └── Navbar.jsx            # Navigation & user info
│   │   │
│   │   ├── utils/
│   │   │   └── rtl.js                # RTL/Hebrew language support
│   │   │
│   │   ├── App.jsx                   # Main app component (routing)
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Global styles
│   │   └── rtl.css                   # RTL-specific styles
│   │
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── package.json                  # npm dependencies
│   ├── .env.example                  # Environment variables template
│   └── .gitignore                    # Git ignore for Node.js
│
├── README.md                         # Full documentation
├── QUICK_START.md                    # 5-minute setup guide
├── DEPLOYMENT.md                     # Deployment instructions
├── RTL_SUPPORT.md                    # Hebrew/RTL language support
└── PROJECT_STRUCTURE.md              # This file
```

---

## File Descriptions

### Backend (`backend/main.py`)

**Contains:**
- FastAPI app initialization
- CORS middleware configuration
- Supabase client setup
- All Pydantic models (User, Lesson, Assignment, etc.)
- 5 main endpoint groups:
  - `/lessons` (CRUD)
  - `/assignments` (CRUD)
  - `/submissions` (Create & List)
  - `/messages` (Send & Get)
  - `/users` (Get user info)

**Key Features:**
- Handles all database operations
- Validates input with Pydantic
- Returns proper HTTP status codes
- Uses Supabase Python client

### Frontend Pages

**Login.jsx**
- Email/password authentication via Supabase
- Role selection (student/teacher)
- Form validation & error handling
- Toggle between login & signup

**Home.jsx**
- Displays all lessons from all teachers
- Shows teacher email for each lesson
- Redirect links to dashboards
- No lesson creation (teacher feature)

**TeacherDashboard.jsx**
- Create lessons (title + content)
- View all created lessons
- Create assignments linked to lessons
- View all assignments
- Form validation & loading states

**StudentDashboard.jsx**
- View all available lessons
- View all assignments
- Submit assignments with text response
- Track submitted assignments
- Simple form for submission

### Frontend Components

**Navbar.jsx**
- Navigation between pages
- Shows current user email & role
- Logout button
- Active page highlighting
- Role-specific nav items

### Frontend Utilities

**rtl.js**
- Hebrew text detection
- Language preference management
- Browser language detection
- Text direction utilities
- Date & number formatting
- Language constants

### Frontend Styles

**index.css**
- Global styles (Apple-like aesthetic)
- Form styling
- Card component styles
- Button styles
- Grid layouts
- Responsive design

**rtl.css**
- RTL-specific CSS
- Hebrew/RTL adjustments
- Language switcher styles
- Direction-aware layouts
- Responsive RTL support

---

## Data Flow

### User Authentication Flow
```
Browser → Login.jsx
       → Supabase Auth
       → Create user in users table
       → App.jsx stores user in state
       → Shows user dashboard based on role
```

### Lesson Creation Flow
```
TeacherDashboard.jsx
       → Form submission
       → POST /lessons (FastAPI)
       → Inserts into Supabase lessons table
       → Returns lesson data
       → UI updates with new lesson
```

### Assignment Submission Flow
```
StudentDashboard.jsx
       → Form submission
       → POST /submissions (FastAPI)
       → Inserts into Supabase submissions table
       → Marks assignment as submitted
       → UI shows success message
```

---

## Technology Stack Details

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Supabase-py** - Python SDK for Supabase

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Supabase JS** - Client for authentication
- **Axios** - HTTP requests (optional, using fetch)

### Database & Auth
- **Supabase** - PostgreSQL database + Auth
- **Row Level Security** - Database security policies

### Deployment
- **Vercel** - Frontend hosting
- **Railway/Heroku/AWS** - Backend hosting options

---

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### Frontend (.env.local)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
VITE_API_URL=http://localhost:8000
```

---

## Database Schema

### users
- `id` (UUID) - Primary key
- `email` (Text) - User email
- `role` (Text) - 'student' or 'teacher'
- `created_at` (Timestamp)

### lessons
- `id` (UUID) - Primary key
- `teacher_id` (UUID) - FK to users
- `title` (Text)
- `content` (Text)
- `created_at` (Timestamp)

### assignments
- `id` (UUID) - Primary key
- `lesson_id` (UUID) - FK to lessons
- `title` (Text)
- `description` (Text)
- `created_at` (Timestamp)

### submissions
- `id` (UUID) - Primary key
- `assignment_id` (UUID) - FK to assignments
- `student_id` (UUID) - FK to users
- `content` (Text)
- `created_at` (Timestamp)

### messages
- `id` (UUID) - Primary key
- `sender_id` (UUID) - FK to users
- `receiver_id` (UUID) - FK to users
- `content` (Text)
- `created_at` (Timestamp)

---

## Key Features

✅ Email/password authentication
✅ Role-based access (student/teacher)
✅ Create lessons & assignments
✅ Submit assignments
✅ View all content
✅ Simple messaging
✅ RTL/Hebrew language support
✅ Clean, minimal UI
✅ Fully responsive
✅ Production-ready code

---

## Running Locally

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

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Deployment Checklist

### Frontend (Vercel)
- [ ] Set VITE_* environment variables
- [ ] Connect GitHub repo
- [ ] Deploy on Vercel

### Backend (Railway/Heroku)
- [ ] Set SUPABASE_* environment variables
- [ ] Push to GitHub/chosen hosting
- [ ] Update VITE_API_URL in Vercel

### Database (Supabase)
- [ ] Create tables (SQL provided)
- [ ] Enable Row Level Security
- [ ] Set up authentication

---

## Next Steps

1. **Setup** - Follow QUICK_START.md
2. **Test** - Create accounts and test features
3. **Customize** - Add branding, colors, features
4. **Deploy** - Follow DEPLOYMENT.md
5. **Scale** - Add more features based on feedback

---

Happy coding! 🎵
