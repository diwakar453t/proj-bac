import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict
from sqlalchemy import String, Integer, Float, Text, Enum, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
import enum


class UserRole(str, enum.Enum):
    USER = "user"
    COACH = "coach"
    ADMIN = "admin"


class AlertType(str, enum.Enum):
    LOW_SLEEP = "low_sleep"
    HIGH_STRESS = "high_stress"
    RISK_DETECTED = "risk_detected"
    POSITIVE_TREND = "positive_trend"


class AlertStatus(str, enum.Enum):
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    CLOSED = "closed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    checkins: Mapped[List["DailyCheckin"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    settings: Mapped[Optional["UserSettings"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    alerts: Mapped[List["Alert"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class DailyCheckin(Base):
    __tablename__ = "daily_checkins"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    mood: Mapped[int] = mapped_column(Integer, nullable=False)
    sleep_hours: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(back_populates="checkins")
    analysis: Mapped[Optional["AIAnalysisResult"]] = relationship(back_populates="checkin", uselist=False, cascade="all, delete-orphan")


class AIAnalysisResult(Base):
    __tablename__ = "ai_analysis_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    checkin_id: Mapped[str] = mapped_column(String(36), ForeignKey("daily_checkins.id"), nullable=False, unique=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    model_version: Mapped[str] = mapped_column(String(50), default="rule-v1")
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    labels: Mapped[Dict] = mapped_column(JSON, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    checkin: Mapped["DailyCheckin"] = relationship(back_populates="analysis")


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    ai_result_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("ai_analysis_results.id"), nullable=True)
    type: Mapped[AlertType] = mapped_column(Enum(AlertType), nullable=False)
    status: Mapped[AlertStatus] = mapped_column(Enum(AlertStatus), default=AlertStatus.OPEN)
    payload: Mapped[Dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(back_populates="alerts")


class UserSettings(Base):
    __tablename__ = "user_settings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    preferences: Mapped[Dict] = mapped_column(JSON, default=lambda: {
        "theme": "light",
        "language": "en",
        "notifications_email": True,
        "notifications_push": True,
        "timezone": "Asia/Kolkata",
    })

    user: Mapped["User"] = relationship(back_populates="settings")
