import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/lib/token';
import { FeedPost } from '@/shared/types/feed';

interface FeedListResponse {
    feedPosts: FeedPost[];
    hasNext: boolean;
    page: number;
}

export const useFeeds = () => {
    return useQuery<FeedListResponse>({
        queryKey: ['feeds'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('피드 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            return data.data;
        },
        staleTime: 10 * 1000, // 10초 동안 데이터를 fresh 상태로 유지
        gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
        refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    });
};
