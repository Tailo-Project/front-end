import LoadingSpinner from '../../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import FeedItem from '@/components/features/feed/FeedItem';
import TabBar from '../../TabBar';
import useFeeds from '@/hooks/useFeeds';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Layout from '@/layouts/layout';
import NotificationIcon from '../notification/NotificationIcon';

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
                        className="px-4 py-2 bg-[#FF785D] text-white rounded-lg hover:bg-[#FF785D]/80 transition-colors"
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
        <Layout>
            <div className="w-full max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto bg-red-700 pb-16 border border-gray-200">
                <header className="flex items-center px-4 h-[52px] border-b border-gray-200 flex-shrink-0">
                    <h1 className="flex-1 text-center font-medium">피드 리스트</h1>
                    <NotificationIcon />
                </header>
                {allFeedPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
                        <p className="text-gray-500 text-lg mb-2">아직 게시물이 없습니다</p>
                        <p className="text-gray-400 text-sm mb-4">첫 번째 게시물을 작성해보세요!</p>
                        <button
                            onClick={() => navigate('/write')}
                            className="px-6 py-2 bg-[#FF785D] text-white rounded-lg hover:bg-[#FF785D]/80 transition-colors"
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
        </Layout>
    );
};

export default FeedList;
