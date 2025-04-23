import { MouseEvent, ReactNode } from 'react';

export interface ActionButtonProps {
    icon: ReactNode;
    count: number;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    isLiked?: boolean;
}

const ActionButton = ({ icon, count, onClick }: ActionButtonProps) => (
    <button onClick={onClick} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
        {icon}
        {count > 0 && <span className="text-sm">{count}</span>}
    </button>
);

export default ActionButton;
