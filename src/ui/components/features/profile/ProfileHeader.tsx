import defaultProfileImage from '@/assets/defaultImage.png';

interface ProfileHeaderProps {
    profileImageUrl?: string;
    nickname: string;
    id: string;
}

const ProfileHeader = ({ profileImageUrl, nickname, id }: ProfileHeaderProps) => (
    <div className="flex items-center mb-6">
        <img
            src={profileImageUrl || defaultProfileImage}
            alt="프로필"
            className="w-20 h-20 rounded-full object-cover"
        />
        <div className="ml-6">
            <h2 className="text-lg font-semibold mb-1">{nickname}</h2>
            <h3 className="text-gray-600 text-sm">{id}</h3>
        </div>
    </div>
);

export default ProfileHeader;
