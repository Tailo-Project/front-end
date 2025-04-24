import { getToken } from './lib/manageToken';
import { BASE_API_URL } from './shared/constants/apiUrl';

const refreshToken = async () => {
    const response = await fetch(`${BASE_API_URL}/auth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data.accessToken;
};
export const fetchWithToken = async (url: string, options: RequestInit) => {
    const token = getToken();

    const headers = token ? { ...options.headers, Authorization: `Bearer ${token}` } : options.headers;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error(`Failed to fetch. HTTP status: ${response.status}`);
    }

    if (response.status === 401) {
        const newToken = await refreshToken();
        localStorage.setItem('accessToken', newToken);
    }

    return response;
};
