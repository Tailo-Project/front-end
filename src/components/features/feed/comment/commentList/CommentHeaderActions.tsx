import { MouseEvent } from 'react';

interface CommentHeaderActionsProps {
    isOwner: boolean;
    createdAt: string;
    onDelete: (e: MouseEvent<HTMLButtonElement>) => void;
}

const CommentHeaderActions = ({ isOwner, createdAt, onDelete }: CommentHeaderActionsProps) => {
    if (isOwner) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</span>
                <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-600 ml-2">
                    삭제
                </button>
            </div>
        );
    }

    return <span className="text-xs text-gray-500 ml-2">{new Date(createdAt).toLocaleString()}</span>;
};

export default CommentHeaderActions;
