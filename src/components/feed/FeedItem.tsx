import { useNavigate } from 'react-router-dom';
import FeedActions from '@/components/feed/FeedActions';
import FeedHeader from '@/components/feed/FeedHeader';
import { FeedPost } from '@/types/feed';
import FeedImages from '@/components/feed/FeedImages';

interface FeedItemProps {
    feed: FeedPost;
}

const FeedItem = ({ feed }: FeedItemProps) => {
    const navigate = useNavigate();

    const handleFeedClick = () => {
        navigate(`/feeds/${feed.feedId}`);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 좋아요 기능 구현
    };

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/feeds/${feed.feedId}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 공유 기능 구현
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 추가 메뉴 기능 구현
    };

    return (
        <article className="p-4 border-b border-gray-200 cursor-pointer">
            <FeedHeader
                authorNickname={feed.authorNickname}
                authorProfile={feed.authorProfile}
                createdAt={feed.createdAt}
                onMoreClick={handleMoreClick}
            />
            <div onClick={handleFeedClick} className="mb-4">
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
