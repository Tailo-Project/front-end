import { useEffect, useState } from 'react';
import TabBar from './TabBar';
import FeedItem from './FeedItem';
import { FeedPost } from '@/types/feed';
import AuthRequiredView from '@/components/common/AuthRequiredView';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ApiError } from '@/types/error';
import { useNavigate } from 'react-router-dom';
import { getToken } from '@/utils/auth';

const FeedList = () => {
    const [feeds, setFeeds] = useState<FeedPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeeds = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed?page=0&size=10`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                const data = await response.json();
                setFeeds(data.data.feedPosts);
            } catch (error) {
                const apiError = error as ApiError;
                setError(apiError);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeeds();
    }, []);

    if (error?.type === 'AUTH') {
        return <AuthRequiredView />;
    }

    if (error) {
        return (
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                <div className="text-center p-4">
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            navigate('/login');
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white pb-16 border border-gray-200">
                {feeds.map((feed) => (
                    <FeedItem key={feed.feedId} feed={feed} />
                ))}
            </div>
            <TabBar />
        </>
    );
};

export default FeedList;
