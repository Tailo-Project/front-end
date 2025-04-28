import { useNavigate } from 'react-router-dom';
import { FeedPost } from '@/types';
import FeedHeader from './FeedHeader';
import FeedImages from './FeedImages';
import HashtagList from './HashtagList';
import LikeAction from './like/LikeAction';
import CommentAction from './comment/CommentAction';

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
            className="bg-white rounded-2xl shadow-lg mb-8 px-5 py-6 cursor-pointer transition hover:shadow-xl"
            onClick={() => navigate(`/feeds/${feed.feedId}`)}
        >
            <FeedHeader
                authorNickname={feed.authorNickname}
                authorProfile={feed.authorProfile}
                createdAt={feed.createdAt}
                accountId={feed.accountId}
            />
            <div className="mt-4 mb-4">
                <p className="text-gray-800 text-base leading-[22px] whitespace-pre-wrap mb-2">{feed.content}</p>
                <HashtagList hashtags={feed.hashtags} className="mb-2 text-sm" />
            </div>

            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />

            <div className="flex items-center gap-4 mt-4">
                <LikeAction feedId={feed.feedId} count={feed.likesCount} isLiked={feed.liked} />
                <CommentAction count={feed.commentsCount} onClick={handleCommentClick} />
            </div>
        </article>
    );
};

export default FeedItem;
