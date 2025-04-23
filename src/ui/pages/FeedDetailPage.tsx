import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import FeedHeader from '@/ui/components/features/feed/FeedHeader';
import FeedImages from '@/ui/components/features/feed/FeedImages';
import { getAccountId } from '@/shared/utils/auth';
import tailogo from '@/assets/tailogo.svg';
import { FeedPost } from '@/shared/types/feed';
import Layout from './layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthRequiredView from '../components/AuthRequiredView';
import BackButton from '../components/BackButton';
import FeedContent from '../components/features/feed/FeedContent';
import CommentInput from '../components/features/feed/CommentInput';
import LikeAction from '../components/features/feed/LikeAction';
import CommentAction from '../components/features/feed/CommentAction';
import ShareAction from '../components/features/feed/ShareAction';
import { useFeedLike } from '@/shared/hooks/useFeedLike';
import { fetchWithToken } from '@/token';
import { useFeedDetail } from '@/shared/hooks/useFeedDetail';
import { useFeedComments } from '@/shared/hooks/useFeedComments';
import { useFeedDelete } from '@/shared/hooks/useFeedDelete';
import { FEED_API_URL } from '@/shared/constants/apiUrl';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

const FeedDetailPage = () => {
    const { feedId } = useParams<{ feedId: string }>();
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');

    const queryClient = useQueryClient();
    const { data: feed, isLoading: isFeedLoading, isError } = useFeedDetail(feedId);
    const { comments, isLoading: isCommentsLoading, addComment, deleteComment } = useFeedComments(feedId);
    console.log(comments, 'cccc');
    const { handleLike } = useFeedLike(Number(feedId));
    const { deleteFeed } = useFeedDelete(feedId);

    // 현재 사용자 프로필 정보 조회
    useEffect(() => {
        const fetchUserProfile = async () => {
            const accountId = getAccountId();
            if (!accountId) return;

            try {
                const response = await fetchWithToken(
                    `${import.meta.env.VITE_API_URL}/api/member/profile/${accountId}`,
                    {},
                );
                const data = await response.json();
                setUserProfile(data.data);
            } catch (error) {
                console.error('프로필 정보 조회 실패:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 공유 기능 구현
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting || !feedId || !userProfile) return;

        setIsSubmitting(true);
        try {
            await addComment(newComment, replyToId);
            setNewComment('');
            setReplyToId(null);
        } catch (error) {
            console.error('댓글 등록 실패:', error);
            alert(error instanceof Error ? error.message : '댓글 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };

    const handleEdit = () => {
        if (!feed) return;
        setEditContent(feed.content);
        setIsEditing(true);
    };

    const handleEditSubmit = async () => {
        if (!feed || !feedId || !editContent.trim()) return;

        try {
            const formData = new FormData();
            const feedUpdateRequest = {
                content: editContent.trim(),
                hashtags: (editContent.match(/#[^\s#]+/g) || []).map((tag) => tag.slice(1)),
                imageUrls: feed.imageUrls || [],
            };

            formData.append(
                'feedUpdateRequest',
                new Blob([JSON.stringify(feedUpdateRequest)], { type: 'application/json' }),
            );

            const response = await fetchWithToken(`${FEED_API_URL}/${feedId}`, {
                method: 'PATCH',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '피드 수정에 실패했습니다.');
            }

            const updatedFeed = await response.json();

            if (updatedFeed.statusCode === 200) {
                queryClient.setQueryData(['feed', Number(feedId)], (prevFeed: FeedPost | undefined) => {
                    if (!prevFeed) return prevFeed;
                    return {
                        ...prevFeed,
                        content: editContent.trim(),
                        hashtags: feedUpdateRequest.hashtags,
                        imageUrls: feedUpdateRequest.imageUrls,
                    };
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('피드 수정 실패:', error);
            alert(error instanceof Error ? error.message : '피드 수정에 실패했습니다.');
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditContent('');
    };

    const handleReply = (commentId: number) => {
        setReplyToId(commentId);
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    };

    const handleCancelReply = () => {
        setReplyToId(null);
        setNewComment('');
    };

    const handleComment = () => {
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            await deleteComment(commentId);
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.');
        }
    };

    const isAuthor = feed?.authorNickname === userProfile?.nickname;

    const totalComments =
        comments &&
        comments.comments.reduce((acc, comment) => {
            const replyCount = comment.replies?.totalCount || 0;
            const commentCount = 1;
            return acc + commentCount + replyCount;
        }, 0);

    console.log(totalComments, 'totalComments');

    if (isFeedLoading || isCommentsLoading) {
        return (
            <Layout>
                <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    if (isError) {
        return <AuthRequiredView />;
    }

    console.log(comments?.comments[0].replies?.replies, 'comment.replies?.replies?.totalCount');

    return (
        <Layout>
            {feed && (
                <div className="bg-white min-h-screen flex flex-col">
                    <header className="flex items-center px-4 h-[52px] border-b border-gray-200 flex-shrink-0">
                        <BackButton />
                        <h1 className="flex-1 text-center font-medium">게시물</h1>
                    </header>

                    <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
                        <div className="p-4">
                            <FeedHeader
                                authorNickname={feed.authorNickname}
                                authorProfile={feed.authorProfile}
                                createdAt={feed.createdAt}
                            />
                            {isAuthor && (
                                <div className="flex items-center justify-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleEditSubmit}
                                                className="text-xs text-blue-500 hover:text-blue-600"
                                            >
                                                완료
                                            </button>
                                            <button
                                                onClick={handleEditCancel}
                                                className="text-xs text-gray-500 hover:text-gray-600"
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleEdit}
                                                className="text-xs text-gray-500 hover:text-blue-500"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={deleteFeed}
                                                className="text-xs text-red-500 hover:text-red-600"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                            {isEditing ? (
                                <div className="mt-4">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        rows={4}
                                        placeholder="내용을 입력하세요. 해시태그는 #으로 시작합니다."
                                    />
                                </div>
                            ) : (
                                <FeedContent feed={feed} />
                            )}

                            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center space-x-4">
                                    <LikeAction count={feed.likesCount} isLiked={feed.isLiked} onToggle={handleLike} />
                                    <CommentAction count={totalComments || 0} onClick={handleComment} />
                                </div>
                                <ShareAction onClick={handleShare} />
                            </div>
                        </div>

                        <CommentInput
                            newComment={newComment}
                            onCommentChange={handleCommentChange}
                            onCommentSubmit={handleCommentSubmit}
                            isSubmitting={isSubmitting}
                            replyToId={replyToId}
                            onCancelReply={handleCancelReply}
                        />

                        <div className="px-4 border-t border-gray-200">
                            {comments?.comments.map((comment) => (
                                <div key={comment.commentId} className="py-4 border-b border-gray-100">
                                    <FeedHeader
                                        authorNickname={comment.authorNickname}
                                        authorProfile={comment.authorProfile || tailogo}
                                        createdAt={comment.createdAt}
                                        rightElement={
                                            comment.authorNickname === userProfile?.nickname ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteComment(comment.commentId);
                                                        }}
                                                        className="text-xs text-red-500 hover:text-red-600"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            )
                                        }
                                    />
                                    <p className="text-sm text-gray-700 mt-1 ml-[52px]">{comment.content}</p>
                                    <button
                                        onClick={() => handleReply(comment.commentId)}
                                        className="text-xs text-gray-500 mt-2 ml-[52px] hover:text-blue-500"
                                    >
                                        답글 달기
                                    </button>
                                    {/* 답글 렌더링 */}
                                    {comment.replies?.totalCount > 0 && (
                                        <div className="flex flex-col gap-2 w-full rounded-md mt-2 bg-gray-300 p-2">
                                            {comment.replies.replies.map((reply) => (
                                                <div className="flex items-center gap-2" key={reply.commentId}>
                                                    <p>{reply.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default FeedDetailPage;
