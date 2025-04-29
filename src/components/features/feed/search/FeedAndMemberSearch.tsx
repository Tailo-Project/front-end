import { BASE_API_URL } from '@/constants/apiUrl';
import Layout from '@/layouts/layout';
import { fetchWithToken } from '@/token';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

import defaultProfileImage from '@/assets/defaultImage.png';
import { formatTimeAgo } from '@/utils/date';
import { useNavigate } from 'react-router-dom';

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

interface MemberSearchProps {
    accountId: string;
    nickname: string;
    profileImageUrl: string;
    isFollowing: boolean;
}

const PAGE_SIZE = 10;

type SearchType = 'feed' | 'member';

const FeedAndMemberSearch = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState<SearchType>('feed');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [feedResults, setFeedResults] = useState<FeedSearchProps[]>([]);
    const [memberResults, setMemberResults] = useState<MemberSearchProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const debouncedKeyword = useDebounce(searchKeyword, 300);
    const { bottomRef } = useInfiniteScroll({
        loadMoreFunc: () => {
            if (!loading && hasNext) setPage((prev) => prev + 1);
        },
        shouldLoadMore: hasNext && !loading,
        threshold: 0.5,
        rootMargin: '0px',
    });

    // 검색어 변경 시 결과 초기화
    useEffect(() => {
        setFeedResults([]);
        setMemberResults([]);
        setHasNext(false);
        setError(null);
        setPage(0);
    }, [debouncedKeyword, searchType]);

    // 검색 API 호출
    useEffect(() => {
        if (!debouncedKeyword) {
            setFeedResults([]);
            setMemberResults([]);
            setError(null);
            setHasNext(false);
            return;
        }

        const search = async () => {
            setLoading(true);
            setError(null);
            try {
                if (searchType === 'feed') {
                    const res = await fetchWithToken(
                        `${BASE_API_URL}/search/feeds?keyword=${debouncedKeyword}&page=${page}&size=${PAGE_SIZE}`,
                        {
                            method: 'GET',
                        },
                    );
                    if (!res.ok) throw new Error('피드 검색 실패');
                    const { data } = await res.json();
                    const newResults = data.feedSearchResponses || [];
                    setFeedResults((prev) => (page === 1 ? newResults : [...prev, ...newResults]));
                    setHasNext(data.hasNext ?? false);
                } else {
                    // 사용자 검색
                    const res = await fetchWithToken(
                        `${BASE_API_URL}/search/members?keyword=${debouncedKeyword}&page=${page}&size=${PAGE_SIZE}`,
                        {
                            method: 'GET',
                        },
                    );
                    if (!res.ok) throw new Error('사용자 검색 실패');
                    const { data } = await res.json();
                    const newResults = data.memberSearchResponses || [];
                    setMemberResults((prev) => (page === 1 ? newResults : [...prev, ...newResults]));
                    setHasNext(data.hasNext ?? false);
                }
            } catch {
                setError('검색에 실패했습니다.');
                setFeedResults([]);
                setMemberResults([]);
                setHasNext(false);
            } finally {
                setLoading(false);
            }
        };
        search();
    }, [debouncedKeyword, page, searchType]);

    // 탭 변경 시 페이지 초기화
    const handleTabChange = (type: SearchType) => {
        setSearchType(type);
        setPage(0);
    };

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen p-0">
                <h2 className="text-xl font-bold px-4 pt-6 pb-2">통합 검색</h2>
                <div className="flex px-4 gap-2 mb-2">
                    <button
                        className={`flex-1 py-2 rounded-md ${searchType === 'feed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handleTabChange('feed')}
                        aria-selected={searchType === 'feed'}
                    >
                        피드
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md ${searchType === 'member' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handleTabChange('member')}
                        aria-selected={searchType === 'member'}
                    >
                        사용자
                    </button>
                </div>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-base focus:outline-blue-400"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    aria-label="통합 검색"
                />
                <div className="px-4 pt-4">
                    {loading && page === 1 && <div className="text-gray-500">검색 중...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {!loading &&
                        !error &&
                        ((searchType === 'feed' && feedResults.length === 0) ||
                            (searchType === 'member' && memberResults.length === 0)) &&
                        debouncedKeyword && <div className="text-gray-400">검색 결과가 없습니다.</div>}

                    <div className="flex flex-col gap-2">
                        {searchType === 'feed' &&
                            feedResults.map((result) => (
                                <div className="flex flex-col gap-2" key={result.feedPostId}>
                                    <div
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                        onClick={() => {
                                            navigate(`/feed/${result.feedPostId}`);
                                        }}
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
                        {searchType === 'member' &&
                            memberResults.map((user) => (
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
                        {(searchType === 'feed' ? feedResults.length > 0 : memberResults.length > 0) && (
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

export default FeedAndMemberSearch;
