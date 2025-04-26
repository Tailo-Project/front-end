import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline';

import Layout from '@/ui/layouts/layout';
import Toast from '@/ui/components/ui/Toast';
import useToast from '@/shared/hooks/useToast';
import useProfile from '@/shared/hooks/useProfile';
import LoadingSpinner from '../../common/LoadingSpinner';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import ProfilePosts from './ProfilePosts';

const Profile = () => {
    const [posts] = useState([
        { id: 1, imageUrl: '' },
        { id: 2, imageUrl: '' },
        { id: 3, imageUrl: '' },
        { id: 4, imageUrl: '' },
        { id: 5, imageUrl: '' },
        { id: 6, imageUrl: '' },
    ]);
    const navigate = useNavigate();
    const location = useLocation();
    const accountId = location.state?.accountId || localStorage.getItem('accountId');
    const toastFromEdit = location.state?.toast;
    const myAccountId = localStorage.getItem('accountId');
    const isMyProfile = accountId === myAccountId;
    const { toast, showToast } = useToast();

    const { profileData, isLoading, handleFollow, handleLogout } = useProfile(accountId, showToast);

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

                    <ProfileHeader profileData={profileData} />
                    <ProfileStats profileData={profileData} />

                    <ProfileActions
                        isMyProfile={isMyProfile}
                        isFollow={profileData.data.isFollow}
                        onEdit={() => navigate('/profile/edit')}
                        onDM={() => navigate('/profile/dm')}
                        onFollow={handleFollow}
                    />
                </header>

                <ProfilePosts posts={posts} />

                {toast.show && (
                    <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
                )}
            </div>
        </Layout>
    );
};

export default Profile;
