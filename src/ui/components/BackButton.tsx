import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate('/feeds')} className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
            </svg>
        </button>
    );
};

export default BackButton;
