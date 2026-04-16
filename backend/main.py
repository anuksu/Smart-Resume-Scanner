import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.analyze import router as analyze_router
from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.contact import router as contact_router

load_dotenv()

app = FastAPI(title="Resume Scanner API", version="1.0.0")

# CORS - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(analyze_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")
app.include_router(profile_router, prefix="/api/user")
app.include_router(contact_router, prefix="/api")

# Health check
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Resume Scanner API is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
