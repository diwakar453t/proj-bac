import { api } from './client';
import type { User, UserSettings, PaginatedResponse } from '@/types';

export const userApi = {
    getProfile: () => api.get<User>('/users/profile'),

    updateProfile: (data: Partial<User>) =>
        api.put<User>('/users/profile', data),

    getSettings: () => api.get<UserSettings>('/users/settings'),

    updateSettings: (data: Partial<UserSettings['preferences']>) =>
        api.put<UserSettings>('/users/settings', data),

    // Admin endpoints
    listUsers: (page = 1, perPage = 20, search = '') =>
        api.get<PaginatedResponse<User>>(
            `/admin/users?page=${page}&per_page=${perPage}&search=${search}`
        ),

    updateUserRole: (userId: string, role: string) =>
        api.patch<User>(`/admin/users/${userId}/role`, { role }),

    deleteUser: (userId: string) =>
        api.delete<{ message: string }>(`/admin/users/${userId}`),
};
