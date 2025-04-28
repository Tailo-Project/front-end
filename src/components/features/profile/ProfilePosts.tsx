import defaultProfileImage from '@/assets/defaultImage.png';

interface MemberFeed {
    feedId: number;
    imageUrl: string;
    createdAt?: string;
}

interface ProfilePostsProps {
    onImageClick: (feedId: number) => void;
    memberFeed: MemberFeed[];
}

const ProfilePosts = ({ onImageClick, memberFeed }: ProfilePostsProps) => {
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 p-2 min-h-[200px]">
            {memberFeed.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="w-16 h-16 mb-3 rounded-full bg-gray-100 flex items-center justify-center text-3xl select-none">
                        🖼️
                    </div>
                    <span className="text-base font-medium">등록된 이미지 게시물이 없습니다</span>
                    <span className="text-xs mt-1 text-gray-300">이미지를 업로드해 나만의 피드를 만들어보세요!</span>
                </div>
            ) : (
                memberFeed.map((image) => (
                    <img
                        key={image.feedId}
                        src={image.imageUrl || defaultProfileImage}
                        alt={image.imageUrl ? '피드 이미지' : '이미지 없음'}
                        className="w-full aspect-square object-cover cursor-pointer rounded bg-gray-100"
                        onClick={() => onImageClick(image.feedId)}
                    />
                ))
            )}
        </div>
    );
};

export default ProfilePosts;
