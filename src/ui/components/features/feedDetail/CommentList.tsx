import FeedHeader from '@/ui/components/features/feed/FeedHeader';
import tailogo from '@/assets/tailogo.svg';
import { CommentsResponse } from '@/shared/types/feed';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

interface CommentListProps {
    comments: CommentsResponse['comments'];
    userProfile: UserProfile | null;
    onReply: (commentId: number) => void;
    onDelete: (commentId: number) => void;
}

const CommentList = ({ comments, userProfile, onReply, onDelete }: CommentListProps) => {
    return (
        <div className="px-4 border-t border-gray-200">
            {comments.map((comment) => (
                <div key={comment.commentId} className="py-4 border-b border-gray-100">
                    <FeedHeader
                        authorNickname={comment.authorNickname}
                        authorProfile={comment.authorProfile || tailogo}
                        createdAt={comment.createdAt}
                        accountId={comment.accountId}
                        rightElement={
                            comment.authorNickname === userProfile?.nickname ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onDelete(comment.commentId);
                                        }}
                                        className="text-xs text-red-500 hover:text-red-600"
                                    >
                                        삭제
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                            )
                        }
                    />
                    <p className="text-sm text-gray-700 mt-1 ml-[52px]">{comment.content}</p>
                    <button
                        onClick={() => onReply(comment.commentId)}
                        className="text-xs text-gray-500 mt-2 ml-[52px] hover:text-blue-500"
                    >
                        답글 달기
                    </button>
                    {comment.replies?.replies?.map((reply) => (
                        <div
                            key={reply.commentId}
                            className="ml-8 mt-3 py-3 border-t border-gray-50 bg-gray-50 rounded-md w-80 px-2"
                        >
                            <FeedHeader
                                authorNickname={reply.authorNickname}
                                authorProfile={reply.authorProfile || tailogo}
                                createdAt={reply.createdAt}
                                accountId={reply.accountId}
                            />
                            <p className="text-xs text-gray-700 mt-1 ml-[52px]">{reply.content}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CommentList;
