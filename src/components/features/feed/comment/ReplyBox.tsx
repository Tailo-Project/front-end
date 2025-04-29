import { Comment } from '@/types';

const ReplyBox = ({ comment }: { comment: Comment }) => {
    return (
        <>
            {comment.replies?.totalCount ? (
                <div className="flex flex-col gap-2 w-full rounded-md mt-2 bg-gray-300 p-2">
                    {comment.replies.replies.map((reply) => (
                        <div className="flex items-center gap-2" key={reply.commentId}>
                            <p>{reply.content}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    );
};

export default ReplyBox;
