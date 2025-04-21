import { useState } from 'react';
import { FeedPost } from '../../types/feed';
import FeedHeader from './FeedHeader';
import FeedImages from './FeedImages';
import FeedActions from './FeedActions';
import { getToken } from '@/utils/auth';

interface FeedItemProps {
    feed: FeedPost;
}

const FeedItem = ({ feed }: FeedItemProps) => {
    const [isDetailView, setIsDetailView] = useState(false);
    const [detailFeed, setDetailFeed] = useState<FeedPost | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFeedClick = async () => {
        setIsDetailView(true);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feed.feedId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('피드를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setDetailFeed(data.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // 좋아요 기능 구현
    };

    const handleComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // 댓글 기능 구현
    };

    const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // 공유 기능 구현
    };

    const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // 추가 메뉴 기능 구현
    };

    if (isDetailView) {
        if (isLoading) {
            return (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                    <div className="p-4 text-center">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => setIsDetailView(false)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            );
        }

        if (detailFeed) {
            return (
                <div className="fixed inset-0 bg-white flex flex-col z-50">
                    <header className="p-4 border-b flex items-center bg-red-500">
                        <button onClick={() => setIsDetailView(false)} aria-label="닫기" type="button">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </header>
                    {/* 상세 보기 UI는 별도 컴포넌트로 분리 예정 */}
                </div>
            );
        }
    }

    return (
        <article className="p-4 border-b border-gray-200 cursor-pointer" onClick={handleFeedClick}>
            <FeedHeader
                authorNickname={feed.authorNickname}
                authorProfile={feed.authorProfile}
                createdAt={feed.createdAt}
                onMoreClick={handleMoreClick}
            />
            <div className="mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{feed.content}</p>
            </div>
            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
            <FeedActions
                likesCount={feed.likesCount}
                commentsCount={feed.commentsCount}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
            />
        </article>
    );
};

export default FeedItem;
