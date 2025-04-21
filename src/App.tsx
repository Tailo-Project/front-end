import './App.css';
import { Routes, Route } from 'react-router-dom';
import FeedList from './component/FeedList';
import Login from './component/Login';
import SignUpForm from './component/SignUpForm';
import Profile from './component/Profile';
import EditProfile from './component/EditProfile';
import KakaoCallback from './component/KakaoCallback';
import WritePost from './component/WritePost';
import ProtectedRoute from './components/ProtectedRoute';
import FeedDetailPage from '@/pages/FeedDetailPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<FeedList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/oauth/kakao" element={<KakaoCallback />} />
            <Route
                path="/feeds"
                element={
                    <ProtectedRoute>
                        <FeedList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/feeds/:feedId"
                element={
                    <ProtectedRoute>
                        <FeedDetailPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/search"
                element={
                    <ProtectedRoute>
                        <div className="p-4">검색 페이지 (준비중)</div>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/write"
                element={
                    <ProtectedRoute>
                        <WritePost />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <div className="p-4">채팅 페이지 (준비중)</div>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/edit"
                element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
