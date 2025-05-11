import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentsResponse, FeedPost } from '@/types';
import { fetchWithToken } from '@/token';
import { FEED_API_URL } from '../constants/apiUrl';

const useFeedComments = (feedId: string | undefined) => {
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery<CommentsResponse>({
        queryKey: ['feedComments', Number(feedId)],
        queryFn: async () => {
            const response = await fetchWithToken(`${FEED_API_URL}/${feedId}/comments`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('댓글 조회에 실패했습니다.');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!feedId,
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const addComment = async (content: string, parentId: number | null = null) => {
        const response = await fetchWithToken(`${FEED_API_URL}/${feedId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parentId,
                content: content.trim(),
            }),
        });

        if (!response.ok) {
            throw new Error('댓글 등록에 실패했습니다.');
        }

        await queryClient.invalidateQueries({ queryKey: ['feedComments', Number(feedId)] });
        queryClient.setQueryData(['feed', Number(feedId)], (oldData: FeedPost | undefined) => {
            if (!oldData) return undefined;
            return {
                ...oldData,
                commentsCount: (oldData.commentsCount || 0) + 1,
            };
        });
    };

    const deleteComment = async (commentId: number) => {
        const response = await fetchWithToken(`${FEED_API_URL}/${feedId}/comments/${commentId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('댓글 삭제에 실패했습니다.');
        }

        queryClient.setQueryData(['feedComments', Number(feedId)], ({ comments }: CommentsResponse) => {
            return {
                ...comments,
                comments: comments.filter((comment) => comment.commentId !== commentId),
            };
        });
    };

    return {
        comments,
        isLoading,
        addComment,
        deleteComment,
    };
};

export default useFeedComments;
