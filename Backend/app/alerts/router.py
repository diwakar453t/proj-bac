from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database.session import get_db
from app.core.deps import get_current_user
from app.models.models import User, Alert, AlertStatus
from app.schemas.schemas import AlertResponse, AlertUpdateRequest

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("")
async def list_alerts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Alert)
        .where(Alert.user_id == current_user.id)
        .order_by(desc(Alert.created_at))
        .limit(50)
    )
    alerts = result.scalars().all()
    return {
        "ok": True,
        "data": [AlertResponse.model_validate(a) for a in alerts],
        "error": None,
    }


@router.patch("/{alert_id}")
async def update_alert(
    alert_id: str,
    data: AlertUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id, Alert.user_id == current_user.id)
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = AlertStatus(data.status)
    await db.flush()

    return {
        "ok": True,
        "data": AlertResponse.model_validate(alert),
        "error": None,
    }
