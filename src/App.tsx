import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import SignUpForm from './components/SignUpForm';
import KakaoCallback from './components/KakaoCallback';

function App() {
    const location = useLocation();
    const email = location.state?.email;

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpForm email={email} />} />
            <Route path="/oauth/kakao" element={<KakaoCallback />} />
        </Routes>
    );
}

export default App;
