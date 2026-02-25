from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timedelta, timezone

from app.database.session import get_db
from app.core.deps import get_current_user
from app.models.models import User, DailyCheckin, AIAnalysisResult
from app.schemas.schemas import CheckinRequest, CheckinResponse
from app.ai.service import analyze_checkin

router = APIRouter(prefix="/checkins", tags=["Check-ins"])


async def _run_analysis(checkin_id: str, user_id: str):
    """Background task to run AI analysis on a check-in."""
    from app.database.session import async_session
    async with async_session() as db:
        result = await db.execute(select(DailyCheckin).where(DailyCheckin.id == checkin_id))
        checkin = result.scalar_one_or_none()
        if checkin:
            await analyze_checkin(checkin, db)
            await db.commit()


@router.post("")
async def create_checkin(
    data: CheckinRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    checkin = DailyCheckin(
        user_id=current_user.id,
        mood=data.mood,
        sleep_hours=data.sleep_hours,
        notes=data.notes,
    )
    db.add(checkin)
    await db.flush()

    # Trigger AI analysis in background
    background_tasks.add_task(_run_analysis, checkin.id, current_user.id)

    return {
        "ok": True,
        "data": {
            "checkin": CheckinResponse.model_validate(checkin),
            "analysis_id": "pending",
        },
        "error": None,
    }


@router.get("")
async def list_checkins(
    range: str = "30d",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    days = int(range.replace("d", "")) if range.endswith("d") else 30
    since = datetime.now(timezone.utc) - timedelta(days=days)

    result = await db.execute(
        select(DailyCheckin)
        .where(DailyCheckin.user_id == current_user.id)
        .where(DailyCheckin.created_at >= since)
        .order_by(desc(DailyCheckin.created_at))
    )
    checkins = result.scalars().all()

    return {
        "ok": True,
        "data": [CheckinResponse.model_validate(c) for c in checkins],
        "error": None,
    }


@router.get("/{checkin_id}")
async def get_checkin(
    checkin_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(DailyCheckin)
        .where(DailyCheckin.id == checkin_id, DailyCheckin.user_id == current_user.id)
    )
    checkin = result.scalar_one_or_none()
    if not checkin:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Check-in not found")

    return {
        "ok": True,
        "data": CheckinResponse.model_validate(checkin),
        "error": None,
    }
