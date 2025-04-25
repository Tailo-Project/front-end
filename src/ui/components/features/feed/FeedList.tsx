import LoadingSpinner from '../../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import FeedItem from '@/ui/components/features/feed/FeedItem';
import TabBar from '../../ui/TabBar';
import { useFeeds } from '@/shared/hooks/useFeeds';

const FeedList = () => {
    const navigate = useNavigate();
    const { data, isLoading, error, isError } = useFeeds();

    if (isError) {
        return (
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                <div className="text-center p-4">
                    <p className="text-gray-600 mb-4">
                        {error instanceof Error ? error.message : '오류가 발생했습니다.'}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
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
                {!data?.feedPosts || data.feedPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
                        <p className="text-gray-500 text-lg mb-2">아직 게시물이 없습니다</p>
                        <p className="text-gray-400 text-sm mb-4">첫 번째 게시물을 작성해보세요!</p>
                        <button
                            onClick={() => navigate('/write')}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            글쓰기
                        </button>
                    </div>
                ) : (
                    data.feedPosts.map((feed) => <FeedItem key={feed.feedId} feed={feed} />)
                )}
            </div>
            <TabBar />
        </>
    );
};

export default FeedList;
