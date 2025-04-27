import { BASE_API_URL } from './constants/apiUrl';
import { getToken, setToken } from './utils/auth';

const refreshToken = async () => {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
        throw new Error('accountId가 없습니다. 다시 로그인 해주세요.');
    }
    try {
        const response = await fetch(`${BASE_API_URL}/auth/token?accountId=${accountId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
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
            setToken(newToken);

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
