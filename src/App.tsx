// External dependencies
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import FeedDetailPage from '@/ui/pages/FeedDetailPage';

// Features
import FeedList from '@/ui/components/features/feed/FeedList';
import Login from '@/ui/components/features/auth/Login';
import SignUpForm from '@/ui/components/features/auth/SignUpForm';
import Profile from '@/ui/components/features/profile/Profile';
import EditProfile from '@/ui/components/features/profile/EditProfile';
import KakaoCallback from '@/ui/components/features/auth/KakaoCallback';
import WritePost from '@/ui/components/features/feed/WritePost';
import DMInbox from '@/ui/components/features/dm/DMInbox';
import FriendList from '@/ui/components/features/profile/FriendList';

// Common components
import ProtectedRoute from '@/ui/components/common/ProtectedRoute';

// Styles
import '@/App.css';

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Navigate to="/feeds" replace />
                    </ProtectedRoute>
                }
            />
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
            <Route
                path="/profile/dm"
                element={
                    <ProtectedRoute>
                        <DMInbox />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/friends"
                element={
                    <ProtectedRoute>
                        <FriendList />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
