import { useEffect, useState } from 'react';
import TabBar from './TabBar';
import FeedItem from './FeedItem';
import { FeedPost } from '@/types/feed';
import { getToken } from '@/utils/auth';

const LoadingSpinner = () => (
    <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
    </div>
);

const FeedList = () => {
    const [feeds, setFeeds] = useState<FeedPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeeds = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed?page=0&size=10`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('피드를 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                const feedPosts = data.data.feedPosts;
                setFeeds(feedPosts);
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('로그인이 필요합니다.');
            return;
        }

        fetchFeeds();
    }, []);

    if (error) {
        return (
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center p-4">
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
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
