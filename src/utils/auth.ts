export const TOKEN_KEY = 'accessToken';
export const ACCOUNT_ID_KEY = 'accountId';

export const getAccountId = () => {
    return localStorage.getItem(ACCOUNT_ID_KEY);
};

export const setAccountId = (accountId: string) => {
    localStorage.setItem(ACCOUNT_ID_KEY, accountId);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
        throw new Error('No access token found');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 401) {
        removeToken();
        window.location.href = '/login';
        throw new Error('Authentication failed');
    }

    return response;
};
