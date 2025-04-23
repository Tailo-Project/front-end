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

            const responseData = await response.json();

            if (response.status === 200) {
                const currentFeed = queryClient.getQueryData<FeedPost>(['feed', feedId]);
                return { isLiked: currentFeed ? !currentFeed.isLiked : true } as ToggleLikeResponse;
            }

            return responseData.data as ToggleLikeResponse;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['feeds'] });
            await queryClient.cancelQueries({ queryKey: ['feed', feedId] });

            const previousFeeds = queryClient.getQueryData<FeedListResponse>(['feeds']);
            const previousFeed = queryClient.getQueryData<FeedPost>(['feed', feedId]);

            // 피드 목록 업데이트
            if (previousFeeds) {
                queryClient.setQueryData<FeedListResponse>(['feeds'], (old) => {
                    if (!old) return previousFeeds;
                    return {
                        ...old,
                        feedPosts: old.feedPosts.map((feed) => {
                            if (feed.feedId === feedId) {
                                const willLike = !feed.isLiked;
                                const newCount = willLike ? feed.likesCount + 1 : Math.max(0, feed.likesCount - 1);
                                return {
                                    ...feed,
                                    isLiked: willLike,
                                    likesCount: newCount,
                                };
                            }
                            return feed;
                        }),
                    };
                });
            }

            // 단일 피드 업데이트
            if (previousFeed) {
                queryClient.setQueryData<FeedPost>(['feed', feedId], (old) => {
                    if (!old) return previousFeed;
                    const willLike = !old.isLiked;
                    const newCount = willLike ? old.likesCount + 1 : Math.max(0, old.likesCount - 1);
                    return {
                        ...old,
                        isLiked: willLike,
                        likesCount: newCount,
                    };
                });
            }

            return { previousFeeds, previousFeed };
        },
        onError: (_, __, context) => {
            if (context?.previousFeeds) {
                queryClient.setQueryData(['feeds'], context.previousFeeds);
            }
            if (context?.previousFeed) {
                queryClient.setQueryData(['feed', feedId], context.previousFeed);
            }
        },
        onSettled: () => {
            // mutation이 완료되면 관련 쿼리들을 무효화하지 않음
            // queryClient.invalidateQueries({ queryKey: ['feeds'] });
            // queryClient.invalidateQueries({ queryKey: ['feed', feedId] });
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
        isPending: toggleLikeMutation.isPending,
    };
};
