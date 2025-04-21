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

const FeedDetailPage = () => {
    const { feedId } = useParams<{ feedId: string }>();
    const navigate = useNavigate();
    const [feed, setFeed] = useState<FeedPost | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        const fetchFeedDetail = async () => {
            if (!feedId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchApi<FeedPost>(`/api/feed/${feedId}`);
                setFeed(response);
            } catch (error) {
                const apiError = error as ApiError;
                setError(apiError);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedDetail();
    }, [feedId]);

    const handleLike = (e: React.MouseEvent) => {
        console.log(e, 'like');
        e.stopPropagation();
        // 좋아요 기능 구현
    };

    const handleComment = (e: React.MouseEvent) => {
        console.log(e, 'comment');
        e.stopPropagation();
        // 댓글 기능 구현
    };

    const handleShare = (e: React.MouseEvent) => {
        console.log(e, 'share');
        e.stopPropagation();
        // 공유 기능 구현
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 추가 메뉴 기능 구현
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

    if (!feed) {
        return (
            <Layout>
                <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">피드를 찾을 수 없습니다.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-white min-h-screen">
                <header className="flex items-center px-4 h-[52px] border-b border-gray-200">
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
                <div className="overflow-y-auto pb-16">
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
                        <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
                        <FeedActions
                            likesCount={feed.likesCount}
                            commentsCount={feed.commentsCount}
                            onLike={handleLike}
                            onComment={handleComment}
                            onShare={handleShare}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FeedDetailPage;
