"""
Seed script to create sample teacher and student users.
Run with: python seed_users.py
"""
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
}

USERS = [
    {"email": "teach@gmail.com", "password": "Test123!", "role": "teacher"},
    {"email": "student@gmail.com", "password": "Test123!", "role": "student"},
]

def get_token(email, password):
    """Sign in to get access token for existing user."""
    res = requests.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers=headers,
        json={"email": email, "password": password},
    )
    data = res.json()
    return data.get("access_token"), data.get("user", {}).get("id")

def signup_user(email, password, role):
    print(f"\n→ Creating {role}: {email}")

    # Step 1: Sign up via Supabase Auth
    res = requests.post(
        f"{SUPABASE_URL}/auth/v1/signup",
        headers=headers,
        json={"email": email, "password": password},
    )
    data = res.json()

    already_exists = "User already registered" in str(data)

    if already_exists:
        print(f"  ℹ Auth user already exists, signing in instead...")
        access_token, user_id = get_token(email, password)
        if not access_token:
            print(f"  ✗ Could not sign in: {data}")
            return
    elif res.status_code not in (200, 201) or "error" in data:
        print(f"  ✗ Auth signup failed: {data.get('error_description') or data.get('msg') or data}")
        return
    else:
        user_id = data.get("user", {}).get("id") or data.get("id")
        access_token = data.get("access_token")

    if not user_id:
        print(f"  ✗ Could not get user ID")
        return

    print(f"  ✓ Auth user ready: {user_id}")

    # Step 2: Insert into users table using the user's own JWT
    insert_headers = {
        **headers,
        "Authorization": f"Bearer {access_token}",
        "Prefer": "return=representation",
    }

    insert_res = requests.post(
        f"{SUPABASE_URL}/rest/v1/users",
        headers=insert_headers,
        json={"id": user_id, "email": email, "role": role},
    )

    if insert_res.status_code in (200, 201):
        print(f"  ✓ User record inserted with role '{role}'")
    else:
        print(f"  ✗ Failed to insert user record: {insert_res.text}")
        print(f"    (Make sure you ran the RLS policy SQL in Supabase first!)")

if __name__ == "__main__":
    print("🎵 Seeding sample users...")
    for u in USERS:
        signup_user(u["email"], u["password"], u["role"])
    print("\nDone! You can now log in at http://localhost:5173")
