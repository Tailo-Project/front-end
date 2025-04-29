import { useEffect, useState } from 'react';
import { BASE_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import useDebounce from '@/hooks/useDebounce';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import defaultProfileImage from '@/assets/defaultImage.png';
import { useNavigate } from 'react-router-dom';

interface MemberSearchProps {
    keyword: string;
}

interface MemberItem {
    accountId: string;
    nickname: string;
    profileImageUrl: string;
    isFollowing: boolean;
}

const PAGE_SIZE = 10;

const MemberSearch = ({ keyword }: MemberSearchProps) => {
    const navigate = useNavigate();
    const [results, setResults] = useState<MemberItem[]>([]);
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
                    `${BASE_API_URL}/search/members?keyword=${debouncedKeyword}&page=${page}&size=${PAGE_SIZE}`,
                    { method: 'GET' },
                );
                if (!res.ok) throw new Error('사용자 검색 실패');
                const { data } = await res.json();
                const newResults = data.memberSearchResponses || [];
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
            {results.map((user) => (
                <div
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    key={user.accountId}
                    onClick={() => navigate(`/profile/${user.accountId}`)}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200">
                        <img
                            src={user.profileImageUrl || defaultProfileImage}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-base">{user.nickname}</div>
                        <div className="text-xs text-gray-500">@{user.accountId}</div>
                    </div>
                    {user.isFollowing && <span className="text-xs text-blue-500">팔로잉</span>}
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

export default MemberSearch;
