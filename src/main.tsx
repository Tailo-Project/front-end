import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

// PWA 서비스 워커 등록
const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
        if (confirm('새로운 버전이 있습니다. 업데이트하시겠습니까?')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log('앱이 오프라인에서도 사용할 수 있습니다.');
    },
    onRegistered(r) {
        console.log('서비스 워커가 등록되었습니다.');
        if (r) {
            setInterval(
                () => {
                    r.update();
                },
                60 * 60 * 1000,
            ); // 1시간마다 업데이트 체크
        }
    },
    onRegisterError(error) {
        console.error('서비스 워커 등록 실패:', error);
    },
});

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    // </StrictMode>,
);
