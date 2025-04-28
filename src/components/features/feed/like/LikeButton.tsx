import ActionButton from '@/components/ActionButton';
import useFeedLike from '@/hooks/useFeedLike';

interface LikeButtonProps {
    feedId: number;
    count: number;
    isLiked: boolean;
}

const LikeButton = ({ feedId, count, isLiked }: LikeButtonProps) => {
    const { handleLike } = useFeedLike(feedId);

    return (
        <ActionButton
            icon={
                <svg
                    className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`}
                    fill={isLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            }
            count={count}
            onClick={handleLike}
        />
    );
};

export default LikeButton;
