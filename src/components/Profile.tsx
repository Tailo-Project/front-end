import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from './TabBar';
import tailogo from '../assets/tailogo.svg';

interface ProfileStats {
    posts: number;
    followers: number;
    following: number;
}

const Profile = () => {
    const navigate = useNavigate();
    const [stats] = useState<ProfileStats>({
        posts: 25,
        followers: 128,
        following: 84,
    });

    // 임시 게시물 데이터
    const [posts] = useState([
        { id: 1, imageUrl: tailogo },
        { id: 2, imageUrl: tailogo },
        { id: 3, imageUrl: tailogo },
        { id: 4, imageUrl: tailogo },
        { id: 5, imageUrl: tailogo },
        { id: 6, imageUrl: tailogo },
    ]);

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen pb-16">
                {/* 프로필 헤더 */}
                <header className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold">마이페이지</h1>
                        <button className="text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* 프로필 정보 */}
                    <div className="flex items-center mb-6">
                        <img src={tailogo} alt="프로필" className="w-20 h-20 rounded-full object-cover" />
                        <div className="ml-6">
                            <h2 className="text-lg font-semibold mb-1">멍멍이맘</h2>
                            <p className="text-gray-600 text-sm">반려동물과 함께하는 일상을 공유해요 🐶</p>
                        </div>
                    </div>

                    {/* 통계 */}
                    <div className="flex justify-around mb-6">
                        <div className="text-center">
                            <div className="font-semibold">{stats.posts}</div>
                            <div className="text-gray-500 text-sm">게시물</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">{stats.followers}</div>
                            <div className="text-gray-500 text-sm">팔로워</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">{stats.following}</div>
                            <div className="text-gray-500 text-sm">팔로잉</div>
                        </div>
                    </div>

                    {/* 프로필 수정 버튼 */}
                    <button
                        onClick={() => navigate('/profile/edit')}
                        className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium"
                    >
                        프로필 수정
                    </button>
                </header>

                {/* 게시물 그리드 */}
                <div className="grid grid-cols-3 gap-0.5">
                    {posts.map((post) => (
                        <div key={post.id} className="aspect-square">
                            <img src={post.imageUrl} alt={`게시물 ${post.id}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
            <TabBar />
        </>
    );
};

export default Profile;
