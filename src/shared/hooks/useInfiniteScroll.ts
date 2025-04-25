import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
    loadMoreFunc: () => void; // useInfiniteQuery의 fetchNextPage
    shouldLoadMore: boolean; // useInfiniteQuery의 hasNextPage
    threshold?: number; // Intersection Observer의 threshold 값
    rootMargin?: string;
}

export const useInfiniteScroll = ({
    loadMoreFunc,
    shouldLoadMore,
    threshold = 1,
    rootMargin = '0px',
}: UseInfiniteScrollProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [inView, setInView] = useState(false);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            setInView(entry.isIntersecting);

            if (entry.isIntersecting && shouldLoadMore) {
                loadMoreFunc();
            }
        },
        [loadMoreFunc, shouldLoadMore],
    );

    useEffect(() => {
        if (bottomRef.current && !observerRef.current) {
            observerRef.current = new IntersectionObserver(handleObserver, {
                threshold,
                rootMargin,
            });
            observerRef.current.observe(bottomRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [handleObserver, threshold, rootMargin]);

    return { bottomRef, inView };
};
