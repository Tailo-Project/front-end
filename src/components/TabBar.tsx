import { useNavigate, useLocation } from 'react-router-dom';

const TabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        {
            name: '홈',
            path: '/feeds',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            name: '검색',
            path: '/search',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            ),
        },
        {
            name: '글쓰기',
            path: '/write',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            ),
        },
        {
            name: '채팅',
            path: '/profile/dm',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            ),
        },
        {
            name: '프로필',
            path: '/profile',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto fixed bottom-0 left-0 right-0 flex justify-center bg-white border-t border-gray-200">
            <div className="w-full flex justify-between items-center px-4 py-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.path}
                        className={`flex flex-col items-center p-2 ${
                            location.pathname === tab.path ? 'text-[#FF785D]' : 'text-gray-500'
                        }`}
                        onClick={() => navigate(tab.path)}
                    >
                        {tab.icon}
                        <span className="text-xs mt-1">{tab.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabBar;
