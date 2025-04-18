import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { authService } from '../services/authService';

interface ToastState {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}

const KakaoCallback = () => {
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

            if (!code) {
                setToast({
                    message: '인증 코드를 찾을 수 없습니다.',
                    type: 'error',
                    show: true,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }

            try {
                const accessToken = await authService.getKakaoToken(code);
                const userInfoData = await authService.signInWithKakao(accessToken);

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
            } catch (error) {
                setToast({
                    message: error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.',
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
};

export default KakaoCallback;
