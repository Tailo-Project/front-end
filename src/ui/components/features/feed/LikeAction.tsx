import LikeButton from './LikeButton';
import { LikeProps } from './types';

const LikeAction = ({ count, isLiked, onToggle }: LikeProps) => (
    <div className="flex items-center">
        <LikeButton count={count} isLiked={isLiked} onToggle={onToggle} />
    </div>
);

export default LikeAction;
