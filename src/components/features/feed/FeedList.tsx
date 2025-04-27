import LoadingSpinner from '../../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import FeedItem from '@/components/features/feed/FeedItem';
import TabBar from '../../TabBar';
import useFeeds from '@/hooks/useFeeds';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const FeedList = () => {
    const navigate = useNavigate();
    const { data, isLoading, error, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeeds();

    const { bottomRef } = useInfiniteScroll({
        loadMoreFunc: fetchNextPage,
        shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
        threshold: 0.5,
        rootMargin: '0px',
    });

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

    const allFeedPosts =
        data?.pages
            .flatMap((page) => page.feedPosts)
            .filter((feed, index, self) => index === self.findIndex((f) => f.feedId === feed.feedId)) ?? [];

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white pb-16 border border-gray-200">
                {allFeedPosts.length === 0 ? (
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
                    <>
                        {allFeedPosts.map((feed) => (
                            <FeedItem key={feed.feedId} feed={feed} />
                        ))}
                        <div
                            ref={bottomRef}
                            className="h-20 w-full flex items-center justify-center"
                            style={{ minHeight: '100px' }}
                        >
                            {isFetchingNextPage && <LoadingSpinner />}
                        </div>
                    </>
                )}
            </div>
            <TabBar />
        </>
    );
};

export default FeedList;
