import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/defaultImage.png';
import { formatTimeAgo } from '@/utils/date';

interface FeedHeaderProps {
    authorNickname: string;
    authorProfile: string | null;
    createdAt: string;
    accountId: string;
    rightElement?: React.ReactNode;
}

const FeedHeader = ({ authorNickname, authorProfile, createdAt, accountId, rightElement }: FeedHeaderProps) => {
    const navigate = useNavigate();

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        if (!accountId) {
            console.warn('프로필을 볼 수 없습니다: accountId가 없습니다.');
            return;
        }
        navigate('/profile', { state: { accountId } });
    };

    return (
        <div className="flex items-center">
            <div
                className={`flex items-center ${accountId ? 'cursor-pointer' : ''}`}
                onClick={accountId ? handleProfileClick : undefined}
            >
                <img
                    src={authorProfile || defaultProfileImage}
                    alt={`${authorNickname}의 프로필`}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                    <span className={`text-lg font-bold ${accountId ? 'hover:underline' : ''}`}>{authorNickname}</span>
                    <p className="text-gray-500 text-sm">{formatTimeAgo(createdAt)}</p>
                </div>
            </div>
            {rightElement && <div className="ml-auto">{rightElement}</div>}
        </div>
    );
};

export default FeedHeader;
