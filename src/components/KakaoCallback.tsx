import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

interface ToastState {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}

export default function KakaoCallback() {
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        show: false,
    });

    useEffect(() => {
        const processKakaoLogin = async () => {
            const code = new URL(window.location.href).searchParams.get('code');
            const error = new URL(window.location.href).searchParams.get('error');

            if (error) {
                setToast({
                    message: '카카오 로그인이 취소되었습니다.',
                    type: 'error',
                    show: true,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }

            const grant_type = 'authorization_code';
            const REST_API = import.meta.env.VITE_KAKAO_API_KEY;
            const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

            if (code) {
                const res = await fetch(
                    `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${REST_API}&redirect_uri=${REDIRECT_URI}&code=${code}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    },
                );
                const data = await res.json();
                const accessToken = data.access_token;

                const userInfo = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-in`, {
                    method: 'POST',
                    body: JSON.stringify({ provider: 'kakao', accessToken }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!userInfo.ok) {
                    throw new Error('로그인 처리 중 오류가 발생했습니다.');
                }

                const userInfoData = await userInfo.json();

                if (userInfoData.data.accessToken === null) {
                    setToast({
                        message: '회원가입이 필요합니다.',
                        type: 'success',
                        show: true,
                    });
                    setTimeout(() => {
                        navigate('/signup', { state: { email: userInfoData.data.email } });
                    }, 1500);
                } else {
                    setToast({
                        message: '로그인이 완료되었습니다.',
                        type: 'success',
                        show: true,
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                }
            } else {
                setToast({
                    message: '인증 코드를 찾을 수 없습니다.',
                    type: 'error',
                    show: true,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        };

        processKakaoLogin();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                />
            )}
        </div>
    );
}
