from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import tasks

app = FastAPI(
    title="Tempro Task API",
    description="Backend API for Tempro task management TUI",
    version="1.0.0"
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
