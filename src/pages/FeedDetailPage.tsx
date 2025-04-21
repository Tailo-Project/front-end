import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/component/layout';
import FeedHeader from '@/components/feed/FeedHeader';
import FeedImages from '@/components/feed/FeedImages';
import FeedActions from '@/components/feed/FeedActions';
import { FeedPost } from '@/types/feed';
import { getToken } from '@/utils/auth';

const FeedDetailPage = () => {
    const { feedId } = useParams();
    const navigate = useNavigate();
    const [feed, setFeed] = useState<FeedPost | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedDetail = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feedId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('피드를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setFeed(data.data);
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        if (feedId) {
            fetchFeedDetail();
        }
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
                <div className="fixed inset-0 bg-white flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="fixed inset-0 bg-white flex items-center justify-center">
                    <div className="p-4 text-center">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => navigate('/feeds')}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            피드 목록으로
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!feed) {
        return null;
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
