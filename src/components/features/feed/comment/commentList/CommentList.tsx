import { CommentsResponse, UserProfile } from '@/types';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: CommentsResponse['comments'];
    userProfile: UserProfile | null;
    onReply: (commentId: number) => void;
    onDelete: (commentId: number) => void;
}

const CommentList = ({ comments, userProfile, onReply, onDelete }: CommentListProps) => (
    <div className="px-4 border-t border-gray-200">
        {comments.map((comment) => (
            <CommentItem
                key={comment.commentId}
                comment={comment}
                userProfile={userProfile}
                onReply={onReply}
                onDelete={onDelete}
            />
        ))}
    </div>
);

export default CommentList;
