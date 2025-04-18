import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './component/Login';
import SignUpForm from './component/SignUpForm';
import KakaoCallback from './component/KakaoCallback';
import FeedList from './component/FeedList';
import WritePost from './component/WritePost';
import Profile from './component/Profile';
import EditProfile from './component/EditProfile';

function App() {
    const location = useLocation();
    const email = location.state?.email;

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpForm email={email} />} />
            <Route path="/oauth/kakao" element={<KakaoCallback />} />
            <Route path="/feeds" element={<FeedList />} />
            <Route path="/search" element={<div className="p-4">검색 페이지 (준비중)</div>} />
            <Route path="/write" element={<WritePost />} />
            <Route path="/chat" element={<div className="p-4">채팅 페이지 (준비중)</div>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/" element={<FeedList />} />
        </Routes>
    );
}

export default App;
