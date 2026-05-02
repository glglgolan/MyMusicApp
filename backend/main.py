from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()
from datetime import datetime, date

# Initialize FastAPI
app = FastAPI(title="Music Learning App API")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==================== Models ====================

class User(BaseModel):
    email: str
    role: str  # "student" or "teacher"

class Lesson(BaseModel):
    title: str
    content: str
    teacher_id: str

class Assignment(BaseModel):
    lesson_id: str
    title: str
    description: str

class Submission(BaseModel):
    assignment_id: str
    student_id: str
    content: str

class Message(BaseModel):
    sender_id: str
    receiver_id: str
    content: str

class AssignedTaskRequest(BaseModel):
    assignment_id: str
    student_ids: list

class MessageGroupRequest(BaseModel):
    teacher_id: str
    group_name: str
    student_ids: list

class GroupMessageRequest(BaseModel):
    group_id: str
    sender_id: str
    content: str

# ==================== Gamification Functions ====================

def add_xp(user_id: str, amount: int):
    """Add XP to user and handle leveling up"""
    try:
        # Get current user stats
        user_response = supabase.table("users").select("xp, level").eq("id", user_id).single().execute()
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")

        current_xp = user_response.data["xp"]
        current_level = user_response.data["level"]

        # Calculate new XP and levels
        new_xp = current_xp + amount
        xp_per_level = 100
        new_level = (new_xp // xp_per_level) + 1

        # Update user
        supabase.table("users").update({
            "xp": new_xp,
            "level": new_level
        }).eq("id", user_id).execute()

        return {"xp": new_xp, "level": new_level, "leveled_up": new_level > current_level}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def update_streak(user_id: str):
    """Update user streak based on activity"""
    try:
        today = date.today().isoformat()

        # Record today's activity
        supabase.table("user_activity").insert({
            "user_id": user_id,
            "activity_date": today
        }).execute()

        # Get user's last active date
        user_response = supabase.table("users").select("last_active_date, streak").eq("id", user_id).single().execute()
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")

        last_active = user_response.data.get("last_active_date")
        current_streak = user_response.data.get("streak", 0)

        # Calculate new streak
        if last_active is None:
            new_streak = 1
        elif last_active == today:
            new_streak = current_streak  # Already active today
        else:
            # Check if was active yesterday
            from datetime import timedelta
            yesterday = (date.today() - timedelta(days=1)).isoformat()
            if last_active == yesterday:
                new_streak = current_streak + 1
            else:
                new_streak = 1  # Streak broken

        # Update user
        supabase.table("users").update({
            "last_active_date": today,
            "streak": new_streak
        }).eq("id", user_id).execute()

        return {"streak": new_streak}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Health Check ====================

@app.get("/health")
def health_check():
    return {"status": "ok"}

# ==================== Lessons Endpoints ====================

@app.post("/lessons")
async def create_lesson(lesson: Lesson):
    try:
        response = supabase.table("lessons").insert({
            "teacher_id": lesson.teacher_id,
            "title": lesson.title,
            "content": lesson.content,
            "created_at": datetime.now().isoformat(),
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/lessons")
async def get_lessons(teacher_id: Optional[str] = None):
    try:
        query = supabase.table("lessons")
        if teacher_id:
            response = query.select("*").eq("teacher_id", teacher_id).execute()
        else:
            response = query.select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str):
    try:
        response = supabase.table("lessons").select("*").eq("id", lesson_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/lessons/{lesson_id}")
async def update_lesson(lesson_id: str, lesson: Lesson):
    try:
        response = supabase.table("lessons").update({
            "title": lesson.title,
            "content": lesson.content,
        }).eq("id", lesson_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/lessons/{lesson_id}")
async def delete_lesson(lesson_id: str):
    try:
        supabase.table("lessons").delete().eq("id", lesson_id).execute()
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Assignments Endpoints ====================

@app.post("/assignments")
async def create_assignment(assignment: Assignment):
    try:
        response = supabase.table("assignments").insert({
            "lesson_id": assignment.lesson_id,
            "title": assignment.title,
            "description": assignment.description,
            "created_at": datetime.now().isoformat(),
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/assignments")
async def get_assignments(lesson_id: Optional[str] = None):
    try:
        query = supabase.table("assignments")
        if lesson_id:
            response = query.select("*").eq("lesson_id", lesson_id).execute()
        else:
            response = query.select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/assignments/{assignment_id}")
async def get_assignment(assignment_id: str):
    try:
        response = supabase.table("assignments").select("*").eq("id", assignment_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Assignment not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/assignments/{assignment_id}")
async def update_assignment(assignment_id: str, assignment: Assignment):
    try:
        response = supabase.table("assignments").update({
            "title": assignment.title,
            "description": assignment.description,
        }).eq("id", assignment_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/assignments/{assignment_id}")
async def delete_assignment(assignment_id: str):
    try:
        supabase.table("assignments").delete().eq("id", assignment_id).execute()
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Submissions Endpoints ====================

@app.post("/submissions")
async def create_submission(submission: Submission):
    try:
        response = supabase.table("submissions").insert({
            "assignment_id": submission.assignment_id,
            "student_id": submission.student_id,
            "content": submission.content,
            "created_at": datetime.now().isoformat(),
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/submissions")
async def get_submissions(assignment_id: Optional[str] = None, student_id: Optional[str] = None):
    try:
        query = supabase.table("submissions")
        if assignment_id:
            response = query.select("*").eq("assignment_id", assignment_id).execute()
        elif student_id:
            response = query.select("*").eq("student_id", student_id).execute()
        else:
            response = query.select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Messages Endpoints ====================

@app.post("/messages")
async def create_message(message: Message):
    try:
        response = supabase.table("messages").insert({
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": datetime.now().isoformat(),
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/messages")
async def get_messages(user_id: str):
    try:
        response = supabase.table("messages").select("*").or_("sender_id.eq." + user_id + ",receiver_id.eq." + user_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/messages/{sender_id}/{receiver_id}")
async def get_conversation(sender_id: str, receiver_id: str):
    try:
        response = supabase.table("messages").select("*").or_(
            f"and(sender_id.eq.{sender_id},receiver_id.eq.{receiver_id}),and(sender_id.eq.{receiver_id},receiver_id.eq.{sender_id})"
        ).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== User Endpoints ====================

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users")
async def get_users(role: Optional[str] = None):
    try:
        query = supabase.table("users")
        if role:
            response = query.select("*").eq("role", role).execute()
        else:
            response = query.select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Assigned Tasks Endpoints ====================

@app.post("/assigned_tasks")
async def create_assigned_task(request: AssignedTaskRequest):
    try:
        tasks = []
        for student_id in request.student_ids:
            response = supabase.table("assigned_tasks").insert({
                "assignment_id": request.assignment_id,
                "student_id": student_id,
                "status": "pending",
                "assigned_at": datetime.now().isoformat(),
            }).execute()
            if response.data:
                tasks.append(response.data[0])
        return tasks
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/assigned_tasks")
async def get_assigned_tasks(
    assignment_id: Optional[str] = None,
    student_id: Optional[str] = None,
    teacher_id: Optional[str] = None
):
    try:
        query = supabase.table("assigned_tasks").select("*")
        if assignment_id:
            response = query.eq("assignment_id", assignment_id).execute()
        elif student_id:
            response = query.eq("student_id", student_id).execute()
        else:
            response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/assigned_tasks/{task_id}")
async def update_assigned_task(task_id: str, status: str, feedback: Optional[str] = None):
    try:
        update_data = {"status": status}
        if feedback:
            update_data["feedback"] = feedback
        response = supabase.table("assigned_tasks").update(update_data).eq("id", task_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Message Groups Endpoints ====================

@app.post("/message_groups")
async def create_message_group(request: MessageGroupRequest):
    try:
        group_response = supabase.table("message_groups").insert({
            "teacher_id": request.teacher_id,
            "group_name": request.group_name,
            "created_at": datetime.now().isoformat(),
        }).execute()

        if not group_response.data:
            raise HTTPException(status_code=400, detail="Failed to create group")

        group_id = group_response.data[0]["id"]

        # Add members
        for student_id in request.student_ids:
            supabase.table("message_group_members").insert({
                "group_id": group_id,
                "student_id": student_id,
            }).execute()

        return group_response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/message_groups/{teacher_id}")
async def get_message_groups(teacher_id: str):
    try:
        response = supabase.table("message_groups").select("*").eq("teacher_id", teacher_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/message_group_members/{group_id}")
async def get_group_members(group_id: str):
    try:
        response = supabase.table("message_group_members").select("*").eq("group_id", group_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Group Messages Endpoints ====================

@app.post("/group_messages")
async def create_group_message(request: GroupMessageRequest):
    try:
        response = supabase.table("group_messages").insert({
            "group_id": request.group_id,
            "sender_id": request.sender_id,
            "content": request.content,
            "created_at": datetime.now().isoformat(),
        }).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/group_messages/{group_id}")
async def get_group_messages(group_id: str):
    try:
        response = supabase.table("group_messages").select("*").eq("group_id", group_id).order("created_at").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== Gamification Endpoints ====================

class XPRequest(BaseModel):
    user_id: str
    amount: int

@app.post("/gamification/xp")
async def add_xp_endpoint(request: XPRequest):
    """Add XP to user"""
    return add_xp(request.user_id, request.amount)

@app.get("/gamification/profile/{user_id}")
async def get_gamification_profile(user_id: str):
    """Get user gamification stats"""
    try:
        response = supabase.table("users").select("xp, level, streak").eq("id", user_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/gamification/activity/{user_id}")
async def record_activity(user_id: str):
    """Record activity and update streak"""
    return update_streak(user_id)
