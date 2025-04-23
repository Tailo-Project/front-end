import { useQuery } from '@tanstack/react-query';
import { FeedPost } from '@/shared/types/feed';
import { fetchWithToken } from '@/token';
import { FEED_API_URL } from '../constants/apiUrl';

export const useFeedDetail = (feedId: string | undefined) => {
    return useQuery<FeedPost>({
        queryKey: ['feed', Number(feedId)],
        queryFn: async () => {
            const response = await fetchWithToken(`${FEED_API_URL}/${feedId}`, {});
            if (!response.ok) {
                throw new Error('피드 조회에 실패했습니다.');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!feedId,
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
