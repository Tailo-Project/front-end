import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedPost } from '@/shared/types/feed';
import { FEED_API_URL } from '../constants/apiUrl';
import { fetchWithToken } from '@/token';

interface FeedListResponse {
    feedPosts: FeedPost[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
    };
}

const PAGE_SIZE = 10; // 처음에 보여줄 값들

export const useFeeds = () => {
    return useInfiniteQuery<FeedListResponse>({
        queryKey: ['feeds'],
        queryFn: async ({ pageParam = 0 }) => {
            console.log(pageParam);
            const response = await fetchWithToken(`${FEED_API_URL}?page=${pageParam}&size=${PAGE_SIZE}`, {});
            if (!response.ok) {
                throw new Error('피드 목록을 불러오는데 실패했습니다.');
            }

            const result = await response.json();
            return result.data;
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 0,
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};
