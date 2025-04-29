import { BASE_API_URL } from '@/constants/apiUrl';
import Layout from '@/layouts/layout';
import { fetchWithToken } from '@/token';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

import defaultProfileImage from '@/assets/defaultImage.png';
import { formatTimeAgo } from '@/utils/date';

interface FeedSearchProps {
    feedPostId: number;
    accountId: string;
    nickname: string;
    profileImageUrl: string;
    content: string;
    hashtags: string[];
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
    isFollowing: boolean;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
}

const PAGE_SIZE = 10;

const FeedSearch = () => {
    const [feedSearchKeyword, setFeedSearchKeyword] = useState('');
    const [results, setResults] = useState<FeedSearchProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const debouncedKeyword = useDebounce(feedSearchKeyword, 300);
    const { bottomRef } = useInfiniteScroll({
        loadMoreFunc: () => {
            if (!loading && hasNext) setPage((prev) => prev + 1);
        },
        shouldLoadMore: hasNext && !loading,
        threshold: 0.5,
        rootMargin: '0px',
    });

    useEffect(() => {
        setResults([]);
        setPage(1);
        setHasNext(false);
        setError(null);
    }, [debouncedKeyword]);

    useEffect(() => {
        if (!debouncedKeyword) {
            setResults([]);
            setError(null);
            setHasNext(false);
            return;
        }

        const searchFeed = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchWithToken(
                    `${BASE_API_URL}/search/feeds?keyword=${debouncedKeyword}&page=${page}&size=${PAGE_SIZE}`,
                    {
                        method: 'GET',
                    },
                );
                if (!res.ok) throw new Error('검색 실패');
                const { data } = await res.json();
                const newResults = data.feedSearchResponses || [];
                setResults((prev) => (page === 1 ? newResults : [...prev, ...newResults]));
                setHasNext(data.hasNext ?? false);
            } catch {
                setError('검색에 실패했습니다.');
                setResults([]);
                setHasNext(false);
            } finally {
                setLoading(false);
            }
        };
        searchFeed();
    }, [debouncedKeyword, page]);

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen p-0">
                <h2 className="text-xl font-bold px-4 pt-6 pb-2">검색</h2>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-base focus:outline-blue-400"
                    placeholder="검색어를 입력하세요"
                    value={feedSearchKeyword}
                    onChange={(e) => setFeedSearchKeyword(e.target.value)}
                    aria-label="피드 검색"
                />
                <div className="px-4 pt-4">
                    {loading && page === 1 && <div className="text-gray-500">검색 중...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {!loading && !error && results.length === 0 && debouncedKeyword && (
                        <div className="text-gray-400">검색 결과가 없습니다.</div>
                    )}
                    <div className="flex flex-col gap-2 ">
                        {results.map((result) => (
                            <div className="flex flex-col gap-2 " key={result.feedPostId}>
                                <div className="flex items-center gap-2 ">
                                    <div className="w-10 h-10 rounded-full bg-gray-200">
                                        <img
                                            src={result.profileImageUrl || defaultProfileImage}
                                            alt="프로필 이미지"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-sm">{result.nickname}</div>
                                    <div className="text-sm">{formatTimeAgo(result.createdAt)}</div>
                                </div>
                                <div className="text-sm">{result.content}</div>
                                <img
                                    src={result.imageUrls[0] || defaultProfileImage}
                                    alt="피드 이미지"
                                    className="w-full h-full object-cover"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="text-sm">{result.likesCount} 좋아요</div>
                                    <div className="text-sm">{result.commentsCount} 댓글</div>
                                </div>
                            </div>
                        ))}
                        {results.length > 0 && (
                            <div
                                ref={bottomRef}
                                className="h-20 w-full flex items-center justify-center"
                                style={{ minHeight: '100px' }}
                            >
                                {loading && page > 1 && <span className="text-gray-400">불러오는 중...</span>}
                                {!hasNext && !loading && <span className="text-gray-300">마지막 결과입니다.</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FeedSearch;
