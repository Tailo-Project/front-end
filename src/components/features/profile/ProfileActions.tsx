import { useNavigate } from 'react-router-dom';

interface ProfileActionsProps {
    isMyProfile: boolean;
    isFollow: boolean;
    onFollow: () => void;
    accountId: string;
}

const ProfileActions = ({ isMyProfile, isFollow, onFollow, accountId }: ProfileActionsProps) => {
    const navigate = useNavigate();

    // 메시지 보내기 버튼 클릭 시 방 생성
    const handleMessageClick = async () => {
        try {
            navigate('/profile/dm', { state: { accountId } });
        } catch {
            alert('네트워크 오류가 발생했습니다.');
        }
    };
    const handleEditClick = () => {
        navigate('/profile/edit');
    };
    if (isMyProfile) {
        return (
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleEditClick}
                    className="w-full py-2 rounded-md text-sm font-medium hover:bg-[#FF785D]/80 transition-colors bg-[#FF785D] text-white"
                >
                    프로필 수정
                </button>
                <button
                    onClick={() => navigate('/profile/dm', { state: { accountId } })}
                    className="w-full py-2 rounded-md text-sm font-medium hover:bg-[#FF785D]/80 transition-colors bg-[#FF785D] text-white"
                >
                    DM 보관함
                </button>
            </div>
        );
    }
    return (
        <div className="flex justify-center gap-4">
            <button
                onClick={onFollow}
                className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                    isFollow
                        ? 'border border-gray-300 hover:bg-gray-50'
                        : 'bg-[#FF785D] text-white hover:bg-[#FF785D]/80'
                }`}
            >
                {isFollow ? '팔로잉' : '팔로우'}
            </button>
            <button
                onClick={handleMessageClick}
                className="w-full py-2 rounded-md text-sm font-medium hover:bg-[#FF785D]/80 transition-colors bg-[#FF785D] text-white"
            >
                메시지 보내기
            </button>
        </div>
    );
};

export default ProfileActions;
