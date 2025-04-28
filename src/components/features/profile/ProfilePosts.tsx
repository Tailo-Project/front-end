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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 p-2">
            {memberFeed.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-8 text-gray-400 text-sm">
                    등록된 이미지 게시물이 없습니다
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
