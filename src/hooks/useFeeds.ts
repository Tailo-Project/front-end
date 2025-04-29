import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedPost } from '@/types';
import { FEED_API_URL } from '../constants/apiUrl';
import { fetchWithToken } from '@/token';

interface Pagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

interface FeedListResponse {
    feedPosts: FeedPost[];
    pagination: Pagination;
}

const PAGE_SIZE = 10;

const useFeeds = () => {
    return useInfiniteQuery<FeedListResponse>({
        queryKey: ['feeds'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchWithToken(`${FEED_API_URL}?page=${pageParam}&size=${PAGE_SIZE}`, {
                method: 'GET',
            });
            const result = await response.json();
            if (!result.data || !Array.isArray(result.data.feedPosts)) {
                return {
                    feedPosts: [],
                    pagination: {
                        currentPage: 1,
                        pageSize: PAGE_SIZE,
                        totalPages: 1,
                        totalItems: 0,
                    },
                };
            }
            return result.data;
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 0,
        staleTime: 30 * 1000, // 30초
        gcTime: 5 * 60 * 1000, // 5분
        retry: 1, // 한 번만 재시도
    });
};

export default useFeeds;
