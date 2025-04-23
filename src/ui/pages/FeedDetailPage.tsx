import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FeedHeader from '@/ui/components/features/feed/FeedHeader';
import FeedImages from '@/ui/components/features/feed/FeedImages';
import { getToken } from '@/lib/token';
import { getAccountId } from '@/shared/utils/auth';

import tailogo from '@/assets/tailogo.svg';
import { CommentsResponse, FeedPost } from '@/shared/types/feed';
import { ApiError } from '@/shared/types/error';
import Layout from './layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthRequiredView from '../components/AuthRequiredView';
import BackButton from '../components/BackButton';
import FeedContent from '../components/features/feed/FeedContent';

import CommentInput from '../components/features/feed/CommentInput';
import LikeAction from '../components/features/feed/LikeAction';
import CommentAction from '../components/features/feed/CommentAction';
import ShareAction from '../components/features/feed/ShareAction';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

const FeedDetailPage = () => {
    const { feedId } = useParams<{ feedId: string }>();

    const [feed, setFeed] = useState<FeedPost | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<CommentsResponse | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // 현재 사용자 프로필 정보 조회
    useEffect(() => {
        const fetchUserProfile = async () => {
            const accountId = getAccountId();
            if (!accountId) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/member/profile/${accountId}`, {
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

    // 피드 상세 정보 조회
    useEffect(() => {
        const fetchFeedDetail = async () => {
            if (!feedId) return;

            setIsLoading(true);
            setError(null);

            try {
                const [feedResponse, likesResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}`, {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/likes`, {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }),
                ]);

                const [feedData, likesData] = await Promise.all([feedResponse.json(), likesResponse.json()]);

                setFeed(feedData.data);
                setIsLiked(likesData.message.isLiked);

                // 피드 조회 후 댓글 목록도 함께 조회
                const commentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/comments`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                const commentsData = await commentsResponse.json();
                setComments(commentsData.data);
            } catch (error) {
                const apiError = error as ApiError;
                setError(apiError);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedDetail();
    }, [feedId]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!feed) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/likes`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('좋아요 처리에 실패했습니다.');
            }

            // 낙관적 업데이트
            setIsLiked((prev) => !prev);
            setFeed((prev) =>
                prev
                    ? {
                          ...prev,
                          likesCount: prev.likesCount + (isLiked ? -1 : 1),
                      }
                    : null,
            );
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
            // 에러 발생 시 상태 롤백
            setIsLiked((prev) => !prev);
            setFeed((prev) =>
                prev
                    ? {
                          ...prev,
                          likesCount: prev.likesCount + (isLiked ? 1 : -1),
                      }
                    : null,
            );
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 공유 기능 구현
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 추가 메뉴 기능 구현
    };

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

            // 댓글 목록 새로 조회
            const commentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/comments`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            const commentsData = await commentsResponse.json();

            setComments(commentsData.data);

            // 피드의 댓글 수 업데이트
            if (feed) {
                setFeed({
                    ...feed,
                    commentsCount: feed.commentsCount + 1,
                });
            }

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

            // 댓글 목록에서 삭제
            setComments(
                comments
                    ? {
                          comments: comments.comments.filter((comment) => comment.commentId !== commentId),
                      }
                    : null,
            );

            // 댓글 수 감소
            if (feed) {
                setFeed({
                    ...feed,
                    commentsCount: feed.commentsCount - 1,
                });
            }
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.');
        }
    };

    const totalComments = comments
        ? comments.comments.reduce((acc, comment) => {
              const replyCount = comment.replies?.replies?.length || 0;
              const commentCount = 1;
              return acc + commentCount + replyCount;
          }, 0)
        : 0;

    if (isLoading) {
        return (
            <Layout>
                <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    if (error?.type === 'AUTH') {
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
                                onMoreClick={handleMoreClick}
                            />
                            <FeedContent feed={feed} />
                            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center space-x-4">
                                    <LikeAction count={feed.likesCount} isLiked={isLiked} onToggle={handleLike} />
                                    <CommentAction count={totalComments} onClick={handleComment} />
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

                        {/* 댓글 목록 */}
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
