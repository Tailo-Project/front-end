import { MouseEvent, ReactNode } from 'react';

export interface ActionButtonProps {
    icon: ReactNode;
    count?: number;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}

const ActionButton = ({ icon, count, onClick, disabled }: ActionButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1 text-gray-500 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'
        }`}
        disabled={disabled}
    >
        {icon}
        {<span className="text-sm">{count}</span>}
    </button>
);

export default ActionButton;
