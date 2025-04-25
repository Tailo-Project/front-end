import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline';

import defaultProfileImage from '@/assets/defaultImage.png';
import Layout from '@/ui/layouts/layout';
import Toast from '@/ui/components/ui/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { clearAuth, getToken } from '@/shared/utils/auth';
import { fetchWithToken } from '@/token';
import { BASE_API_URL } from '@/shared/constants/apiUrl';

import LoadingSpinner from '../../common/LoadingSpinner';

interface ProfileData {
    nickname: string;
    id: string;
    countFollower: number;
    countFollowing: number;
    profileImageUrl: string;
    isFollow: boolean;
    countFeed: number;
}

const Profile = () => {
    const [posts] = useState([
        { id: 1, imageUrl: defaultProfileImage },
        { id: 2, imageUrl: defaultProfileImage },
        { id: 3, imageUrl: defaultProfileImage },
        { id: 4, imageUrl: defaultProfileImage },
        { id: 5, imageUrl: defaultProfileImage },
        { id: 6, imageUrl: defaultProfileImage },
    ]);
    const navigate = useNavigate();
    const location = useLocation();
    const accountId = location.state?.accountId;

    const myAccountId = localStorage.getItem('accountId');

    const isMyProfile = accountId === myAccountId;
    console.log(isMyProfile, 'isMyProfile');

    const { toast, showToast } = useToast();
    const [profileData, setProfileData] = useState<{ data: ProfileData }>({
        data: {
            nickname: '',
            id: '',
            countFollower: 0,
            countFollowing: 0,
            profileImageUrl: '',
            isFollow: false,
            countFeed: 0,
        },
    });

    const [isLoading, setIsLoading] = useState(true);
    const token = getToken();

    // 인증 체크 및 accountId 체크
    useEffect(() => {
        if (!token) {
            showToast('로그인이 필요한 서비스입니다.', 'error');
            navigate('/login');
            return;
        }

        if (!myAccountId) {
            showToast('잘못된 접근입니다.', 'error');
            navigate('/');
            return;
        }
    }, [token, myAccountId, navigate, showToast]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);

                const profileData = await fetchWithToken(`${BASE_API_URL}/member/profile/${myAccountId}`, {});

                const data = await profileData.json();

                if (!data.data) {
                    showToast('프로필 정보를 찾을 수 없습니다.', 'error');
                    navigate('/');
                    return;
                }

                const { nickname, countFollower, countFollowing, profileImageUrl, isFollow, countFeed } = data.data;

                setProfileData({
                    data: {
                        nickname: nickname || '',
                        id: myAccountId || '',
                        countFollower: countFollower || 0,
                        countFollowing: countFollowing || 0,
                        profileImageUrl: profileImageUrl || '',
                        isFollow: isFollow || false,
                        countFeed: countFeed || 0,
                    },
                });
            } catch (error) {
                console.error('프로필 정보 조회 중 오류:', error);
                showToast('프로필 정보 조회 중 오류가 발생했습니다.', 'error');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [myAccountId, token, showToast, navigate]);

    const handleFollow = async () => {
        try {
            const response = await fetchWithToken(`${BASE_API_URL}/member/follow/${myAccountId}`, {
                method: 'POST',
            });

            if (response.ok) {
                setProfileData((prev) => ({
                    data: {
                        ...prev.data,
                        isFollow: !prev.data.isFollow,
                        countFollower: prev.data.isFollow ? prev.data.countFollower - 1 : prev.data.countFollower + 1,
                    },
                }));
                showToast(profileData.data.isFollow ? '팔로우가 취소되었습니다.' : '팔로우하였습니다.', 'success');
            }
        } catch (error) {
            console.error('팔로우 처리 중 오류:', error);
            showToast('팔로우 처리 중 오류가 발생했습니다.', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            clearAuth();
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
                    <LoadingSpinner />
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
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="로그아웃"
                        >
                            <LogoutIcon className="w-6 h-6" />
                        </button>
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
                            <div className="font-semibold">{profileData.data.countFeed}</div>
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

                    {!isMyProfile ? (
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/profile/edit')}
                                className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors bg-blue-500 text-white"
                            >
                                프로필 수정
                            </button>
                            <button
                                onClick={() => navigate('/profile/dm')}
                                className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors bg-blue-500 text-white"
                            >
                                DM 보관함
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                                profileData.data.isFollow
                                    ? 'border border-gray-300 hover:bg-gray-50'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            {profileData.data.isFollow ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                </header>

                <div className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="w-full h-40 bg-gray-100 rounded-md"></div>
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
