import { useNavigate } from 'react-router-dom';
import { FeedPost } from '@/shared/types/feed';
import FeedHeader from './FeedHeader';
import FeedImages from './FeedImages';
import FeedActions from './FeedActions';

interface FeedItemProps {
    feed: FeedPost;
}

const FeedItem = ({ feed }: FeedItemProps) => {
    const navigate = useNavigate();

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 추가 메뉴 기능 구현
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/${feed.feedId}/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('좋아요 처리에 실패했습니다.');
            }
            // TODO: 좋아요 상태 업데이트
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 공유 기능 구현
    };

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/feeds/${feed.feedId}`);
    };

    return (
        <article
            className="border-b border-gray-200 p-4 cursor-pointer"
            onClick={() => navigate(`/feeds/${feed.feedId}`)}
        >
            <FeedHeader
                authorNickname={feed.authorNickname}
                authorProfile={feed.authorProfile}
                createdAt={feed.createdAt}
                onMoreClick={handleMoreClick}
            />
            <div className="mt-4 mb-6">
                <p className="text-gray-800 text-[15px] leading-[22px] whitespace-pre-wrap">{feed.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {feed.hashtags.map((hashtag) => (
                    <div key={hashtag}>#{hashtag}</div>
                ))}
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
