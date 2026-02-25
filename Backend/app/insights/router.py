from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from datetime import datetime, timedelta, timezone

from app.database.session import get_db
from app.core.deps import get_current_user
from app.models.models import User, DailyCheckin, AIAnalysisResult, Alert, AlertStatus
from app.schemas.schemas import CheckinResponse, AnalysisResponse, DashboardResponse

router = APIRouter(tags=["Insights & Dashboard"])


@router.get("/dashboard")
async def get_dashboard(
    range: str = "30d",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    days = int(range.replace("d", "")) if range.endswith("d") else 30
    since = datetime.now(timezone.utc) - timedelta(days=days)

    # Get checkins
    result = await db.execute(
        select(DailyCheckin)
        .where(DailyCheckin.user_id == current_user.id, DailyCheckin.created_at >= since)
        .order_by(DailyCheckin.created_at)
    )
    checkins = result.scalars().all()

    # Averages
    avg_mood = sum(c.mood for c in checkins) / len(checkins) if checkins else 0
    avg_sleep = sum(c.sleep_hours for c in checkins) / len(checkins) if checkins else 0

    # Streak (consecutive days)
    streak = 0
    if checkins:
        today = datetime.now(timezone.utc).date()
        for i in range(30):
            day = today - timedelta(days=i)
            if any(c.created_at.date() == day for c in checkins):
                streak += 1
            else:
                break

    # Open alerts count
    alert_result = await db.execute(
        select(func.count(Alert.id))
        .where(Alert.user_id == current_user.id, Alert.status == AlertStatus.OPEN)
    )
    open_alerts = alert_result.scalar() or 0

    # Trends
    mood_trend = [{"date": c.created_at.strftime("%a"), "mood": c.mood} for c in checkins[-7:]]
    sleep_trend = [{"date": c.created_at.strftime("%a"), "hours": c.sleep_hours} for c in checkins[-7:]]

    # Stress distribution from analyses
    analysis_result = await db.execute(
        select(AIAnalysisResult)
        .where(AIAnalysisResult.user_id == current_user.id)
        .order_by(desc(AIAnalysisResult.created_at))
        .limit(30)
    )
    analyses = analysis_result.scalars().all()
    stress_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
    for a in analyses:
        sl = a.labels.get("stress_level", 5) if isinstance(a.labels, dict) else 5
        if sl <= 3:
            stress_counts["Low"] += 1
        elif sl <= 5:
            stress_counts["Medium"] += 1
        elif sl <= 7:
            stress_counts["High"] += 1
        else:
            stress_counts["Critical"] += 1
    stress_distribution = [{"name": k, "value": v} for k, v in stress_counts.items()]

    recent = [CheckinResponse.model_validate(c) for c in list(reversed(checkins))[:5]]

    return {
        "ok": True,
        "data": {
            "avg_mood": round(avg_mood, 1),
            "avg_sleep": round(avg_sleep, 1),
            "checkin_streak": streak,
            "open_alerts": open_alerts,
            "mood_trend": mood_trend,
            "sleep_trend": sleep_trend,
            "stress_distribution": stress_distribution,
            "recent_checkins": recent,
        },
        "error": None,
    }


@router.get("/insights/recent")
async def list_recent_insights(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AIAnalysisResult)
        .where(AIAnalysisResult.user_id == current_user.id)
        .order_by(desc(AIAnalysisResult.created_at))
        .limit(10)
    )
    analyses = result.scalars().all()

    insights = []
    for a in analyses:
        checkin_result = await db.execute(select(DailyCheckin).where(DailyCheckin.id == a.checkin_id))
        checkin = checkin_result.scalar_one_or_none()
        if checkin:
            insights.append({
                "id": a.id,
                "checkin": CheckinResponse.model_validate(checkin),
                "analysis": AnalysisResponse.model_validate(a),
            })

    return {"ok": True, "data": insights, "error": None}


@router.get("/insights/{insight_id}")
async def get_insight(
    insight_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AIAnalysisResult)
        .where(AIAnalysisResult.id == insight_id, AIAnalysisResult.user_id == current_user.id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Insight not found")

    checkin_result = await db.execute(select(DailyCheckin).where(DailyCheckin.id == analysis.checkin_id))
    checkin = checkin_result.scalar_one_or_none()

    return {
        "ok": True,
        "data": {
            "id": analysis.id,
            "checkin": CheckinResponse.model_validate(checkin) if checkin else None,
            "analysis": AnalysisResponse.model_validate(analysis),
        },
        "error": None,
    }
