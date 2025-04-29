import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import Layout from '@/layouts/layout';

interface ChatRoom {
    countMember: number;
    members: {
        accountId: string;
        memberId: number;
        profileImageUrl: string;
    }[];
    roomId: string;
    roomName: string;
}

const DMInbox = () => {
    const location = useLocation();
    const { accountId } = location.state;

    const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDMInbox = async () => {
            try {
                const response = await fetchWithToken(
                    `${BASE_API_URL}/chat/room?accountIds=${encodeURIComponent(accountId)}`,
                    {
                        method: 'POST',
                    },
                );
                const data = await response.json();
                setChatRoom(Array.isArray(data.data) ? data.data : [data.data]);
            } catch (error) {
                console.error('DM 채팅방 가져오기 실패:', error);
            }
        };
        fetchDMInbox();
    }, [accountId]);

    return (
        <Layout>
            <div className="max-w-screen-md mx-auto p-4">
                <h1 className="text-xl font-bold mb-4">DM 보관함</h1>
                <div className="flex flex-col gap-4">
                    {chatRoom.map((room) => (
                        <button
                            onClick={() => {
                                navigate(`/dm/${room.roomId}`, { state: { roomId: room.roomId } });
                            }}
                            key={room.roomId}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition"
                            aria-label={`${room.roomName} 채팅방으로 이동`}
                        >
                            <div className="flex -space-x-2">
                                {room.members.slice(0, 2).map((member) => (
                                    <img
                                        key={member.memberId}
                                        src={member.profileImageUrl}
                                        alt={`${member.accountId} 프로필`}
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                    />
                                ))}
                                {room.countMember > 2 && (
                                    <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold border-2 border-white">
                                        +{room.countMember - 2}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-semibold text-base">{room.roomName}</span>
                                <span className="text-xs text-gray-500">
                                    {room.members.map((m) => m.accountId).join(', ')}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default DMInbox;
