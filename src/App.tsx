import { Routes, Route, Navigate } from 'react-router-dom';

import FeedDetailPage from '@/ui/pages/FeedDetailPage';

import FeedList from '@/components/features/feed/FeedList';
import Login from '@/components/features/auth/Login';
import SignUpForm from '@/components/features/auth/SignUpForm';
import Profile from '@/components/features/profile/Profile';
import EditProfile from '@/components/features/profile/EditProfile';
import KakaoCallback from '@/components/features/auth/KakaoCallback';
import WritePost from '@/components/features/feed/WritePost';
import DMInbox from '@/components/features/dm/DMInbox';
import FriendList from '@/components/features/profile/FriendList';
import NotificationList from '@/components/features/notification/NotificationList';

import ProtectedRoute from '@/components/common/ProtectedRoute';

import '@/App.css';

import { ToastProvider } from '@/ui/components/common/ToastProvider';
import SseListener from '@/ui/components/common/SseListener';
import FeedSearch from './components/features/feed/search/FeedSearch';
import Room from './components/features/dm/Room';

function App() {
    return (
        <ToastProvider>
            <SseListener />
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
                            <FeedSearch />
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
                    path="/dm/:roomId"
                    element={
                        <ProtectedRoute>
                            <Room />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notification"
                    element={
                        <ProtectedRoute>
                            <NotificationList />
                        </ProtectedRoute>
                    }
                />

                {/* <Route
                    path="/profile/following"
                    element={
                        <ProtectedRoute>
                            <FollowingList />
                        </ProtectedRoute>
                    }
                /> */}
                <Route
                    path="/profile/friends"
                    element={
                        <ProtectedRoute>
                            <FriendList />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </ToastProvider>
    );
}

export default App;
