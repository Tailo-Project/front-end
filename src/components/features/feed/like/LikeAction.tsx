import LikeButton from './LikeButton';

interface LikeActionProps {
    feedId: number;
    count: number;
    isLiked: boolean;
}

const LikeAction = ({ feedId, count, isLiked }: LikeActionProps) => (
    <div className="flex items-center">
        <LikeButton feedId={feedId} count={count} isLiked={isLiked} />
    </div>
);

export default LikeAction;
