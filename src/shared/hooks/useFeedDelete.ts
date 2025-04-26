import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FeedListResponse } from '@/shared/types/feed';
import { fetchWithToken } from '@/token';
import { FEED_API_URL } from '../constants/apiUrl';

const useFeedDelete = (feedId: string | undefined) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteFeed = async () => {
        if (!feedId || !confirm('피드를 삭제하시겠습니까?')) return;

        try {
            const response = await fetchWithToken(`${FEED_API_URL}/${feedId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '피드 삭제에 실패했습니다.');
            }

            // 피드 삭제 후 캐시 업데이트
            queryClient.setQueryData<FeedListResponse>(['feeds'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    feedPosts: old.feedPosts.filter((feed) => feed.feedId !== Number(feedId)),
                };
            });

            // 삭제된 피드의 캐시 제거
            queryClient.removeQueries({ queryKey: ['feed', Number(feedId)] });

            // 피드 목록 페이지로 이동
            navigate('/');

            // 성공 메시지 표시
            alert('피드가 삭제되었습니다.');
        } catch (error) {
            console.error('피드 삭제 실패:', error);
            alert(error instanceof Error ? error.message : '피드 삭제에 실패했습니다.');
        }
    };

    return { deleteFeed };
};

export default useFeedDelete;
