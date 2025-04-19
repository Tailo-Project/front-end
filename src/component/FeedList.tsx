import { useEffect, useRef, useCallback, useReducer } from 'react';
import TabBar from './TabBar';
import tailogo from '../assets/tailogo.svg';
import CommentBottomSheet from './CommentBottomSheet';
import { feedReducer, initialState, Feed } from '@/reducers/feedReducer';

interface FeedListProps {
    feeds?: Feed[];
}

// 임시 더미 데이터 생성 함수
const generateDummyFeeds = (count: number): Feed[] => {
    const authors = [
        { name: '멍멍이맘', profileImage: tailogo },
        { name: '냥이집사', profileImage: tailogo },
        { name: '토순이', profileImage: tailogo },
        { name: '햄찌맘', profileImage: tailogo },
    ];

    const titles = [
        '오늘의 산책',
        '간식 타임',
        '목욕 시간',
        '귀여운 우리 아이',
        '장난감 선물 받았어요',
        '첫 미용 다녀왔어요',
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: titles[Math.floor(Math.random() * titles.length)],
        content: `${i + 1}번째 게시물입니다. 오늘도 즐거운 하루 보내세요! 우리 아이와 함께하는 특별한 순간들을 공유합니다.`,
        author: authors[Math.floor(Math.random() * authors.length)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 30),
        images: Math.random() > 0.3 ? [tailogo] : undefined,
    }));
};

// 30개의 더미 데이터 생성
const dummyFeeds: Feed[] = generateDummyFeeds(30);

const FeedList = ({ feeds = dummyFeeds }: FeedListProps) => {
    const observerRef = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef(true);
    const [state, dispatch] = useReducer(feedReducer, initialState);
    const itemsPerPage = 5;

    const loadMoreFeeds = useCallback(() => {
        if (state.isLoading) return;

        dispatch({ type: 'LOAD_MORE_START' });
        const start = (state.page - 1) * itemsPerPage;
        const end = state.page * itemsPerPage;
        const newFeeds = feeds.slice(start, end);

        if (newFeeds.length > 0) {
            dispatch({ type: 'LOAD_MORE_SUCCESS', feeds: newFeeds });
        }
    }, [feeds, state.page, state.isLoading]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !state.isLoading) {
                    loadMoreFeeds();
                }
            },
            { threshold: 0.1 },
        );

        const currentRef = observerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [loadMoreFeeds, state.isLoading]);

    useEffect(() => {
        if (isInitialLoad.current) {
            loadMoreFeeds();
            isInitialLoad.current = false;
        }
    }, [loadMoreFeeds]);

    if (state.displayedFeeds.length === 0 && state.isLoading) {
        return (
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleLike = (feedId: number) => {
        dispatch({ type: 'TOGGLE_LIKE', feedId });
    };

    const handleCommentClick = (feedId: number) => {
        dispatch({ type: 'OPEN_COMMENTS', feedId });
    };

    const handleCloseComments = () => {
        dispatch({ type: 'CLOSE_COMMENTS' });
    };

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white pb-16 border border-gray-200">
                {state.displayedFeeds.map((feed) => (
                    <article key={feed.id} className="p-4 border-b border-gray-200">
                        {/* 작성자 정보 */}
                        <div className="flex items-center mb-3">
                            <img
                                src={feed.author.profileImage}
                                alt={feed.author.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <h3 className="font-semibold text-gray-900">{feed.author.name}</h3>
                                <p className="text-sm text-gray-500">{feed.createdAt}</p>
                            </div>
                        </div>

                        {/* 피드 내용 */}
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">{feed.title}</h2>
                            <p className="text-gray-700">{feed.content}</p>
                        </div>

                        {/* 이미지가 있는 경우 */}
                        {feed.images && feed.images.length > 0 && (
                            <div className="mb-4">
                                <div className="grid gap-2">
                                    {feed.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`피드 이미지 ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 좋아요, 댓글 카운트 */}
                        <div className="flex items-center text-gray-500 text-sm">
                            <button
                                onClick={() => handleLike(feed.id)}
                                className={`flex items-center mr-4 ${state.likedFeeds[feed.id] ? 'text-red-500' : ''}`}
                            >
                                {state.likedFeeds[feed.id] ? (
                                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                )}
                                {feed.likes}
                            </button>
                            <button className="flex items-center mr-4" onClick={() => handleCommentClick(feed.id)}>
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                {feed.comments}
                            </button>
                            <button className="flex items-center ml-auto">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </article>
                ))}

                {/* Intersection Observer 타겟 */}
                <div ref={observerRef} className="h-10" />
            </div>
            <TabBar />
            {state.isCommentSheetOpen && state.selectedFeedId && (
                <CommentBottomSheet
                    isOpen={state.isCommentSheetOpen}
                    feedId={state.selectedFeedId}
                    onClose={handleCloseComments}
                />
            )}
        </>
    );
};

export default FeedList;
