import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getToken } from '@/lib/token';
import { FeedPost } from '@/shared/types/feed';

interface ToggleLikeResponse {
    isLiked: boolean;
}

interface FeedListResponse {
    feedPosts: FeedPost[];
    hasNext: boolean;
    page: number;
}

export const useFeedLike = (feedId: number) => {
    const queryClient = useQueryClient();

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/likes`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('좋아요 처리에 실패했습니다.');
            }

            const result = (await response.json()) as ToggleLikeResponse;
            return result;
        },
        onMutate: async () => {
            // 진행 중인 피드 관련 요청들을 취소
            await queryClient.cancelQueries({ queryKey: ['feed', feedId] });
            await queryClient.cancelQueries({ queryKey: ['feeds'] });

            // 이전 피드 데이터를 캐시에서 가져옴
            const previousFeed = queryClient.getQueryData<FeedPost>(['feed', feedId]);
            const previousFeeds = queryClient.getQueryData<FeedListResponse>(['feeds']);

            // 낙관적 업데이트: 단일 피드
            if (previousFeed) {
                const newLikeState = !previousFeed.isLiked;
                const newLikeCount = previousFeed.likesCount + (newLikeState ? 1 : -1);

                queryClient.setQueryData<FeedPost>(['feed', feedId], {
                    ...previousFeed,
                    isLiked: newLikeState,
                    likesCount: newLikeCount,
                });
            }

            // 낙관적 업데이트: 피드 목록
            if (previousFeeds) {
                queryClient.setQueryData<FeedListResponse>(['feeds'], {
                    ...previousFeeds,
                    feedPosts: previousFeeds.feedPosts.map((feed) =>
                        feed.feedId === feedId
                            ? {
                                  ...feed,
                                  isLiked: !feed.isLiked,
                                  likesCount: feed.likesCount + (!feed.isLiked ? 1 : -1),
                              }
                            : feed,
                    ),
                });
            }

            return { previousFeed, previousFeeds };
        },
        onError: (_, __, context) => {
            // 에러 발생 시 이전 상태로 롤백
            if (context?.previousFeed) {
                queryClient.setQueryData(['feed', feedId], context.previousFeed);
            }
            if (context?.previousFeeds) {
                queryClient.setQueryData(['feeds'], context.previousFeeds);
            }
        },
        onSuccess: (response) => {
            // 서버 응답을 기반으로 캐시 업데이트
            queryClient.setQueryData<FeedPost>(['feed', feedId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    isLiked: response.isLiked,
                    likesCount: old.likesCount + (response.isLiked ? 1 : -1),
                };
            });

            queryClient.setQueryData<FeedListResponse>(['feeds'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    feedPosts: old.feedPosts.map((feed) =>
                        feed.feedId === feedId
                            ? {
                                  ...feed,
                                  isLiked: response.isLiked,
                                  likesCount: feed.likesCount + (response.isLiked ? 1 : -1),
                              }
                            : feed,
                    ),
                };
            });
        },
    });

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleLikeMutation.mutateAsync();
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    return {
        handleLike,
    };
};
