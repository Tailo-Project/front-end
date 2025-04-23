import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getToken } from '@/lib/token';
import { FeedListResponse, FeedPost } from '@/shared/types/feed';

interface ToggleLikeResponse {
    isLiked: boolean;
}

interface MutationContext {
    previousFeeds: FeedListResponse | undefined;
    previousFeed: FeedPost | undefined;
}

export const useFeedLike = (feedId: number) => {
    const queryClient = useQueryClient();

    const updateLikeState = (feed: FeedPost): FeedPost => {
        const willLike = !feed.isLiked;
        return {
            ...feed,
            isLiked: willLike,
            likesCount: willLike ? feed.likesCount + 1 : Math.max(0, feed.likesCount - 1),
        };
    };

    const updateFeedsList = (feeds: FeedListResponse): FeedListResponse => {
        return {
            ...feeds,
            feedPosts: feeds.feedPosts.map((feed) => (feed.feedId === feedId ? updateLikeState(feed) : feed)),
        };
    };

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
        onMutate: async (): Promise<MutationContext> => {
            await Promise.all([
                queryClient.cancelQueries({ queryKey: ['feeds'] }),
                queryClient.cancelQueries({ queryKey: ['feed', feedId] }),
            ]);

            const previousFeeds = queryClient.getQueryData<FeedListResponse>(['feeds']);
            const previousFeed = queryClient.getQueryData<FeedPost>(['feed', feedId]);

            if (previousFeeds) {
                queryClient.setQueryData<FeedListResponse>(['feeds'], (old) =>
                    old ? updateFeedsList(old) : previousFeeds,
                );
            }

            if (previousFeed) {
                queryClient.setQueryData<FeedPost>(['feed', feedId], (old) =>
                    old ? updateLikeState(old) : previousFeed,
                );
            }

            return { previousFeeds, previousFeed };
        },
        onError: (_, __, context: MutationContext | undefined) => {
            if (context?.previousFeeds) {
                queryClient.setQueryData(['feeds'], context.previousFeeds);
            }
            if (context?.previousFeed) {
                queryClient.setQueryData(['feed', feedId], context.previousFeed);
            }
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
