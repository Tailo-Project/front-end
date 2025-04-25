import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import FeedHeader from '@/ui/components/features/feed/FeedHeader';
import FeedImages from '@/ui/components/features/feed/FeedImages';

import { getAccountId, getToken } from '@/shared/utils/auth';

import tailogo from '@/assets/tailogo.svg';
import { CommentsResponse, FeedListResponse, FeedPost } from '@/shared/types/feed';
import Layout from '../layouts/layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthRequiredView from '../components/AuthRequiredView';
import BackButton from '../components/BackButton';
import FeedContent from '../components/features/feed/FeedContent';

import CommentInput from '../components/features/feed/CommentInput';
import LikeAction from '../components/features/feed/LikeAction';
import CommentAction from '../components/features/feed/CommentAction';

import { useFeedLike } from '@/shared/hooks/useFeedLike';

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
    const navigate = useNavigate();

    const {
        data: feed,
        isLoading: isFeedLoading,
        isError,
    } = useQuery<FeedPost>({
        queryKey: ['feed', Number(feedId)],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) {
                throw new Error('피드 조회에 실패했습니다.');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!feedId,
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { data: comments, isLoading: isCommentsLoading } = useQuery<CommentsResponse>({
        queryKey: ['feedComments', Number(feedId)],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/comments`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) {
                throw new Error('댓글 조회에 실패했습니다.');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!feedId,
        staleTime: 10 * 1000, // 10초 동안 데이터를 fresh 상태로 유지
        gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
        refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
    });

    const { handleLike } = useFeedLike(Number(feedId));

    const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!feed) return;
        handleLike(e);
    };

    // 현재 사용자 프로필 정보 조회
    useEffect(() => {
        const fetchUserProfile = async () => {
            const accountId = getAccountId();
            if (!accountId) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/member/profile/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                const data = await response.json();
                setUserProfile(data.data);
            } catch (error) {
                console.error('프로필 정보 조회 실패:', error);
            }
        };

        fetchUserProfile();
    }, []);

    // 댓글 작성 처리
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim() || isSubmitting || !feedId || !userProfile) return;

        try {
            setIsSubmitting(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    parentId: replyToId,
                    content: newComment.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('댓글 등록에 실패했습니다.');
            }

            // 댓글 목록만 갱신하고, 피드 데이터는 commentsCount만 업데이트
            await queryClient.invalidateQueries({ queryKey: ['feedComments', Number(feedId)] });

            // 피드 데이터의 commentsCount만 업데이트
            queryClient.setQueryData(['feed', Number(feedId)], (oldData: FeedPost | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    commentsCount: (oldData.commentsCount || 0) + 1,
                };
            });

            // 입력 필드 초기화
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

            // feedUpdateRequest JSON 데이터 추가
            const feedUpdateRequest = {
                content: editContent.trim(),
                hashtags: (editContent.match(/#[^\s#]+/g) || []).map((tag) => tag.slice(1)),
                imageUrls: feed.imageUrls || [],
            };

            formData.append(
                'feedUpdateRequest',
                new Blob([JSON.stringify(feedUpdateRequest)], { type: 'application/json' }),
            );

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
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
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditContent('');
    };

    const handleDelete = async () => {
        if (!confirm('피드를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '피드 삭제에 실패했습니다.');
            }

            // 피드 삭제 후 캐시 업데이트
            queryClient.setQueryData<FeedListResponse>(['feeds'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    feedPosts: old.feedPosts.filter((feed) => feed.feedId !== Number(feedId)),
                };
            });

            // 삭제된 피드의 캐시 제거
            queryClient.removeQueries({ queryKey: ['feed', Number(feedId)] });

            // 피드 목록 페이지로 이동
            navigate('/');

            // 성공 메시지 표시
            alert('피드가 삭제되었습니다.');
        } catch (error) {
            console.error('피드 삭제 실패:', error);
            alert(error instanceof Error ? error.message : '피드 삭제에 실패했습니다.');
        }
    };

    // 답글 작성 모드 설정
    const handleReply = (commentId: number) => {
        setReplyToId(commentId);
        // 댓글 입력 필드로 포커스 이동
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    };

    // 답글 작성 취소
    const handleCancelReply = () => {
        setReplyToId(null);
        setNewComment('');
    };

    const handleComment = () => {
        // 댓글 입력 필드로 포커스 이동
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    };

    // 댓글 삭제 처리
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('댓글 삭제에 실패했습니다.');
            }

            // 댓글 목록만 갱신하고, 피드 데이터는 commentsCount만 업데이트
            await queryClient.invalidateQueries({ queryKey: ['feedComments', Number(feedId)] });

            // 피드 데이터의 commentsCount만 업데이트
            queryClient.setQueryData(['feed', Number(feedId)], (oldData: FeedPost | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    commentsCount: Math.max(0, (oldData.commentsCount || 0) - 1),
                };
            });
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.');
        }
    };

    const isAuthor = feed?.authorNickname === userProfile?.nickname;

    const totalComments = comments
        ? comments.comments.reduce((acc, comment) => {
              const replyCount = comment.replies?.replies?.length || 0;
              const commentCount = 1;
              return acc + commentCount + replyCount;
          }, 0)
        : 0;

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

    return (
        <Layout>
            {feed && (
                <div className="bg-white min-h-screen flex flex-col">
                    <header className="flex items-center px-4 h-[52px] border-b border-gray-200 flex-shrink-0">
                        <BackButton />
                        <h1 className="flex-1 text-center font-medium">게시물</h1>
                    </header>

                    {/* 스크롤 가능한 컨텐츠 */}
                    <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
                        <div className="p-4">
                            <FeedHeader
                                authorNickname={feed.authorNickname}
                                authorProfile={feed.authorProfile}
                                createdAt={feed.createdAt}
                                accountId={feed.accountId}
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
                                                onClick={handleDelete}
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
                                    <LikeAction
                                        count={feed.likesCount}
                                        isLiked={feed.isLiked}
                                        onToggle={handleLikeClick}
                                    />
                                    <CommentAction count={totalComments} onClick={handleComment} />
                                </div>
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

                        {/* 댓글 목록 */}
                        <div className="px-4 border-t border-gray-200">
                            {comments?.comments.map((comment) => (
                                <div key={comment.commentId} className="py-4 border-b border-gray-100">
                                    <FeedHeader
                                        authorNickname={comment.authorNickname}
                                        authorProfile={comment.authorProfile || tailogo}
                                        createdAt={comment.createdAt}
                                        accountId={comment.accountId}
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
