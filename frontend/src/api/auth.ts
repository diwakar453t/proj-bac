import { api, apiClient } from './client';
import type { User, LoginRequest, SignupRequest } from '@/types';

export const authApi = {
    login: (data: LoginRequest) =>
        api.post<{ user: User; message: string }>('/auth/login', data),

    signup: (data: SignupRequest) =>
        api.post<{ user: User; message: string }>('/auth/signup', data),

    logout: () => api.post<{ message: string }>('/auth/logout'),

    getMe: () => api.get<User>('/auth/me'),

    /** Silent getMe — won't trigger refresh/redirect loop */
    getMeSilent: () => apiClient<User>('/auth/me', { skipAuth: true }),

    refresh: () => api.post<{ message: string }>('/auth/refresh'),

    forgotPassword: (email: string) =>
        api.post<{ message: string }>('/auth/forgot-password', { email }),

    resetPassword: (token: string, password: string) =>
        api.post<{ message: string }>('/auth/reset-password', { token, password }),
};
