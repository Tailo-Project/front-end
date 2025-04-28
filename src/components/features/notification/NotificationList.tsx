import { BASE_API_URL } from '@/constants/apiUrl';
import Layout from '@/layouts/layout';
import { fetchWithToken } from '@/token';
import { formatTimeAgo } from '@/utils/date';
import { useInfiniteQuery } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Pagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

interface Notification {
    id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

interface NotificationListResponse {
    notificationList: Notification[];
    pagination: Pagination;
}

const PAGE_SIZE = 10;

const NotificationList = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<NotificationListResponse>({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchWithToken(`${BASE_API_URL}/notify?page=${pageParam}&size=${PAGE_SIZE}`, {
                method: 'GET',
            });
            const result = await response.json();
            if (!result.data || !Array.isArray(result.data.notificationList)) {
                return {
                    notificationList: [],
                    pagination: {
                        currentPage: 1,
                        pageSize: PAGE_SIZE,
                        totalPages: 1,
                        totalItems: 0,
                    },
                };
            }
            return result.data;
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });

    const { bottomRef } = useInfiniteScroll({
        loadMoreFunc: fetchNextPage,
        shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
        threshold: 0.5,
        rootMargin: '0px',
    });

    const allNotifications = data?.pages.flatMap((page) => page.notificationList) ?? [];

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen p-4">
                <h2 className="text-xl font-semibold mb-4">알림</h2>
                <div className="flex flex-col gap-4">
                    {allNotifications.map((notification) => (
                        <div
                            className="flex justify-center items-center bg-gray-100 p-2 rounded-md"
                            key={notification.id}
                        >
                            <div className="flex justify-center gap-2 w-full">
                                <div className="text-md font-semibold">{notification.message}</div>
                                <div className="text-md text-gray-500">{formatTimeAgo(notification.createdAt)}</div>
                            </div>
                        </div>
                    ))}
                    <div
                        ref={bottomRef}
                        className="h-20 w-full flex items-center justify-center"
                        style={{ minHeight: '100px' }}
                    >
                        {isFetchingNextPage && <LoadingSpinner />}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotificationList;
