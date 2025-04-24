import { getToken } from './lib/manageToken';
import { BASE_API_URL } from './shared/constants/apiUrl';

const refreshToken = async () => {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data.accessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

export const fetchWithToken = async (url: string, options: RequestInit) => {
    const token = getToken();
    const headers = token ? { ...options.headers, Authorization: `Bearer ${token}` } : options.headers;
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        try {
            const newToken = await refreshToken();
            localStorage.setItem('accessToken', newToken);

            const newHeaders = { ...options.headers, Authorization: `Bearer ${newToken}` };
            const retryResponse = await fetch(url, { ...options, headers: newHeaders });
            if (!retryResponse.ok) {
                throw new Error(`Failed to fetch after token refresh. HTTP status: ${retryResponse.status}`);
            }
            return retryResponse;
        } catch (error) {
            console.error('Token refresh and retry failed:', error);
            throw error;
        }
    } else if (!response.ok) {
        throw new Error(`Failed to fetch. HTTP status: ${response.status}`);
    }
    return response;
};
