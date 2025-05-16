import Layout from '@/layouts/layout';
import { useRef, useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import * as StompJS from '@stomp/stompjs';
import { formatTimeAgo } from '@/utils/date';
import { BASE_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';

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

interface ChatMessage {
    id: string;
    message: string;
    senderId?: string;
    timestamp?: Date;
}

const Room = () => {
    const { roomId: paramRoomId } = useParams();
    const location = useLocation();

    const { roomId: stateRoomId, otherAccountId } = location.state || {};
    const roomId = paramRoomId || stateRoomId;
    const clientRef = useRef<StompJS.Client | null>(null);
    const [chatList, setChatList] = useState<ChatMessage[]>([]);
    const [newChat, setNewChat] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [otherUser, setOtherUser] = useState<{
        accountId: string;
        profileImageUrl: string;
    } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOtherUserProfile = async () => {
            try {
                if (!otherAccountId) {
                    return;
                }

                const response = await fetchWithToken(`${BASE_API_URL}/member/profile/${otherAccountId}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('프로필 정보 요청 실패');
                }

                const { data } = await response.json();

                if (data) {
                    setOtherUser({
                        accountId: data.accountId,
                        profileImageUrl: data.profileImageUrl,
                    });
                }
            } catch (error) {
                console.error('프로필 정보 가져오기 실패:', error);
                // 에러 발생 시 기본 프로필 정보 설정
            }
        };

        fetchOtherUserProfile();
    }, [otherAccountId]);

    useEffect(() => {
        const client = new StompJS.Client({
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: function () {
                return new SockJS(import.meta.env.VITE_STOMP_URL);
            },
        });

        clientRef.current = client;

        client.onConnect = function () {
            setIsConnected(true);
            const subscription = client.subscribe(`/topic/chat/room/${roomId}`, (message) => {
                try {
                    const receivedMessage = JSON.parse(message.body);
                    console.log(receivedMessage, 'receivedMessage');
                    setChatList((prev) => [...prev, receivedMessage]);
                } catch (error) {
                    console.error('메시지 파싱 오류:', error);
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        };

        client.onWebSocketClose = function (frame) {
            console.log('Disconnected: ' + frame);
            setIsConnected(false);
        };

        client.onWebSocketError = function (frame) {
            console.log('WebSocket error: ' + frame);
        };

        client.onStompError = function (frame) {
            console.log('STOMP error: ' + frame);
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [roomId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isConnected) {
            return;
        }
        try {
            const newMessage = {
                message: newChat,
                sender: localStorage.getItem('accountId'),
                timestamp: new Date().toISOString(),
            };

            clientRef.current?.publish({
                destination: `/topic/chat/room/${roomId}`,
                body: JSON.stringify(newMessage),
            });

            setNewChat(''); // 입력창 초기화
        } catch (error) {
            console.error('메시지 전송 오류:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewChat(event.target.value);
    };

    return (
        <Layout>
            <div className="flex flex-col bg-white">
                {/* 상단 프로필 영역 */}
                <div className="flex flex-col items-center py-4 border-b">
                    <img
                        className="w-16 h-16 rounded-full object-cover mb-2"
                        src={otherUser?.profileImageUrl}
                        alt="프로필 이미지"
                    />
                    <div className="text-center">
                        <p className="font-semibold text-lg">{otherUser?.accountId}</p>
                        <p className="text-xs text-gray-400">Secondary/Default</p>
                    </div>
                    <button
                        onClick={() => otherUser?.accountId && navigate(`/profile/${otherUser.accountId}`)}
                        className="mt-2 text-sm text-white bg-[#ff785d] px-4 py-2 rounded-md"
                    >
                        프로필 보기
                    </button>
                </div>

                {/* 메시지 입력창 */}
                <form onSubmit={handleSubmit} className="border-t p-4">
                    <div className="flex items-end gap-2">
                        <input
                            type="text"
                            value={newChat}
                            onChange={handleChange}
                            placeholder="메시지를 입력하세요"
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff785d]"
                        />
                        <button
                            type="submit"
                            disabled={!newChat.trim()}
                            className="px-4 py-2 bg-[#ff785d] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ff6a4d] transition-colors"
                        >
                            보내기
                        </button>
                    </div>
                </form>

                {/* 채팅 메시지 목록 */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                    {chatList.map((chat) => {
                        const isOwnMessage = chat.senderId === localStorage.getItem('accountId');
                        return (
                            <div key={chat.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                        isOwnMessage ? 'bg-[#ff785d] text-white' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <p className="text-sm">{chat.message}</p>
                                    <p className="text-xs mt-1 text-right opacity-70">
                                        {formatTimeAgo(chat.timestamp?.toString() || '')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Room;
