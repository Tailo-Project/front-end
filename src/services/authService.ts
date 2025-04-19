interface KakaoTokenResponse {
    access_token: string;
}

interface UserInfoResponse {
    data: {
        email: string;
        accessToken: string | null;
    };
}

export const authService = {
    async getKakaoToken(code: string): Promise<string> {
        const grant_type = 'authorization_code';
        const REST_API = import.meta.env.VITE_KAKAO_API_KEY;
        const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

        const response = await fetch(
            `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${REST_API}&redirect_uri=${REDIRECT_URI}&code=${code}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        );
        if (!response.ok) {
            throw new Error(`카카오 토큰 발급 중 오류가 발생했습니다. 상태 코드 :  ${response.status}`);
        }
        const data: KakaoTokenResponse = await response.json();
        return data.access_token;
    },

    async signInWithKakao(accessToken: string): Promise<UserInfoResponse> {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-in`, {
            method: 'POST',
            body: JSON.stringify({ provider: 'kakao', accessToken }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('로그인 처리 중 오류가 발생했습니다.');
        }

        return response.json();
    },
};
