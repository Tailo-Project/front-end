import tailLogo from '../assets/tailogo.svg';

export interface FeedPost {
    feedId: number;
    content: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
    likes: number;
    imageUrls?: string[];
    authorNickname: string;
    authorProfile: string | File;
    hashtags: string[];
}

interface FeedItemProps {
    feed: FeedPost;
}

const FeedItem = ({ feed }: FeedItemProps) => {
    const getProfileUrl = (profile: string | File): string => {
        if (profile instanceof File) {
            return URL.createObjectURL(profile);
        }
        return profile;
    };

    const profileUrl = feed.authorProfile ? getProfileUrl(feed.authorProfile) : tailLogo;

    return (
        <article className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-4">
                <img
                    src={profileUrl}
                    alt={feed.authorNickname}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                />
                <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{feed.authorNickname}</h3>
                    <time className="text-sm text-gray-500">{new Date(feed.createdAt).toLocaleDateString()}</time>
                </div>
                <button className="ml-auto p-2">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>

            <div className="mb-4">
                <img src={feed.imageUrls?.[0]} alt={feed.content} className="w-full h-40 object-cover rounded-lg" />
                <p className="text-gray-800 whitespace-pre-wrap">{feed.content}</p>
            </div>

            {feed.imageUrls && feed.imageUrls.length > 0 && (
                <div className="mb-4">
                    <div
                        className={`grid gap-1 ${
                            feed.imageUrls?.length === 1
                                ? ''
                                : feed.imageUrls?.length === 2
                                  ? 'grid-cols-2'
                                  : feed.imageUrls?.length === 3
                                    ? 'grid-cols-3'
                                    : 'grid-cols-2 grid-rows-2'
                        }`}
                    >
                        {feed.imageUrls
                            ?.slice(0, 4)
                            .map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${feed.authorNickname}님의 이미지 ${index + 1}`}
                                    className={`w-full ${
                                        feed.imageUrls?.length === 1
                                            ? 'h-[280px]'
                                            : feed.imageUrls?.length === 2
                                              ? 'h-[200px]'
                                              : feed.imageUrls?.length === 3
                                                ? 'h-[120px]'
                                                : 'h-[140px]'
                                    } object-cover rounded-lg`}
                                    loading="lazy"
                                />
                            ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between text-gray-500">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span className="text-sm">{feed.likesCount}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="text-sm">{feed.commentsCount}</span>
                    </button>
                </div>
                <button className="flex items-center space-x-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                </button>
            </div>
        </article>
    );
};

export default FeedItem;
