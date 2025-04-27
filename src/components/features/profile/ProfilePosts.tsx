import defaultProfileImage from '@/assets/defaultImage.png';

interface Post {
    id: number;
    imageUrl: string;
}

interface ProfilePostsProps {
    posts: Post[];
    onImageClick: (feedId: number) => void;
}

const ProfilePosts = ({ posts, onImageClick }: ProfilePostsProps) => (
    <div className="grid grid-cols-3 gap-1 p-2">
        {posts.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-8 text-gray-400 text-sm">
                등록된 이미지 게시물이 없습니다
            </div>
        ) : (
            posts.map((post) => (
                <img
                    key={post.id}
                    src={post.imageUrl || defaultProfileImage}
                    alt={post.imageUrl ? '피드 이미지' : '이미지 없음'}
                    className="w-full h-24 object-cover cursor-pointer rounded bg-gray-100"
                    onClick={() => onImageClick(post.id)}
                />
            ))
        )}
    </div>
);

export default ProfilePosts;
