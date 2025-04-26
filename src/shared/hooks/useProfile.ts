import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken, clearAuth } from '@/shared/utils/auth';
import { fetchWithToken } from '@/token';
import { FOLLOW_API_URL, MEMBER_API_URL } from '@/shared/constants/apiUrl';

interface ProfileData {
    nickname: string;
    id: string;
    countFollower: number;
    countFollowing: number;
    profileImageUrl: string;
    isFollow: boolean;
    countFeed: number;
}

const useProfile = (
    accountId?: string,
    showToast?: (msg: string, type: 'success' | 'error', duration?: number) => void,
) => {
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
    const navigate = useNavigate();
    const token = getToken();
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        if (!token) {
            if (showToast) showToast('로그인이 필요한 서비스입니다.', 'error');
            if (currentPath !== '/login') navigate('/login');
            return;
        }
        if (!accountId) {
            if (showToast) showToast('잘못된 접근입니다.', 'error');
            setIsLoading(false);
            return;
        }
    }, [token, accountId, navigate, showToast, currentPath]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const profileData = await fetchWithToken(`${MEMBER_API_URL}/profile/${accountId}`, {});
                if (!profileData.ok) {
                    throw new Error('프로필 정보 조회에 실패했습니다.');
                }
                const { data } = await profileData.json();
                if (!data) {
                    throw new Error('프로필 정보가 없습니다.');
                }
                const { nickname, countFollower, countFollowing, profileImageUrl, isFollow, countFeed } = data;
                const newData = {
                    nickname: nickname || '',
                    id: accountId || '',
                    countFollower: countFollower || 0,
                    countFollowing: countFollowing || 0,
                    profileImageUrl: profileImageUrl || '',
                    isFollow: isFollow || false,
                    countFeed: countFeed || 0,
                };
                setProfileData({ data: newData });
            } catch {
                if (showToast) showToast('프로필 정보 조회 중 오류가 발생했습니다.', 'error');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };
        if (accountId) {
            fetchProfileData();
        }
    }, [accountId, token, showToast, navigate]);

    const handleFollow = useCallback(async () => {
        try {
            const method = profileData.data.isFollow ? 'DELETE' : 'POST';
            const response = await fetchWithToken(`${FOLLOW_API_URL}/${accountId}`, { method });
            if (!response.ok) {
                throw new Error('팔로우 처리에 실패했습니다.');
            }
            setProfileData((prevProfile) => {
                const updatedFollowStatus = !prevProfile.data.isFollow;
                return {
                    data: { ...prevProfile.data, isFollow: updatedFollowStatus },
                };
            });
            if (showToast)
                showToast(profileData.data.isFollow ? '팔로우가 취소되었습니다.' : '팔로우하였습니다.', 'success');
        } catch {
            if (showToast) showToast('팔로우 처리 중 오류가 발생했습니다.', 'error');
        }
    }, [profileData, accountId, showToast]);

    const handleLogout = useCallback(() => {
        clearAuth();
        navigate('/login');
        if (showToast) showToast('로그아웃되었습니다.', 'success');
    }, [navigate, showToast]);

    return {
        profileData,
        isLoading,
        handleFollow,
        handleLogout,
    };
};

export default useProfile;
