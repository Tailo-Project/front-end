import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import tailogo from '../assets/tailogo.svg';
import Layout from './layout';
import Toast from './Toast';

interface ProfileStats {
    posts: number;
    followers: number;
    following: number;
}

const Profile = () => {
    const navigate = useNavigate();
    const [stats] = useState<ProfileStats>({
        posts: 25,
        followers: 128,
        following: 84,
    });
    const [showToast, setShowToast] = useState(false);

    // 임시 게시물 데이터
    const [posts] = useState([
        { id: 1, imageUrl: tailogo },
        { id: 2, imageUrl: tailogo },
        { id: 3, imageUrl: tailogo },
        { id: 4, imageUrl: tailogo },
        { id: 5, imageUrl: tailogo },
        { id: 6, imageUrl: tailogo },
    ]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                // 로컬 스토리지의 사용자 관련 데이터 삭제
                localStorage.removeItem('user');
                // 로그인 페이지로 리다이렉트
                navigate('/login');
            } else {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error('로그아웃 중 오류가 발생했습니다:', error);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen pb-16">
                {/* 프로필 헤더 */}
                <header className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold">마이페이지</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                aria-label="로그아웃"
                            >
                                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                                <Cog6ToothIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* 프로필 정보 */}
                    <div className="flex items-center mb-6">
                        <img src={tailogo} alt="프로필" className="w-20 h-20 rounded-full object-cover" />
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold mb-1">멍멍이맘</h2>
                            <p className="text-gray-600 text-sm">반려동물과 함께하는 일상을 공유해요 🐶</p>
                        </div>
                    </div>

                    {/* 통계 */}
                    <div className="flex justify-around mb-6">
                        <div className="text-center">
                            <div className="font-semibold">{stats.posts}</div>
                            <div className="text-gray-500 text-sm">게시물</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">{stats.followers}</div>
                            <div className="text-gray-500 text-sm">팔로워</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">{stats.following}</div>
                            <div className="text-gray-500 text-sm">팔로잉</div>
                        </div>
                    </div>

                    {/* 프로필 수정 버튼 */}
                    <button
                        onClick={() => navigate('/profile/edit')}
                        className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        프로필 수정
                    </button>
                </header>

                {/* 게시물 그리드 */}
                <div className="grid grid-cols-3 gap-0.5">
                    {posts.map((post) => (
                        <div key={post.id} className="aspect-square">
                            <img src={post.imageUrl} alt={`게시물 ${post.id}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* 토스트 메시지 */}
                {showToast && (
                    <Toast
                        message="로그아웃 중 오류가 발생했습니다."
                        type="error"
                        onClose={() => setShowToast(false)}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Profile;
