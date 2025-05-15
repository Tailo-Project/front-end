import Layout from '@/layouts/layout';
import { useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import * as StompJS from '@stomp/stompjs';

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
    content: string;
    senderId?: string;
    timestamp?: Date;
}

const Room = () => {
    const { roomId: paramRoomId } = useParams();
    const { roomId: stateRoomId } = useLocation().state || {};
    const roomId = paramRoomId || stateRoomId;
    const clientRef = useRef<StompJS.Client | null>(null);
    const [chatList, setChatList] = useState<ChatMessage[]>([]);
    const [newChat, setNewChat] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    console.log(chatList);
    const client = new StompJS.Client({
        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        // debug: function (str) {
        //     // console.log(str, 'str');
        // },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        webSocketFactory: function () {
            return new SockJS('https://hipet-yjuni0.com/ws'); // URL은 문자열로
        },
    });

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

    // const currentUserId = localStorage.getItem('accountId');
    // const otherUserId = room?.members.find((member) => member.accountId !== currentUserId);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log('submit');

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

            setNewChat(''); // 입력 필드 초기화
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewChat(event.target.value);
    };

    return (
        <Layout>
            <div className="flex flex-col min-h-screen bg-white">
                {/* 상단 프로필 영역 */}
                {/* {room && (
                    <div className="flex flex-col items-center py-4 border-b">
                        <img
                            className="w-16 h-16 rounded-full object-cover mb-2"
                            src={otherUserId?.profileImageUrl}
                            alt="프로필 이미지"
                        />
                        <div className="text-center">
                            <p className="font-semibold text-lg">{otherUserId?.accountId}</p>
                            <p className="text-xs text-gray-400">Secondary/Default</p>
                        </div>
                        <button className="mt-2 text-sm text-white bg-[#ff785d] px-4 py-2 rounded-md">
                            프로필 보기
                        </button>
                    </div>
                )} */}

                {/* 메시지 입력창 */}
                <form onSubmit={handleSubmit}>
                    <div className="sticky bottom-0 left-0 w-full bg-white border-t px-4 py-2 flex items-center gap-2 z-10">
                        <input
                            type="text"
                            className="flex-1 border-2 border-gray-300 rounded-md p-2"
                            placeholder="메시지를 입력하세요."
                            value={newChat}
                            onChange={handleChange}
                        />
                        <button aria-label="메시지 전송">
                            <svg width="32" height="32" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Room;
