import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedListResponse, FeedPost } from '@/types';
import { FEED_API_URL } from '../constants/apiUrl';
import { fetchWithToken } from '@/token';

interface ToggleLikeResponse {
    isLiked: boolean;
}

interface MutationContext {
    previousFeeds: { pages: FeedListResponse[] } | undefined;
    previousFeed: FeedPost | undefined;
}

const useFeedLike = (feedId: number) => {
    const queryClient = useQueryClient();

    const updateLikeState = (feed: FeedPost): FeedPost => {
        const willLike = !feed.isLiked;
        return {
            ...feed,
            isLiked: willLike,
            likesCount: willLike ? feed.likesCount + 1 : Math.max(0, feed.likesCount - 1),
        };
    };

    const updateFeedsPages = (pages: FeedListResponse[]): FeedListResponse[] => {
        return pages.map((page) => ({
            ...page,
            feedPosts: page.feedPosts.map((feed) => (feed.feedId === feedId ? updateLikeState(feed) : feed)),
        }));
    };

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const response = await fetchWithToken(`${FEED_API_URL}/${feedId}/likes`, {
                method: 'POST',
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

            const previousFeeds = queryClient.getQueryData<{ pages: FeedListResponse[] }>(['feeds']);
            const previousFeed = queryClient.getQueryData<FeedPost>(['feed', feedId]);

            if (previousFeeds) {
                queryClient.setQueryData(['feeds'], {
                    ...previousFeeds,
                    pages: updateFeedsPages(previousFeeds.pages),
                });
            }

            if (previousFeed) {
                queryClient.setQueryData<FeedPost>(['feed', feedId], updateLikeState(previousFeed));
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

export default useFeedLike;
