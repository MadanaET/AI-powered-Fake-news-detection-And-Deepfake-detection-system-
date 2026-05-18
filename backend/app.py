from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import sqlite3
from typing import Optional
import bcrypt

# Initialize DB
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL)''')
    conn.commit()
    conn.close()

init_db()

from nlp_engine import analyze_text
from cv_engine import analyze_media

app = FastAPI(title="Fake News & Deepfake Detection API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str
    url: Optional[str] = None

class UserAuth(BaseModel):
    username: str
    password: str

@app.post("/api/auth/register")
async def register(user: UserAuth):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    try:
        # Check if user exists
        c.execute("SELECT * FROM users WHERE username=?", (user.username,))
        if c.fetchone():
            return {"status": "error", "message": "Username already exists"}
        
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt)
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, hashed_password.decode('utf-8')))
        conn.commit()
        return {"status": "success", "message": "Registration successful"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()

@app.post("/api/auth/login")
async def login(user: UserAuth):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    try:
        c.execute("SELECT password FROM users WHERE username=?", (user.username,))
        row = c.fetchone()
        if not row:
            return {"status": "error", "message": "Invalid username or password"}
            
        hashed_password_bytes = row[0].encode('utf-8')
        if bcrypt.checkpw(user.password.encode('utf-8'), hashed_password_bytes):
            return {"status": "success", "username": user.username}
        else:
            return {"status": "error", "message": "Invalid username or password"}
    finally:
        conn.close()

@app.post("/api/analyze/text")
async def analyze_text_endpoint(request: TextRequest):
    result = analyze_text(request.text)
    return {"status": "success", "data": result}

@app.post("/api/analyze/media")
async def analyze_media_endpoint(file: UploadFile = File(...)):
    # Save the file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Determine type based on extension
    file_type = "image"
    if file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        file_type = "video"
        
    # Analyze the media
    result = analyze_media(temp_file_path, file_type)
    
    # Cleanup temporary file
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
        
    return {"status": "success", "data": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
