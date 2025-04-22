import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline';

import defaultProfileImage from '../assets/defaultImage.png';
import Layout from './layout';
import Toast from './Toast';
import { getAccountId, getToken, removeAccountId, removeToken } from '@/utils/auth';

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
    const [showToast, setShowToast] = useState(false);
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
    const [toastMessage, setToastMessage] = useState('');
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
                setToastMessage('로그인이 필요한 서비스입니다.');
                setShowToast(true);
                navigate('/login');
                return;
            }

            if (!token) {
                setToastMessage('로그인이 필요한 서비스입니다.');
                setShowToast(true);
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
                setShowToast(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [accountId, token, navigate]);

    const handleLogout = async () => {
        try {
            removeToken();
            removeAccountId();
            navigate('/login');
            setToastMessage('로그아웃 중 오류가 발생했습니다.');
            setShowToast(true);
        } catch (error) {
            console.error('로그아웃 중 오류가 발생했습니다:', error);
            setToastMessage('로그아웃 중 오류가 발생했습니다.');
            setShowToast(true);
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

                {showToast && <Toast message={toastMessage} type="error" onClose={() => setShowToast(false)} />}
            </div>
        </Layout>
    );
};

export default Profile;
