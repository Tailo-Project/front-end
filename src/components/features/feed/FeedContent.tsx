import { FeedPost } from '@/shared/types/feed';
import HashtagList from './HashtagList';

const FeedContent = ({ feed }: { feed: FeedPost }) => {
    return (
        <div className="mt-4 mb-6">
            <p className="text-gray-800 text-[15px] leading-[22px] whitespace-pre-wrap">{feed.content}</p>
            <HashtagList hashtags={feed.hashtags} className="my-2" />
        </div>
    );
};

export default FeedContent;
