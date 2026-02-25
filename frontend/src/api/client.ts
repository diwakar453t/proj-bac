import type { ApiResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

function processQueue() {
    refreshQueue.forEach((cb) => cb());
    refreshQueue = [];
}

async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        return res.ok;
    } catch {
        return false;
    }
}

interface ApiClientOptions extends RequestInit {
    skipAuth?: boolean;
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
    const { skipAuth, ...fetchOptions } = options;
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
        ...fetchOptions,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        },
    };

    let response = await fetch(url, config);

    // Handle 401 — try refresh
    if (response.status === 401 && !skipAuth) {
        if (!isRefreshing) {
            isRefreshing = true;
            const refreshed = await refreshToken();
            isRefreshing = false;

            if (refreshed) {
                processQueue();
                response = await fetch(url, config);
            } else {
                refreshQueue = [];
                throw new Error('Session expired');
            }
        } else {
            // Wait for refresh to complete
            return new Promise<ApiResponse<T>>((resolve) => {
                refreshQueue.push(async () => {
                    const retryRes = await fetch(url, config);
                    resolve(await retryRes.json());
                });
            });
        }
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.error?.message || 'Something went wrong');
    }

    return data;
}

// Convenience methods
export const api = {
    get: <T>(endpoint: string) => apiClient<T>(endpoint),

    post: <T>(endpoint: string, body?: unknown) =>
        apiClient<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(endpoint: string, body?: unknown) =>
        apiClient<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(endpoint: string, body?: unknown) =>
        apiClient<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string) =>
        apiClient<T>(endpoint, { method: 'DELETE' }),
};
