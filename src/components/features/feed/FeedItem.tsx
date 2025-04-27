import { useNavigate } from 'react-router-dom';
import { FeedPost } from '@/types';
import FeedHeader from './FeedHeader';
import FeedImages from './FeedImages';
import LikeAction from './LikeAction';
import CommentAction from './CommentAction';
import HashtagList from './HashtagList';

interface FeedItemProps {
    feed: FeedPost;
}

const FeedItem = ({ feed }: FeedItemProps) => {
    const navigate = useNavigate();

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
                <LikeAction feedId={feed.feedId} count={feed.likesCount} isLiked={feed.liked} />
                <CommentAction count={feed.commentsCount} onClick={handleCommentClick} />
            </div>

            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
        </article>
    );
};

export default FeedItem;
