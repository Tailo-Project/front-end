import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedPost } from '@/types';
import { FEED_API_URL } from '../constants/apiUrl';
import { fetchWithToken } from '@/token';

interface FeedListResponse {
    feedPosts: FeedPost[];
    hasNext: boolean;
    page: number;
}

const PAGE_SIZE = 10;

const useFeeds = () => {
    return useInfiniteQuery<FeedListResponse>({
        queryKey: ['feeds'],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetchWithToken(`${FEED_API_URL}?page=${pageParam}&size=${PAGE_SIZE}`, {});
            const result = await response.json();
            if (!result.data || !Array.isArray(result.data.feedPosts)) {
                return {
                    feedPosts: [],
                    hasNext: false,
                    page: 1,
                };
            }
            return result.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasNext ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 0,
        staleTime: 30 * 1000, // 30초
        gcTime: 5 * 60 * 1000, // 5분
        retry: 1, // 한 번만 재시도
    });
};

export default useFeeds;
