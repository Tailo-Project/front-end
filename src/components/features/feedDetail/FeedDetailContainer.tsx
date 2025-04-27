import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAccountId, getToken } from '@/utils/auth';
import useFeedDetail from '@/hooks/useFeedDetail';
import useFeedComments from '@/hooks/useFeedComments';
import { BASE_API_URL } from '@/constants/apiUrl';
import FeedDetailContent from './FeedDetailContent';
import LoadingSpinner from '../../common/LoadingSpinner';
import AuthRequiredView from '../../AuthRequiredView';
import Layout from '../../../layouts/layout';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

const FeedDetailContainer = () => {
    const { feedId } = useParams<{ feedId: string }>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const { data: feed, isLoading: isFeedLoading, isError } = useFeedDetail(feedId!);
    const { comments, isLoading: isCommentsLoading, deleteComment } = useFeedComments(feedId);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const accountId = getAccountId();
            if (!accountId) return;
            try {
                const response = await fetch(`${BASE_API_URL}/member/profile/${accountId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await response.json();
                setUserProfile(data.data);
            } catch (error) {
                console.error('프로필 정보 조회 실패:', error);
            }
        };
        fetchUserProfile();
    }, []);

    if (isFeedLoading || isCommentsLoading) {
        return (
            <Layout>
                <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }
    if (isError) {
        return <AuthRequiredView />;
    }
    if (!feed) return null;

    return (
        <FeedDetailContent feed={feed} userProfile={userProfile} comments={comments} deleteComment={deleteComment} />
    );
};

export default FeedDetailContainer;
