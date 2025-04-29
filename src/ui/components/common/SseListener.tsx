import { useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

import { useToast } from './ToastProvider';
import { getToken } from '@/utils/auth';

const MAX_RETRY_COUNT = 5;
let retryCount = 0;
let hasFailed = false;

const SseListener = () => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
    const token = getToken();
    const { showToast } = useToast();

    useEffect(() => {
        if (!token) return;

        const connectSSE = () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            eventSourceRef.current = new EventSourcePolyfill(`${import.meta.env.VITE_API_URL}/api/notify/subscribe`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            eventSourceRef.current.addEventListener('sse', (event) => {
                const data = (event as MessageEvent).data;
                if (typeof data === 'string' && data.trim().startsWith('[accountId]:') && data.includes('connected.')) {
                    resetTimeout();
                    return;
                }
                if (typeof data === 'string' && data.trim().startsWith('{')) {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.message) {
                            showToast(parsed.message);
                        }
                    } catch (e) {
                        showToast(data);
                        console.error('알림 파싱 오류', e, data);
                    }
                } else {
                    showToast(data);
                }
                resetTimeout();
            });

            eventSourceRef.current.onerror = () => {
                eventSourceRef?.current?.close();
                if (timeoutRef.current !== null) {
                    clearTimeout(timeoutRef.current);
                }
                if (retryCount < MAX_RETRY_COUNT) {
                    retryCount++;
                    timeoutRef.current = setTimeout(() => connectSSE(), 5000);
                } else if (!hasFailed) {
                    hasFailed = true;
                    showToast('SSE 연결 실패');
                }
            };

            resetTimeout();
        };

        const resetTimeout = () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                eventSourceRef.current?.close();
                connectSSE();
            }, 35000);
        };

        connectSSE();

        return () => {
            eventSourceRef.current?.close();
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
            hasFailed = false;
            retryCount = 0;
        };
    }, [token, showToast]);

    return null;
};

export default SseListener;
