export const TOKEN_KEY = 'accessToken';
export const ACCOUNT_ID_KEY = 'accountId';

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getAccountId = () => {
    return localStorage.getItem(ACCOUNT_ID_KEY);
};

export const setAccountId = (accountId: string) => {
    localStorage.setItem(ACCOUNT_ID_KEY, accountId);
};

export const removeAccountId = () => {
    localStorage.removeItem(ACCOUNT_ID_KEY);
};

export const clearAuth = () => {
    removeToken();
    removeAccountId();
    localStorage.clear();
    sessionStorage.clear();
};

export const verifyTokenSet = (expectedToken: string) => {
    const currentToken = getToken();
    return currentToken === expectedToken;
};

export const isAuthenticated = () => {
    return !!getToken();
};
