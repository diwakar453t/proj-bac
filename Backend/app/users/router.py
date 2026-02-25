from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.session import get_db
from app.core.deps import get_current_user, require_role
from app.models.models import User, UserRole, UserSettings
from app.schemas.schemas import (
    UserResponse, UserUpdateRequest, UserSettingsResponse, UserSettingsUpdateRequest,
    RoleUpdateRequest, PaginatedUsersResponse,
)

router = APIRouter(tags=["Users"])


# ===== User Profile =====
@router.get("/users/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {"ok": True, "data": UserResponse.model_validate(current_user), "error": None}


@router.put("/users/profile")
async def update_profile(
    data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.full_name:
        current_user.full_name = data.full_name
    if data.email:
        # Check uniqueness
        existing = await db.execute(select(User).where(User.email == data.email, User.id != current_user.id))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = data.email
    await db.flush()
    return {"ok": True, "data": UserResponse.model_validate(current_user), "error": None}


# ===== User Settings =====
@router.get("/users/settings")
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == current_user.id))
    settings = result.scalar_one_or_none()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        await db.flush()
    return {"ok": True, "data": UserSettingsResponse.model_validate(settings), "error": None}


@router.put("/users/settings")
async def update_settings(
    data: UserSettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserSettings).where(UserSettings.user_id == current_user.id))
    settings = result.scalar_one_or_none()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    prefs = dict(settings.preferences)
    for key, val in data.model_dump(exclude_none=True).items():
        prefs[key] = val
    settings.preferences = prefs
    await db.flush()

    return {"ok": True, "data": UserSettingsResponse.model_validate(settings), "error": None}


# ===== Admin: User Management =====
@router.get("/admin/users")
async def admin_list_users(
    page: int = 1,
    per_page: int = 20,
    search: str = "",
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)
    if search:
        query = query.where(
            User.full_name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )

    # Count total
    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar() or 0

    # Paginate
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    users = result.scalars().all()

    return {
        "ok": True,
        "data": {
            "items": [UserResponse.model_validate(u) for u in users],
            "total": total,
            "page": page,
            "per_page": per_page,
            "has_next": (page * per_page) < total,
        },
        "error": None,
    }


@router.patch("/admin/users/{user_id}/role")
async def admin_update_role(
    user_id: str,
    data: RoleUpdateRequest,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = UserRole(data.role)
    await db.flush()

    return {"ok": True, "data": UserResponse.model_validate(user), "error": None}


@router.delete("/admin/users/{user_id}")
async def admin_delete_user(
    user_id: str,
    current_user: User = Depends(require_role(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    user.is_active = False  # soft delete
    await db.flush()

    return {"ok": True, "data": {"message": "User deactivated"}, "error": None}
