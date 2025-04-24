import { MouseEvent } from 'react';

export interface LikeProps {
    count: number;
    isLiked: boolean;
    onToggle: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface CommentProps {
    count: number;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface ShareProps {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}
