interface ActionButtonProps {
    icon: React.ReactNode;
    count?: number;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isLiked?: boolean;
}

const ActionButton = ({ icon, count, onClick, isLiked }: ActionButtonProps) => (
    <button className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : ''}`} onClick={onClick}>
        {icon}
        {count !== undefined && <span className="text-sm">{count}</span>}
    </button>
);

export default ActionButton;
