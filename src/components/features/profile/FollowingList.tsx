import { FOLLOW_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import defaultProfileImage from '@/assets/defaultImage.png';

interface FollowingListProps {
    accountId: string;
    id: number;
    nickname: string;
    profileImage: string | undefined;
    isFollowing: boolean;
}

const FollowingList = () => {
    const { state } = useLocation();
    const { accountId } = state;
    const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
    const [followingList, setFollowingList] = useState<FollowingListProps[]>([]);

    const handleFollow = async (followingId: string) => {
        const targetUser = followingList.find((user) => user.accountId === followingId);
        if (!targetUser) return;

        const method = targetUser.isFollowing ? 'DELETE' : 'POST';
        const response = await fetchWithToken(`${FOLLOW_API_URL}/${followingId}?accountId=${followingId}`, {
            method,
        });
        await response.json();

        setFollowingList((prev) =>
            prev.map((user) => (user.accountId === followingId ? { ...user, isFollowing: !user.isFollowing } : user)),
        );
    };

    const fetchList = async (type: 'following' | 'followers') => {
        const url =
            type === 'following' ? `${FOLLOW_API_URL}/${accountId}/following` : `${FOLLOW_API_URL}/${accountId}`;

        const response = await fetchWithToken(url, {
            method: 'GET',
        });
        const { data } = await response.json();
        const listWithState = data.content.map((item: Omit<FollowingListProps, 'isFollowing'>) => ({
            ...item,
            isFollowing: true,
        }));
        setFollowingList(listWithState);
    };

    useEffect(() => {
        fetchList(activeTab);
    }, [activeTab]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center mt-10 w-full">
            <div className="flex flex-row gap-4 items-center justify-center">
                <button
                    className={`text-lg font-bold ${activeTab === 'following' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('following')}
                >
                    팔로잉
                </button>
                <button
                    className={`text-lg font-bold ${activeTab === 'followers' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('followers')}
                >
                    팔로워
                </button>
            </div>

            {followingList.map((item: FollowingListProps) => (
                <div
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer bg-amber-50 w-full px-4 py-2 rounded-md"
                >
                    <img
                        src={item.profileImage || defaultProfileImage}
                        alt={item.nickname}
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-2 w-full ml-2">
                        <div className="text-lg font-bold">{item.nickname}</div>
                        <div className="text-sm text-gray-500">{item.accountId}</div>
                    </div>
                    <button
                        onClick={() => handleFollow(item.accountId)}
                        className={`${item.isFollowing ? 'bg-amber-500' : 'bg-gray-500'} text-white w-24 p-2 rounded-md hover:bg-amber-600 cursor-pointer`}
                    >
                        {item.isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FollowingList;
