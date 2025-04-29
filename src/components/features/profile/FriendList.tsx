import { useEffect, useState } from 'react';
import { fetchWithToken } from '@/token';
import { FOLLOW_API_URL, MEMBER_API_URL } from '@/constants/apiUrl';
import Toast from '@/components/Toast';
import useToast from '@/hooks/useToast';

interface Friend {
    id: number;
    accountId: string;
    nickname: string;
    profileImageUrl: string | null;
    isFollow: boolean;
}

const FriendList = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [blockedIds, setBlockedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBlockLoading, setIsBlockLoading] = useState<string | null>(null); // 차단/해제 버튼 중복 클릭 방지
    const { toast, showToast } = useToast();

    const myAccountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;

    // 차단 목록 불러오기
    const fetchBlocked = async () => {
        try {
            const res = await fetchWithToken(`${MEMBER_API_URL}/block`, {
                method: 'GET',
            });
            if (!res.ok) throw new Error('차단 목록을 불러오지 못했습니다.');
            const { data } = await res.json();
            // data가 accountId 배열이라고 가정
            setBlockedIds(Array.isArray(data) ? data : []);
        } catch {
            showToast('차단 목록을 불러오지 못했습니다.', 'error');
        }
    };

    // 친구 목록 불러오기
    useEffect(() => {
        if (!myAccountId) {
            showToast('로그인이 필요합니다.', 'error');
            setIsLoading(false);
            return;
        }
        const fetchFriends = async () => {
            setIsLoading(true);
            try {
                const res = await fetchWithToken(`${FOLLOW_API_URL}/${myAccountId}/following`, {
                    method: 'GET',
                });
                if (!res.ok) throw new Error('친구 목록을 불러오지 못했습니다.');
                const { data } = await res.json();
                setFriends(data?.content || []);
            } catch {
                showToast('친구 목록을 불러오지 못했습니다.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFriends();
        fetchBlocked();
    }, [myAccountId, showToast]);

    // 차단/해제 핸들러
    const handleBlockToggle = async (accountId: string, isBlocked: boolean) => {
        if (isBlockLoading) return; // 중복 클릭 방지
        setIsBlockLoading(accountId);
        try {
            const method = isBlocked ? 'DELETE' : 'POST';
            const res = await fetchWithToken(`${MEMBER_API_URL}/block/${accountId}`, { method });
            if (!res.ok) throw new Error(isBlocked ? '차단 해제에 실패했습니다.' : '차단에 실패했습니다.');
            await fetchBlocked(); // 차단 목록 새로고침
            showToast(isBlocked ? '차단 해제되었습니다.' : '차단되었습니다.', 'success');
        } catch {
            showToast(isBlocked ? '차단 해제 중 오류가 발생했습니다.' : '차단 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsBlockLoading(null);
        }
    };

    return (
        <div className="max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto bg-white min-h-screen pb-16 p-4">
            <h1 className="text-xl font-bold mb-6">친구 관리</h1>
            {isLoading ? (
                <div className="text-center text-gray-500">로딩 중...</div>
            ) : friends.length === 0 ? (
                <div className="text-center text-gray-400">친구가 없습니다.</div>
            ) : (
                <ul className="space-y-4">
                    {friends.map((friend) => {
                        const isBlocked = blockedIds.includes(friend.accountId);
                        return (
                            <li key={friend.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <img
                                    src={friend.profileImageUrl || ''}
                                    alt={friend.nickname}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold">{friend.nickname}</div>
                                    <div className="text-xs text-gray-500">{friend.accountId}</div>
                                </div>
                                <button
                                    onClick={() => handleBlockToggle(friend.accountId, isBlocked)}
                                    disabled={isBlockLoading === friend.accountId}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        isBlocked
                                            ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                    } ${isBlockLoading === friend.accountId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isBlocked ? '차단 해제' : '차단'}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
            {toast.show && (
                <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
            )}
        </div>
    );
};

export default FriendList;
