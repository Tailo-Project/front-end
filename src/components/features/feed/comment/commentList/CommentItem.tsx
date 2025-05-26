import { MouseEvent } from 'react';
import FeedHeader from '@/components/features/feed/components/FeedHeader';
import tailogo from '@/assets/tailogo.svg';
import { CommentsResponse, UserProfile } from '@/types';
import ReplyItem from '../ReplyItem';
import CommentHeaderActions from './CommentHeaderActions';

interface CommentItemProps {
    comment: CommentsResponse['comments'][number];
    userProfile: UserProfile | null;
    onReply: (commentId: number) => void;
    onDelete: (commentId: number) => void;
}

const CommentItem = ({ comment, userProfile, onReply, onDelete }: CommentItemProps) => {
    const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(comment.commentId);
    };

    return (
        <div className="py-4 border-b border-gray-100">
            <FeedHeader
                authorNickname={comment.authorNickname}
                authorProfile={comment.authorProfile || tailogo}
                createdAt={comment.createdAt}
                accountId={comment.accountId}
                rightElement={
                    <CommentHeaderActions
                        isOwner={comment.authorNickname === userProfile?.nickname}
                        createdAt={comment.createdAt}
                        onDelete={handleDelete}
                    />
                }
            />
            <p className="text-sm text-gray-700 mt-2 ml-[52px] mb-1">{comment.content}</p>
            <button
                onClick={() => onReply(comment.commentId)}
                className="text-xs text-gray-500 hover:text-[#FF785D] ml-[52px] mb-2"
            >
                답글 달기
            </button>
            {comment.replies?.replies?.map((reply) => (
                <ReplyItem key={reply.commentId} reply={reply} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default CommentItem;
