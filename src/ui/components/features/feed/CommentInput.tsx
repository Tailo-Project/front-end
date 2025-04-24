import React from 'react';
import ReplyInput from './ReplyInput';

interface CommentInputProps {
    newComment: string;
    onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    replyToId: number | null;
    onCancelReply: () => void;
}

const CommentInput = ({
    newComment,
    onCommentChange,
    onCommentSubmit,
    isSubmitting,
    replyToId,
    onCancelReply,
}: CommentInputProps) => {
    return (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-2">
            <form onSubmit={onCommentSubmit}>
                <ReplyInput replyToId={replyToId} onCancelReply={onCancelReply} />
                <div className="flex items-center">
                    <input
                        type="text"
                        value={newComment}
                        onChange={onCommentChange}
                        placeholder={replyToId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium
								 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? '등록 중...' : '게시'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentInput;
