import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

import App from '@/App';
import '@/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';

const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
        updateSW(true);
    },
    onOfflineReady() {
        console.log('앱이 오프라인에서도 사용할 수 있습니다.');
    },
    onRegistered(r) {
        if (r) {
            setInterval(
                () => {
                    r.update();
                },
                60 * 60 * 1000,
            );
        }
    },
    onRegisterError(error: Error) {
        console.error('서비스 워커 등록 실패:', error);
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // 실패 시 1번만 재시도
            staleTime: 10 * 1000, // 10초 동안 데이터를 fresh 상태로 유지
            gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
        },
        mutations: {
            retry: 1, // 실패 시 1번만 재시도
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
