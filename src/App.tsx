import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUpForm from './components/SignUpForm';

import KakaoCallback from './components/KakaoCallback';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/oauth/kakao" element={<KakaoCallback />} />
        </Routes>
    );
}

export default App;
