const ReplyInput = ({ replyToId, onCancelReply }: { replyToId: number | null; onCancelReply: () => void }) => {
    return (
        <>
            {replyToId && (
                <div className="flex justify-between items-center mb-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">답글 작성 중</span>
                    <button type="button" onClick={onCancelReply} className="text-xs text-gray-500 hover:text-red-500">
                        취소
                    </button>
                </div>
            )}
        </>
    );
};

export default ReplyInput;
