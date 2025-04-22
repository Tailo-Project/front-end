import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 인증 토큰이 없으면 로그인 페이지로 리다이렉트
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <h1 className="text-2xl font-bold mb-4">메인 페이지</h1>
            <p className="text-gray-600">환영합니다!</p>
        </div>
    );
};

export default MainPage;
