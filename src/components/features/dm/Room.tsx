import { BASE_API_URL } from '@/constants/apiUrl';
import Layout from '@/layouts/layout';
import { fetchWithToken } from '@/token';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Room {
    roomId: string;
    roomName: string;
    members: {
        memberId: string;
        accountId: string;
        profileImageUrl: string;
    }[];
    countMember: number;
}

const Room = () => {
    const { roomId } = useLocation().state;
    const [room, setRoom] = useState<Room | null>(null);
    console.log(roomId);
    useEffect(() => {
        const fetchRoom = async () => {
            const response = await fetchWithToken(`${BASE_API_URL}/chat/room/${roomId}`, {
                method: 'GET',
            });
            const data = await response.json();
            setRoom(data.data);
        };
        fetchRoom();
    }, [roomId]);

    return (
        <Layout>
            <div className="flex flex-col min-h-screen bg-white">
                {/* 상단 프로필 영역 */}
                {room && (
                    <div className="flex flex-col items-center py-4 border-b">
                        <img
                            className="w-16 h-16 rounded-full object-cover mb-2"
                            src={room.members[1].profileImageUrl}
                            alt="프로필 이미지"
                        />
                        <div className="text-center">
                            <p className="font-semibold text-lg">{room.members[1].accountId}</p>
                            <p className="text-xs text-gray-400">Secondary/Default</p>
                        </div>
                        <button className="mt-2 text-sm text-white bg-[#ff785d] px-4 py-2 rounded-md">
                            프로필 보기
                        </button>
                    </div>
                )}

                {/* 채팅 메시지 영역 */}
                <div className="flex-1 overflow-y-auto px-4 py-2 bg-white">
                    <div className="flex flex-col gap-3">
                        {/* 상대 메시지 */}
                        <div className="flex items-end gap-2">
                            <div className="bg-white border rounded-lg shadow px-3 py-2 max-w-[70%]">
                                <p>메시지</p>
                            </div>
                            <span className="text-xs text-gray-400">22:22</span>
                        </div>
                        {/* 본인 메시지 */}
                        <div className="flex items-end gap-2 justify-end">
                            <span className="text-xs text-gray-400">22:22</span>
                            <div className="bg-white border rounded-lg shadow px-3 py-2 max-w-[70%]">
                                <p>메시지</p>
                            </div>
                        </div>
                        {/* 반복 예시 */}
                        <div className="flex items-end gap-2">
                            <div className="bg-white border rounded-lg shadow px-3 py-2 max-w-[70%]">
                                <p>메시지</p>
                            </div>
                            <span className="text-xs text-gray-400">22:22</span>
                        </div>
                        <div className="flex items-end gap-2 justify-end">
                            <span className="text-xs text-gray-400">22:22</span>
                            <div className="bg-white border rounded-lg shadow px-3 py-2 max-w-[70%]">
                                <p>메시지</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 메시지 입력창 */}
                <div className="sticky bottom-0 left-0 w-full bg-white border-t px-4 py-2 flex items-center gap-2 z-10">
                    <input
                        type="text"
                        className="flex-1 border-2 border-gray-300 rounded-md p-2"
                        placeholder="메시지를 입력하세요."
                    />
                    <button aria-label="메시지 전송">
                        <svg width="32" height="32" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Room;
