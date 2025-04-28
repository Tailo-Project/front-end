import React, { useState } from 'react';
import { formatTimeAgo } from '@/utils/date';

interface DMMessage {
    id: string;
    sender: {
        id: string;
        nickname: string;
        profileImage: string;
    };
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
}

const DMInbox: React.FC = () => {
    // 임시 데이터
    const [messages] = useState<DMMessage[]>([
        {
            id: '1',
            sender: {
                id: '1',
                nickname: '김태일러',
                profileImage: 'https://via.placeholder.com/40',
            },
            lastMessage: '안녕하세요! 옷 사이즈 문의드립니다.',
            timestamp: new Date(),
            unreadCount: 2,
        },
        {
            id: '2',
            sender: {
                id: '2',
                nickname: '이스타일',
                profileImage: 'https://via.placeholder.com/40',
            },
            lastMessage: '네, 말씀해주세요.',
            timestamp: new Date(Date.now() - 86400000), // 1일 전
            unreadCount: 0,
        },
    ]);

    return (
        <div className="max-w-screen-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">DM 보관함</h1>
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <img
                            src={message.sender.profileImage}
                            alt={message.sender.nickname}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold">{message.sender.nickname}</span>
                                <span className="text-sm text-gray-500">
                                    {formatTimeAgo(message.timestamp.toISOString())}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{message.lastMessage}</p>
                        </div>
                        {message.unreadCount > 0 && (
                            <div className="bg-[#FF785D] text-white text-xs px-2 py-1 rounded-full">
                                {message.unreadCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DMInbox;
