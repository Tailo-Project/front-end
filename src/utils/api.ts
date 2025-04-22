import { createApiError } from '@/types/error';
import { getToken } from './auth';

interface FetchOptions extends RequestInit {
    requiresAuth?: boolean;
}

export const fetchApi = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const { requiresAuth = true, headers: customHeaders, ...fetchOptions } = options;

    const headers = new Headers(customHeaders);

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

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
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401) {
            throw createApiError('AUTH', errorData.message);
        }
        if (response.status === 404) {
            throw createApiError('NOT_FOUND', errorData.message);
        }
        if (response.status === 400) {
            throw createApiError('BAD_REQUEST', errorData.message);
        }
        if (response.status === 500) {
            throw createApiError('NETWORK', errorData.message);
        }
        throw createApiError('UNKNOWN', errorData.message);
    }

    const data = await response.json();
    return data.data;
};
