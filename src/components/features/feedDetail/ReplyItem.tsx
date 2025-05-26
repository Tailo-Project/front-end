import FeedHeader from '@/components/features/feed/FeedHeader';
import tailogo from '@/assets/tailogo.svg';
import { CommentsResponse } from '@/types';

interface ReplyItemProps {
    reply: CommentsResponse['comments'][number]['replies']['replies'][number];
    onDelete: (commentId: number) => void;
}

const ReplyItem = ({ reply, onDelete }: ReplyItemProps) => (
    <div
        className="ml-4 md:ml-8 mt-3 py-3 px-3 border-t border-gray-50 bg-gray-50 rounded-lg"
        style={{ maxWidth: 'calc(100% - 2rem)' }}
    >
        <FeedHeader
            authorNickname={reply.authorNickname}
            authorProfile={reply.authorProfile || tailogo}
            createdAt={reply.createdAt}
            accountId={reply.accountId}
        />
        <div className="flex items-center justify-between mt-2 ml-[52px]">
            <p className="text-xs text-gray-700 mb-1">{reply.content}</p>
            <button onClick={() => onDelete(reply.commentId)} className="text-xs text-red-500 hover:text-red-600 ml-2">
                삭제
            </button>
        </div>
    </div>
);

export default ReplyItem;
