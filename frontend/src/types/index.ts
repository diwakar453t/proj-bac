// ===== User Types =====
export type UserRole = 'user' | 'coach' | 'admin';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
    last_login: string | null;
    avatar_url?: string;
}

export interface UserSettings {
    id: string;
    user_id: string;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        notifications_email: boolean;
        notifications_push: boolean;
        timezone: string;
    };
}

// ===== Auth Types =====
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    full_name: string;
}

export interface AuthResponse {
    ok: boolean;
    data: {
        user: User;
        message: string;
    };
    error: null | ApiError;
}

// ===== Check-in Types =====
export interface DailyCheckin {
    id: string;
    user_id: string;
    mood: number;
    sleep_hours: number;
    notes: string;
    created_at: string;
}

export interface CheckinRequest {
    mood: number;
    sleep_hours: number;
    notes: string;
}

// ===== AI & Insights Types =====
export interface AIAnalysisResult {
    id: string;
    checkin_id: string;
    user_id: string;
    model_version: string;
    summary: string;
    labels: {
        stress_level: number;
        risk_score: number;
        overall_wellness: number;
    };
    confidence: number;
    created_at: string;
}

export interface InsightData {
    id: string;
    checkin: DailyCheckin;
    analysis: AIAnalysisResult;
}

// ===== Alert Types =====
export type AlertType = 'low_sleep' | 'high_stress' | 'risk_detected' | 'positive_trend';
export type AlertStatus = 'open' | 'acknowledged' | 'closed';

export interface Alert {
    id: string;
    user_id: string;
    ai_result_id: string | null;
    type: AlertType;
    status: AlertStatus;
    payload: Record<string, unknown>;
    created_at: string;
}

// ===== Dashboard Types =====
export interface DashboardStats {
    avg_mood: number;
    avg_sleep: number;
    checkin_streak: number;
    open_alerts: number;
    mood_trend: Array<{ date: string; mood: number }>;
    sleep_trend: Array<{ date: string; hours: number }>;
    stress_distribution: Array<{ name: string; value: number }>;
    recent_checkins: DailyCheckin[];
}

// ===== API Types =====
export interface ApiResponse<T> {
    ok: boolean;
    data: T;
    error: null | ApiError;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
}
