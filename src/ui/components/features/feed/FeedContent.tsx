import { FeedPost } from '@/shared/types/feed';

const FeedContent = ({ feed }: { feed: FeedPost }) => {
    return (
        <div className="mt-4 mb-6">
            <p className="text-gray-800 text-[15px] leading-[22px] whitespace-pre-wrap">{feed.content}</p>
            <div className="flex flex-wrap gap-2 my-2">
                {feed.hashtags.map((hashtag) => (
                    <div key={hashtag}>#{hashtag}</div>
                ))}
            </div>
        </div>
    );
};

export default FeedContent;
