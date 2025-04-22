interface ActionButtonProps {
    icon: React.ReactNode;
    count?: number;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ActionButton = ({ icon, count, onClick }: ActionButtonProps) => (
    <button className="flex items-center space-x-1" onClick={onClick}>
        {icon}
        {count !== undefined && <span className="text-sm">{count}</span>}
    </button>
);

export default ActionButton;
