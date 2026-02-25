from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Union, List, Dict, Any
from datetime import datetime


# ===== Auth Schemas =====
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=2, max_length=255)


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AuthMessageResponse(BaseModel):
    user: UserResponse
    message: str


# ===== Check-in Schemas =====
class CheckinRequest(BaseModel):
    mood: int = Field(ge=1, le=10)
    sleep_hours: float = Field(ge=0, le=24)
    notes: str = Field(default="", max_length=1000)


class CheckinResponse(BaseModel):
    id: str
    user_id: str
    mood: int
    sleep_hours: float
    notes: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CheckinWithAnalysis(BaseModel):
    checkin: CheckinResponse
    analysis_id: str


# ===== Analysis Schemas =====
class AnalysisResponse(BaseModel):
    id: str
    checkin_id: str
    user_id: str
    model_version: str
    summary: str
    labels: Dict[str, Any]
    confidence: float
    created_at: datetime

    model_config = {"from_attributes": True}


class InsightResponse(BaseModel):
    id: str
    checkin: CheckinResponse
    analysis: AnalysisResponse


# ===== Alert Schemas =====
class AlertResponse(BaseModel):
    id: str
    user_id: str
    ai_result_id: Optional[str] = None
    type: str
    status: str
    payload: Dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class AlertUpdateRequest(BaseModel):
    status: str = Field(pattern="^(acknowledged|closed)$")


# ===== Dashboard Schemas =====
class DashboardResponse(BaseModel):
    avg_mood: float
    avg_sleep: float
    checkin_streak: int
    open_alerts: int
    mood_trend: List[Dict[str, Any]]
    sleep_trend: List[Dict[str, Any]]
    stress_distribution: List[Dict[str, Any]]
    recent_checkins: List[CheckinResponse]


# ===== User Update Schemas =====
class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserSettingsResponse(BaseModel):
    id: str
    user_id: str
    preferences: Dict[str, Any]

    model_config = {"from_attributes": True}


class UserSettingsUpdateRequest(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    notifications_email: Optional[bool] = None
    notifications_push: Optional[bool] = None
    timezone: Optional[str] = None


# ===== Admin Schemas =====
class RoleUpdateRequest(BaseModel):
    role: str = Field(pattern="^(user|coach|admin)$")


class PaginatedUsersResponse(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    per_page: int
    has_next: bool


# ===== Generic API Envelope =====
class ApiResponse(BaseModel):
    ok: bool = True
    data: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None
