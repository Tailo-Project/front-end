import ActionButton from '../../ActionButton';
import { CommentProps } from './types';

const CommentAction = ({ count, onClick }: CommentProps) => (
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
        count={count}
        onClick={onClick}
    />
);

export default CommentAction;
