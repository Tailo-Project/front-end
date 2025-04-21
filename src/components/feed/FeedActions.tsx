import ActionButton from '../common/ActionButton';

interface FeedActionsProps {
    likesCount: number;
    commentsCount: number;
    onLike: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onComment: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onShare: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FeedActions = ({ likesCount, commentsCount, onLike, onComment, onShare }: FeedActionsProps) => (
    <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-4">
            <ActionButton
                icon={
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="img"
                        aria-label="좋아요"
                    >
                        <path
                            strokeLinecap="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                }
                count={likesCount}
                onClick={onLike}
            />
            <ActionButton
                icon={
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="img"
                        aria-label="댓글"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                }
                count={commentsCount}
                onClick={onComment}
            />
        </div>
        <ActionButton
            icon={
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                    aria-label="공유하기"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
            }
            onClick={onShare}
        />
    </div>
);

export default FeedActions;
