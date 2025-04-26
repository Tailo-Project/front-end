interface ProfileStatsProps {
    profileData: {
        data: {
            countFeed: number;
            countFollower: number;
            countFollowing: number;
        };
    };
}

const ProfileStats = ({ profileData }: ProfileStatsProps) => {
    const { countFeed, countFollower, countFollowing } = profileData.data;
    return (
        <div className="flex justify-around mb-6">
            <div className="text-center">
                <div className="font-semibold">{countFeed}</div>
                <div className="text-gray-500 text-sm">게시물</div>
            </div>
            <div className="text-center">
                <div className="font-semibold">{countFollower}</div>
                <div className="text-gray-500 text-sm">팔로워</div>
            </div>
            <div className="text-center">
                <div className="font-semibold">{countFollowing}</div>
                <div className="text-gray-500 text-sm">팔로잉</div>
            </div>
        </div>
    );
};

export default ProfileStats;
