import { useNavigate } from 'react-router-dom';
import { FeedPost } from '@/shared/types/feed';
import FeedHeader from './FeedHeader';
import FeedImages from './FeedImages';
import LikeButton from './LikeButton';
import CommentAction from './CommentAction';
import { useFeedLike } from '@/shared/hooks/useFeedLike';
import HashtagList from './HashtagList';

interface FeedItemProps {
    feed: FeedPost;
}

const FeedItem = ({ feed }: FeedItemProps) => {
    const navigate = useNavigate();
    const { handleLike } = useFeedLike(feed.feedId);

    const handleCommentClick = (e: React.MouseEvent) => {
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
                accountId={feed.accountId}
            />
            <div className="mt-4 mb-6">
                <p className="text-gray-800 text-[15px] leading-[22px] whitespace-pre-wrap">{feed.content}</p>
                <HashtagList hashtags={feed.hashtags} className="mt-2" />
            </div>

            <div className="flex flex-wrap gap-2">
                <LikeButton count={feed.likesCount} isLiked={feed.isLiked} onToggle={handleLike} />
                <CommentAction count={feed.commentsCount} onClick={handleCommentClick} />
            </div>

            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
        </article>
    );
};

export default FeedItem;
