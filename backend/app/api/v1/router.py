from fastapi import APIRouter

from app.api.v1 import auth

api_router = APIRouter()

# Include all v1 routers
api_router.include_router(auth.router)
