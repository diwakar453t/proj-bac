import { api } from './client';
import type { DailyCheckin, CheckinRequest, DashboardStats, InsightData, Alert } from '@/types';

export const checkinApi = {
    create: (data: CheckinRequest) =>
        api.post<{ checkin: DailyCheckin; analysis_id: string }>('/checkins', data),

    list: (range = '30d') =>
        api.get<DailyCheckin[]>(`/checkins?range=${range}`),

    getById: (id: string) =>
        api.get<DailyCheckin>(`/checkins/${id}`),
};

export const dashboardApi = {
    getStats: (range = '30d') =>
        api.get<DashboardStats>(`/dashboard?range=${range}`),
};

export const insightApi = {
    getById: (id: string) =>
        api.get<InsightData>(`/insights/${id}`),

    listRecent: () =>
        api.get<InsightData[]>('/insights/recent'),
};

export const alertApi = {
    list: () => api.get<Alert[]>('/alerts'),

    acknowledge: (id: string) =>
        api.patch<Alert>(`/alerts/${id}`, { status: 'acknowledged' }),

    close: (id: string) =>
        api.patch<Alert>(`/alerts/${id}`, { status: 'closed' }),
};
