import { FC } from 'react';
import FeedHeader from '@/components/features/feed/FeedHeader';
import tailogo from '@/assets/tailogo.svg';
import { CommentsResponse } from '@/types';
import ReplyItem from './ReplyItem';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

interface CommentItemProps {
    comment: CommentsResponse['comments'][number];
    userProfile: UserProfile | null;
    onReply: (commentId: number) => void;
    onDelete: (commentId: number) => void;
}

const CommentItem: FC<CommentItemProps> = ({ comment, userProfile, onReply, onDelete }) => (
    <div className="py-4 border-b border-gray-100">
        <FeedHeader
            authorNickname={comment.authorNickname}
            authorProfile={comment.authorProfile || tailogo}
            createdAt={comment.createdAt}
            accountId={comment.accountId}
            rightElement={
                comment.authorNickname === userProfile?.nickname ? (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(comment.commentId);
                            }}
                            className="text-xs text-red-500 hover:text-red-600 ml-2"
                        >
                            삭제
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-gray-500 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                )
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

export default CommentItem;
