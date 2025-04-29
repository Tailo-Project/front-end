import { useEffect, useState } from 'react';
import { BASE_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import useDebounce from '@/hooks/useDebounce';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import defaultProfileImage from '@/assets/defaultImage.png';
import { formatTimeAgo } from '@/utils/date';
import { useNavigate } from 'react-router-dom';

interface FeedSearchProps {
    keyword: string;
}

interface FeedItem {
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

const FeedSearch = ({ keyword }: FeedSearchProps) => {
    const navigate = useNavigate();
    const [results, setResults] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const debouncedKeyword = useDebounce(keyword, 300);
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
        setHasNext(false);
        setError(null);
        setPage(0);
    }, [debouncedKeyword]);

    useEffect(() => {
        if (!debouncedKeyword) {
            setResults([]);
            setError(null);
            setHasNext(false);
            return;
        }
        const search = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchWithToken(
                    `${BASE_API_URL}/search/feeds?keyword=${debouncedKeyword}&page=${page}&size=${PAGE_SIZE}`,
                    { method: 'GET' },
                );
                if (!res.ok) throw new Error('피드 검색 실패');
                const { data } = await res.json();
                const newResults = data.feedSearchResponses || [];
                setResults((prev) => (page === 0 ? newResults : [...prev, ...newResults]));
                setHasNext(data.hasNext ?? false);
            } catch {
                setError('검색에 실패했습니다.');
                setResults([]);
                setHasNext(false);
            } finally {
                setLoading(false);
            }
        };
        search();
    }, [debouncedKeyword, page]);

    return (
        <div className="flex flex-col gap-2">
            {loading && page === 0 && <div className="text-gray-500">검색 중...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && results.length === 0 && debouncedKeyword && (
                <div className="text-gray-400">검색 결과가 없습니다.</div>
            )}
            {results.map((result) => (
                <div className="flex flex-col gap-2" key={result.feedPostId}>
                    <div
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                        onClick={() => navigate(`/feeds/${result.feedPostId}`)}
                    >
                        <div className="flex items-center gap-2">
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
                </div>
            ))}
            {results.length > 0 && (
                <div
                    ref={bottomRef}
                    className="h-20 w-full flex items-center justify-center"
                    style={{ minHeight: '100px' }}
                >
                    {loading && page > 0 && <span className="text-gray-400">불러오는 중...</span>}
                    {!hasNext && !loading && <span className="text-gray-300">마지막 결과입니다.</span>}
                </div>
            )}
        </div>
    );
};

export default FeedSearch;
