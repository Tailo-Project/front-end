import { LikeProps } from '@/types';
import LikeButton from './LikeButton';

const LikeAction = ({ count, isLiked, onToggle }: LikeProps) => (
    <div className="flex items-center">
        <LikeButton count={count} isLiked={isLiked} onToggle={onToggle} />
    </div>
);

export default LikeAction;
