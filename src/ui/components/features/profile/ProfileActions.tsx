interface ProfileActionsProps {
    isMyProfile: boolean;
    isFollow: boolean;
    onEdit: () => void;
    onDM: () => void;
    onFollow: () => void;
}

const ProfileActions = ({ isMyProfile, isFollow, onEdit, onDM, onFollow }: ProfileActionsProps) => {
    if (isMyProfile) {
        return (
            <div className="flex justify-center gap-4">
                <button
                    onClick={onEdit}
                    className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors bg-blue-500 text-white"
                >
                    프로필 수정
                </button>
                <button
                    onClick={onDM}
                    className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors bg-blue-500 text-white"
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
                    isFollow ? 'border border-gray-300 hover:bg-gray-50' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
                {isFollow ? '팔로잉' : '팔로우'}
            </button>
        </div>
    );
};

export default ProfileActions;
