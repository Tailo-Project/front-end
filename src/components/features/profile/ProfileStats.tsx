import { useNavigate } from 'react-router-dom';

interface ProfileStatsProps {
    profileData: {
        data: {
            countFeed: number;
            countFollower: number;
            countFollowing: number;
            id?: string;
            isFollow?: boolean;
        };
    };
}

const ProfileStats = ({ profileData }: ProfileStatsProps) => {
    const navigate = useNavigate();
    const { countFeed = 0, countFollower = 0, countFollowing = 0 } = profileData.data ?? {};
    const handleFollowerClick = () => {
        navigate('/profile/friends', {
            state: { accountId: profileData.data.id, isFollow: profileData.data.isFollow, type: 'following' },
        });
    };
    const handleFollowingClick = () => {
        navigate('/profile/friends', {
            state: { accountId: profileData.data.id, isFollow: profileData.data.isFollow, type: 'followers' },
        });
    };
    return (
        <div className="flex justify-around mb-6">
            <div className="text-center">
                <div className="font-semibold">{countFeed}</div>
                <div className="text-gray-500 text-sm">게시물</div>
            </div>
            <div className="text-center">
                <div className="font-semibold">{countFollower}</div>
                <div onClick={handleFollowerClick} className="text-gray-500 text-sm cursor-pointer">
                    팔로워
                </div>
            </div>
            <div className="text-center">
                <div className="font-semibold">{countFollowing}</div>
                <div onClick={handleFollowingClick} className="text-gray-500 text-sm cursor-pointer">
                    팔로잉
                </div>
            </div>
        </div>
    );
};

export default ProfileStats;
