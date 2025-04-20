import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        const processKakaoLogin = async () => {
            const code = new URL(window.location.href).searchParams.get('code');
            if (!code) {
                showToast('인증 코드를 찾을 수 없습니다.', 'error');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }
            const error = new URL(window.location.href).searchParams.get('error');

            if (error) {
                showToast('카카오 로그인이 취소되었습니다.', 'error');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                return;
            }

            try {
                const accessToken = await authService.getKakaoToken(code);
                const userInfoData = await authService.signInWithKakao(accessToken);

                if (userInfoData.data.accessToken === null) {
                    showToast('회원가입이 필요합니다.', 'success');
                    setTimeout(() => {
                        navigate('/signup', { state: { email: userInfoData.data.email } });
                    }, 1500);
                } else {
                    showToast('로그인이 완료되었습니다.', 'success');
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                }
            } catch (error) {
                showToast(error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.', 'error');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        };

        processKakaoLogin();
    }, [navigate, showToast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>

            {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default KakaoCallback;
