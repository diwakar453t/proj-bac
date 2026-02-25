from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.config import settings
from app.database.session import init_db
from app.auth.router import router as auth_router
from app.checkins.router import router as checkins_router
from app.insights.router import router as insights_router
from app.alerts.router import router as alerts_router
from app.users.router import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting MindPulse API...")
    await init_db()
    logger.info("✅ Database initialized")
    yield
    logger.info("👋 Shutting down MindPulse API")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(checkins_router, prefix="/api/v1")
app.include_router(insights_router, prefix="/api/v1")
app.include_router(alerts_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")


# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "ok": False,
            "data": None,
            "error": {
                "code": "internal_error",
                "message": "An unexpected error occurred",
            },
        },
    )


# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "version": settings.APP_VERSION}


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }
