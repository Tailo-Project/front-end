import { useState } from 'react';
import tailoLogo from '../assets/tailogo.svg';
import kakaoSymbol from '../assets/kakao_login_medium_narrow.png';
import Toast from './Toast';

interface ToastState {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}

const Login = () => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        show: false,
    });

    const handleKakaoLogin = async () => {
        try {
            const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectUri}&response_type=code`;

            window.location.href = kakaoAuthURL;

            const code = new URL(window.location.href).searchParams.get('code');

            if (code) {
                const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: kakaoApiKey,
                        redirect_uri: redirectUri,
                        code: code,
                    }),
                });

                if (!tokenResponse.ok) {
                    throw new Error('카카오 토큰 요청에 실패했습니다.');
                }

                const tokenData = await tokenResponse.json();
                console.log('카카오 토큰:', tokenData);

                const serverResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenData.access_token}`,
                    },
                    credentials: 'include',
                });

                if (!serverResponse.ok) {
                    throw new Error('서버 인증에 실패했습니다.');
                }

                const serverData = await serverResponse.json();

                if (serverData.accessToken) {
                    localStorage.setItem('accessToken', serverData.accessToken);
                }

                setToast({
                    message: '로그인에 성공했습니다.',
                    type: 'success',
                    show: true,
                });

                if (serverData.isNewUser) {
                    window.location.href = '/signup';
                }
            }
        } catch (error) {
            console.error('카카오 로그인 처리 중 오류 발생:', error);
            setToast({
                message: error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.',
                type: 'error',
                show: true,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <div className="mb-16">
                <img src={tailoLogo} alt="Tailo Logo" className="w-[140px] h-[140px]" />
            </div>

            <button
                onClick={handleKakaoLogin}
                className="flex items-center justify-center gap-2 w-full max-w-[320px] h-[45px] bg-[#FEE500] hover:bg-[#FEE500]/90 rounded-xl text-black text-sm transition-colors"
            >
                <img src={kakaoSymbol} alt="Kakao Symbol" />
            </button>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                />
            )}
        </div>
    );
};

export default Login;
