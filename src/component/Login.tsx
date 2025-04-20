import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tailoLogo from '../assets/tailogo.svg';
import kakaoSymbol from '../assets/kakao_login_medium_narrow.png';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';
import { authService } from '../services/authService';

const Login = () => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const { toast, showToast } = useToast();
    const navigate = useNavigate();

    const handleKakaoLogin = () => {
        try {
            const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectUri}&response_type=code`;
            window.location.href = kakaoAuthURL;
        } catch (error) {
            console.error('카카오 로그인 초기화 중 오류 발생:', error);
            showToast('로그인 처리 중 오류가 발생했습니다.', 'error');
        }
    };

    useEffect(() => {
        const processKakaoLogin = async () => {
            const code = new URL(window.location.href).searchParams.get('code');
            const error = new URL(window.location.href).searchParams.get('error');

            if (error) {
                showToast('카카오 로그인이 취소되었습니다.', 'error');
                return;
            }

            if (!code) {
                return;
            }

            try {
                const accessToken = await authService.getKakaoToken(code);
                const userInfoData = await authService.signInWithKakao(accessToken);

                if (userInfoData.data.accessToken === null) {
                    showToast('회원가입이 필요합니다.', 'success');
                    navigate('/signup', { state: { email: userInfoData.data.email } });
                } else {
                    showToast('로그인이 완료되었습니다.', 'success');
                    localStorage.setItem('accessToken', userInfoData.data.accessToken);
                    navigate('/');
                }
            } catch (error) {
                console.error('카카오 로그인 처리 중 오류 발생:', error);
                showToast(error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.', 'error');
            }
        };

        processKakaoLogin();
    }, [navigate, showToast]);

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
                <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
            )}
        </div>
    );
};

export default Login;
