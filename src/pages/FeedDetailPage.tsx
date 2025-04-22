import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../component/layout';
import FeedHeader from '@/components/feed/FeedHeader';
import FeedImages from '@/components/feed/FeedImages';
import FeedActions from '@/components/feed/FeedActions';
import { FeedPost } from '@/types/feed';
import { fetchApi } from '@/utils/api';
import { ApiError } from '@/types/error';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AuthRequiredView from '@/components/common/AuthRequiredView';
import tailogo from '../assets/tailogo.svg';
import { getToken } from '@/utils/auth';

interface Comment {
    commentId: number;
    content: string;
    authorNickname: string;
    authorProfile: string;
    createdAt: string;
    // replies: {
    //     replies: Comment[];
    //     totalCount: number;
    // };
}

const FeedDetailPage = () => {
    const { feedId } = useParams<{ feedId: string }>();
    const navigate = useNavigate();
    const [feed, setFeed] = useState<FeedPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [replyToId, setReplyToId] = useState<number | null>(null);

    // 피드 상세 정보 조회
    useEffect(() => {
        const fetchFeedDetail = async () => {
            if (!feedId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchApi<FeedPost>(`/api/feed/${feedId}`);
                setFeed(response);
                // 피드 조회 후 댓글 목록도 함께 조회
                const commentsResponse = await fetchApi<{ comments: Comment[] }>(`/api/feed/${feedId}/comments`);
                setComments(commentsResponse.comments);
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
        await fetchApi<FeedPost>(`/api/feed/${feedId}/likes`);
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

        if (!newComment.trim() || isSubmitting || !feedId) return;

        try {
            setIsSubmitting(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}/comments`, {
                method: 'POST',
                body: JSON.stringify({
                    parentId: replyToId,
                    content: newComment.trim(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            const result = await response.json();

            if (result.statusCode === 201) {
                // 새로운 댓글을 목록 맨 앞에 추가
                const newCommentObj: Comment = {
                    commentId: Date.now(),
                    content: newComment.trim(),
                    authorNickname: feed?.authorNickname || '',
                    authorProfile: typeof feed?.authorProfile === 'string' ? feed.authorProfile : '',
                    createdAt: new Date().toISOString(),
                };

                setComments((prevComments) => [newCommentObj, ...prevComments]);

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
            }
        } catch (error) {
            console.error('댓글 등록 실패:', error);
        } finally {
            setIsSubmitting(false);
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

            if (response.ok) {
                // 댓글 목록에서 삭제
                setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
                // 댓글 수 감소
                if (feed) {
                    setFeed({
                        ...feed,
                        commentsCount: feed.commentsCount - 1,
                    });
                }
            }
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
        }
    };

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

    if (error) {
        return (
            <Layout>
                <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center p-4">
                        <p className="text-gray-600 mb-4">{error.message}</p>
                        <button
                            onClick={() => setError(null)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-white min-h-screen flex flex-col">
                <header className="flex items-center px-4 h-[52px] border-b border-gray-200 flex-shrink-0">
                    <button onClick={() => navigate('/feeds')} className="p-2 -ml-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                    <h1 className="flex-1 text-center font-medium">게시물</h1>
                    <button className="p-2 -mr-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
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
                        <div className="mt-4 mb-6">
                            <p className="text-gray-800 text-[15px] leading-[22px] whitespace-pre-wrap">
                                {feed.content}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {feed.hashtags.map((hashtag) => (
                                <div key={hashtag}>#{hashtag}</div>
                            ))}
                        </div>
                        <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
                        <FeedActions
                            likesCount={feed.likesCount}
                            commentsCount={comments.length}
                            onLike={handleLike}
                            onComment={handleComment}
                            onShare={handleShare}
                        />
                    </div>

                    <div className="flex-shrink-0 bg-white border-t border-gray-200 p-2">
                        <form onSubmit={handleCommentSubmit}>
                            {replyToId && (
                                <div className="flex justify-between items-center mb-2 px-4 py-2 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-600">답글 작성 중</span>
                                    <button
                                        type="button"
                                        onClick={handleCancelReply}
                                        className="text-xs text-gray-500 hover:text-red-500"
                                    >
                                        취소
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={replyToId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium
                                         hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? '등록 중...' : '게시'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="px-4 border-t border-gray-200">
                        {comments &&
                            comments.map((comment) => (
                                <div key={comment.commentId} className="py-4 border-b border-gray-100">
                                    <div className="flex items-start">
                                        <img
                                            src={comment.authorProfile || tailogo}
                                            alt="프로필"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-sm">{comment.authorNickname}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
                                                    {comment.authorNickname === feed?.authorNickname && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                                className="text-xs text-red-500 hover:text-red-600"
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                            <button
                                                onClick={() => handleReply(comment.commentId)}
                                                className="text-xs text-gray-500 mt-2 hover:text-blue-500"
                                            >
                                                답글 달기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FeedDetailPage;
