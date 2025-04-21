import tailLogo from '../../assets/tailogo.svg';

interface FeedHeaderProps {
    authorNickname: string;
    authorProfile: string | File;
    createdAt: string;
    onMoreClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FeedHeader = ({ authorNickname, authorProfile, createdAt, onMoreClick }: FeedHeaderProps) => {
    const getProfileUrl = (profile: string | File): string => {
        if (profile instanceof File) {
            return URL.createObjectURL(profile);
        }
        return profile;
    };

    return (
        <div className="flex items-center mb-4">
            <img
                src={authorProfile ? getProfileUrl(authorProfile) : tailLogo}
                alt={authorNickname}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
            />
            <div className="ml-3">
                <h3 className="font-semibold text-gray-900">{authorNickname}</h3>
                <time className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</time>
            </div>
            <button className="ml-auto p-2" onClick={onMoreClick}>
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </button>
        </div>
    );
};

export default FeedHeader;
