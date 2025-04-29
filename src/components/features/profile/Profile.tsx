import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRightOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline';

import Layout from '@/layouts/layout';
import Toast from '@/components/Toast';
import useToast from '@/hooks/useToast';
import useProfile from '@/hooks/useProfile';
import ProfileHeader from '@/components/features/profile/ProfileHeader';
import ProfileStats from '@/components/features/profile/ProfileStats';
import ProfileActions from '@/components/features/profile/ProfileActions';
import ProfilePosts from '@/components/features/profile/ProfilePosts';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FEED_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import { MemberFeed } from '@/types';

const Profile = () => {
    const navigate = useNavigate();
    const { accountId: paramAccountId } = useParams();
    const location = useLocation();

    const accountId = paramAccountId || location.state?.accountId || localStorage.getItem('accountId');
    const toastFromEdit = location.state?.toast;
    const myAccountId = localStorage.getItem('accountId');
    const isMyProfile = accountId === myAccountId;
    const { toast, showToast } = useToast();

    const { profileData, isLoading, handleFollow, handleLogout } = useProfile(accountId, showToast);
    console.log(profileData);
    const [memberFeed, setMemberFeed] = useState<MemberFeed[]>([]);

    useEffect(() => {
        const feedImages = async () => {
            const response = await fetchWithToken(`${FEED_API_URL}/${isMyProfile ? myAccountId : accountId}/images`, {
                method: 'GET',
            });
            const { data } = await response.json();
            setMemberFeed(data.memberFeedImages);
        };
        feedImages();
    }, []);

    useEffect(() => {
        if (toastFromEdit) {
            showToast(toastFromEdit.message, toastFromEdit.type);
            window.history.replaceState({}, document.title);
        }
    }, [toastFromEdit, showToast]);

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
            <div className="w-full max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto bg-white min-h-screen pb-16">
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

                    <ProfileHeader profileData={profileData} />
                    <ProfileStats profileData={profileData} />

                    <ProfileActions
                        isMyProfile={isMyProfile}
                        isFollow={profileData.data.isFollow}
                        onFollow={handleFollow}
                        accountId={profileData.data.id}
                    />
                </header>

                <ProfilePosts memberFeed={memberFeed} onImageClick={(feedId) => navigate(`/feeds/${feedId}`)} />

                {toast.show && (
                    <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
                )}
            </div>
        </Layout>
    );
};

export default Profile;
