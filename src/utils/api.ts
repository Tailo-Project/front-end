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
        throw new Error('요청을 처리하는 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    return data.data;
};
