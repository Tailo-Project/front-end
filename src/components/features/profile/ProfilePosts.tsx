interface Post {
    id: number;
    imageUrl: string;
}

interface ProfilePostsProps {
    posts: Post[];
}

const ProfilePosts = ({ posts }: ProfilePostsProps) => (
    <div className="flex flex-col gap-4">
        {posts.map((post) => (
            <div key={post.id} className="w-full h-40 bg-gray-100 rounded-md"></div>
        ))}
    </div>
);

export default ProfilePosts;
