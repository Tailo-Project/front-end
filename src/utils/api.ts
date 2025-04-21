import { createApiError } from '@/types/error';
import { getToken } from './auth';

interface FetchOptions extends RequestInit {
    requiresAuth?: boolean;
}

export const fetchApi = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers = new Headers({
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    });

    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw createApiError('AUTH');
        }
        if (response.status === 404) {
            throw createApiError('NOT_FOUND');
        }
        if (response.status === 400) {
            throw createApiError('BAD_REQUEST');
        }
        if (response.status === 500) {
            throw createApiError('NETWORK');
        }
        throw createApiError('UNKNOWN');
    }

    const data = await response.json();
    return data.data;
};
