import { getToken } from './lib/token';

export const fetchWithToken = async (url: string, options: RequestInit) => {
    const token = getToken();

    if (!token) {
        throw new Error('No token found');
    }

    const headers = token ? { ...options.headers, Authorization: `Bearer ${token}` } : options.headers;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error(`Failed to fetch. HTTP status: ${response.status}`);
    }

    return response;
};
