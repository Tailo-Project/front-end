import { BASE_API_URL } from '@/constants/apiUrl';
import Layout from '@/layouts/layout';
import { fetchWithToken } from '@/token';
import { formatTimeAgo } from '@/utils/date';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import useToast from '@/hooks/useToast';

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
    url: string;
    nickname?: string;
}

interface NotificationListResponse {
    notificationList: Notification[];
    pagination: Pagination;
}

type InfiniteNotificationData = {
    pages: NotificationListResponse[];
    pageParams: number[];
};

const PAGE_SIZE = 10;

const NotificationList = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<NotificationListResponse>({
        queryKey: ['notifications'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchWithToken(
                `${BASE_API_URL}/notify?page=${pageParam}&size=${PAGE_SIZE}&sort=createdAt,desc`,
                {
                    method: 'GET',
                },
            );
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
        initialPageParam: 0,
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

    const navigate = useNavigate();

    const markNotificationAsRead = async (id: string) => {
        const res = await fetchWithToken(`${BASE_API_URL}/notify/${id}/read`, {
            method: 'PATCH',
        });
        if (!res.ok) throw new Error('알림 읽기 실패');
        return res;
    };

    const updateNotificationCache = (id: string) => {
        queryClient.setQueryData(['notifications'], (oldData: InfiniteNotificationData) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    notificationList: page.notificationList.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
                })),
            };
        });
    };

    const handleNotificationNavigation = (url: string) => {
        const apiFeedMatch = url.match(/\/api\/feed\/(\d+)/);
        if (apiFeedMatch) {
            const feedId = apiFeedMatch[1];
            navigate(`/feeds/${feedId}`);
            return;
        }
        if (url.startsWith('http')) {
            window.location.href = url;
        } else {
            navigate(url);
        }
    };

    const handleNotificationClick = async (url: string, id: string) => {
        try {
            await markNotificationAsRead(id);
            updateNotificationCache(id);
            handleNotificationNavigation(url);
        } catch {
            showToast('알림 읽기 실패', 'error');
        }
    };

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen p-0">
                <h2 className="text-xl font-bold px-4 pt-6 pb-2">알림</h2>
                <div className="flex flex-col gap-0">
                    {allNotifications.map((notification) => (
                        <div
                            onClick={() => handleNotificationClick(notification.url, notification.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleNotificationClick(notification.url, notification.id);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`알림 클릭 ${notification.nickname ? `@${notification.nickname}` : ''}`}
                            key={notification.id}
                            className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition cursor-pointer active:bg-gray-100
                                ${!notification.isRead ? 'bg-orange-50' : 'bg-white'}`}
                        >
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold text-gray-900 truncate">
                                    {notification.nickname ? `@${notification.nickname}` : ''}
                                </span>
                                <span className="text-gray-800 ml-1 truncate">{notification.message}</span>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {formatTimeAgo(notification.createdAt)}
                                </div>
                            </div>

                            {!notification.isRead && <span className="w-2 h-2 bg-orange-400 rounded-full ml-2" />}
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
