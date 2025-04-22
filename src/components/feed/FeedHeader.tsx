import { useEffect, useState } from 'react';
import tailLogo from '../../assets/tailogo.svg';
import { useNavigate } from 'react-router-dom';

interface FeedHeaderProps {
    authorNickname: string;
    authorProfile: string | File;
    createdAt: string;
    onMoreClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FeedHeader = ({ authorNickname, authorProfile, createdAt, onMoreClick }: FeedHeaderProps) => {
    const navigate = useNavigate();
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const getProfileUrl = (profile: string | File): string => {
        if (profile instanceof File) {
            if (!objectUrl) {
                setObjectUrl(URL.createObjectURL(profile));
            }
            return objectUrl || '';
        }
        return profile;
    };

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    const handleProfileClick = () => {
        // console.log('profile clicked');
        navigate(`/profile`);
    };

    return (
        <div className="flex items-center mb-4">
            <img
                onClick={handleProfileClick}
                src={authorProfile ? getProfileUrl(authorProfile) : tailLogo}
                alt={authorNickname}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
            />
            <div className="ml-3">
                <h3 className="font-semibold text-gray-900">{authorNickname}</h3>
                <time className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</time>
            </div>
            <button className="ml-auto p-2" onClick={onMoreClick} aria-label="더보기" type="button">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
            </button>
        </div>
    );
};

export default FeedHeader;
