import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRightOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline';

import defaultProfileImage from '@/assets/defaultImage.png';
import Layout from '@/ui/pages/layout';
import Toast from '@/ui/components/ui/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { getAccountId, getToken, removeAccountId, removeToken } from '@/shared/utils/auth';

interface ProfileData {
    nickname: string;
    id: string;
    countFollower: number;
    countFollowing: number;
    profileImageUrl: string;
    isFollow: boolean;
}

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast, showToast } = useToast();
    const [profileData, setProfileData] = useState<{ data: ProfileData }>({
        data: {
            nickname: '',
            id: '',
            countFollower: 0,
            countFollowing: 0,
            profileImageUrl: '',
            isFollow: false,
        },
    });
    const [isLoading, setIsLoading] = useState(true);

    // 임시 게시물 데이터
    const [posts] = useState([
        { id: 1, imageUrl: defaultProfileImage },
        { id: 2, imageUrl: defaultProfileImage },
        { id: 3, imageUrl: defaultProfileImage },
        { id: 4, imageUrl: defaultProfileImage },
        { id: 5, imageUrl: defaultProfileImage },
        { id: 6, imageUrl: defaultProfileImage },
    ]);

    const accountId = getAccountId();
    const token = getToken();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!accountId) {
                showToast('로그인이 필요한 서비스입니다.', 'error');
                navigate('/login');
                return;
            }

            if (!token) {
                showToast('로그인이 필요한 서비스입니다.', 'error');
                navigate('/login');
                return;
            }

            try {
                setIsLoading(true);

                const profileData = await fetch(`${import.meta.env.VITE_API_URL}/api/member/profile/${accountId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await profileData.json();

                const { nickname, countFollower, countFollowing, profileImageUrl, isFollow } = data.data;

                setProfileData({
                    data: {
                        nickname: nickname || '',
                        id: accountId || '',
                        countFollower: countFollower || 0,
                        countFollowing: countFollowing || 0,
                        profileImageUrl: profileImageUrl || '',
                        isFollow: isFollow || false,
                    },
                });
            } catch (error) {
                console.error('프로필 정보 조회 중 오류:', error);
                showToast('프로필 정보 조회 중 오류가 발생했습니다.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [accountId, token, navigate, showToast]);

    useEffect(() => {
        if (location.state?.toast) {
            const { message, type } = location.state.toast;
            showToast(message, type);
            // Clear the state after showing toast
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate, showToast]);

    const handleLogout = async () => {
        try {
            removeToken();
            removeAccountId();
            navigate('/login');
            showToast('로그아웃되었습니다.', 'success');
        } catch (error) {
            console.error('로그아웃 중 오류가 발생했습니다:', error);
            showToast('로그아웃 중 오류가 발생했습니다.', 'error');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                    <div className="text-gray-600">프로필을 불러오는 중...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen pb-16">
                <header className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold">마이페이지</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                aria-label="로그아웃"
                            >
                                <LogoutIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center mb-6">
                        <img
                            src={profileData.data?.profileImageUrl || defaultProfileImage}
                            alt="프로필"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold mb-1">{profileData.data?.nickname}</h2>
                            <h3 className="text-gray-600 text-sm">{profileData.data.id}</h3>
                        </div>
                    </div>

                    <div className="flex justify-around mb-6">
                        <div className="text-center">
                            <div className="font-semibold">{profileData.data?.countFollower}</div>
                            <div className="text-gray-500 text-sm">게시물</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">{profileData.data?.countFollower}</div>
                            <div className="text-gray-500 text-sm">팔로워</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">{profileData.data?.countFollowing}</div>
                            <div className="text-gray-500 text-sm">팔로잉</div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/profile/edit')}
                        className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        프로필 수정
                    </button>
                </header>

                <div className="grid grid-cols-3 gap-0.5">
                    {posts.map((post) => (
                        <div key={post.id} className="aspect-square">
                            <img src={post.imageUrl} alt={`게시물 ${post.id}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {toast.show && (
                    <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
                )}
            </div>
        </Layout>
    );
};

export default Profile;
