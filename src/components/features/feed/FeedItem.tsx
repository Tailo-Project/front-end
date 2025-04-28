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
            className="bg-white rounded-lg shadow-md mb-6 px-4 py-4 cursor-pointer transition hover:shadow-lg"
            onClick={() => navigate(`/feeds/${feed.feedId}`)}
        >
            <FeedHeader
                authorNickname={feed.authorNickname}
                authorProfile={feed.authorProfile}
                createdAt={feed.createdAt}
                accountId={feed.accountId}
            />
            <div className="mt-3 mb-3">
                <p className="text-gray-800 text-[15px] leading-[22px] whitespace-pre-wrap mb-2">{feed.content}</p>
                <HashtagList hashtags={feed.hashtags} className="mb-2" />
            </div>

            <div className="flex items-center gap-4 mb-3">
                <LikeAction feedId={feed.feedId} count={feed.likesCount} isLiked={feed.liked} />
                <CommentAction count={feed.commentsCount} onClick={handleCommentClick} />
            </div>

            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
        </article>
    );
};

export default FeedItem;
