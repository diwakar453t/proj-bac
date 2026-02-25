"""
MVP Rule-based AI analysis service.
Analyzes check-in data to generate wellness scores and alerts.
"""
from app.models.models import DailyCheckin, AIAnalysisResult, Alert, AlertType
from sqlalchemy.ext.asyncio import AsyncSession


async def analyze_checkin(checkin: DailyCheckin, db: AsyncSession) -> AIAnalysisResult:
    """Run rule-based analysis on a check-in and create alerts if needed."""

    mood = checkin.mood
    sleep = checkin.sleep_hours

    # ===== Rule-based scoring =====
    # Stress level (inverse of mood, 1-10)
    stress_level = max(1, 11 - mood)

    # Risk score (0-10, higher is riskier)
    risk_score = 0
    if mood <= 3:
        risk_score += 4
    elif mood <= 5:
        risk_score += 2

    if sleep < 5:
        risk_score += 3
    elif sleep < 6:
        risk_score += 1

    if mood <= 3 and sleep < 5:
        risk_score += 2  # compounding

    risk_score = min(10, risk_score)

    # Overall wellness (1-10)
    mood_weight = 0.6
    sleep_weight = 0.4
    sleep_score = min(10, sleep / 8 * 10)  # 8h = perfect
    overall_wellness = round(mood * mood_weight + sleep_score * sleep_weight, 1)

    # Confidence (higher for extreme values)
    confidence = 0.85 if (mood <= 3 or mood >= 8 or sleep < 5 or sleep > 9) else 0.75

    # ===== Generate summary =====
    summary_parts = []
    if mood >= 8:
        summary_parts.append("Your mood is excellent today!")
    elif mood >= 6:
        summary_parts.append("Your mood is fairly good.")
    elif mood >= 4:
        summary_parts.append("Your mood is moderate today. Consider activities that uplift you.")
    else:
        summary_parts.append("Your mood is quite low. Please take care and consider reaching out to someone.")

    if sleep >= 7:
        summary_parts.append(f"Great sleep at {sleep}h.")
    elif sleep >= 5:
        summary_parts.append(f"Sleep at {sleep}h is below recommended. Try to improve your sleep routine.")
    else:
        summary_parts.append(f"Only {sleep}h of sleep is concerning. Prioritize rest tonight.")

    summary = " ".join(summary_parts)

    # ===== Store analysis =====
    analysis = AIAnalysisResult(
        checkin_id=checkin.id,
        user_id=checkin.user_id,
        summary=summary,
        labels={
            "stress_level": stress_level,
            "risk_score": risk_score,
            "overall_wellness": overall_wellness,
        },
        confidence=confidence,
    )
    db.add(analysis)
    await db.flush()

    # ===== Generate alerts =====
    if sleep < 5:
        alert = Alert(
            user_id=checkin.user_id,
            ai_result_id=analysis.id,
            type=AlertType.LOW_SLEEP,
            payload={"sleep_hours": sleep, "message": f"Sleep was only {sleep}h"},
        )
        db.add(alert)

    if stress_level >= 7:
        alert = Alert(
            user_id=checkin.user_id,
            ai_result_id=analysis.id,
            type=AlertType.HIGH_STRESS,
            payload={"stress_level": stress_level, "mood": mood, "message": "High stress detected"},
        )
        db.add(alert)

    if risk_score >= 6:
        alert = Alert(
            user_id=checkin.user_id,
            ai_result_id=analysis.id,
            type=AlertType.RISK_DETECTED,
            payload={"risk_score": risk_score, "message": "Elevated risk indicators detected"},
        )
        db.add(alert)

    if mood >= 8 and sleep >= 7:
        alert = Alert(
            user_id=checkin.user_id,
            ai_result_id=analysis.id,
            type=AlertType.POSITIVE_TREND,
            payload={"message": "Excellent mood and sleep!"},
        )
        db.add(alert)

    await db.flush()
    return analysis
