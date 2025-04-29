import { FOLLOW_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import { useEffect, useState } from 'react';
import Layout from '@/layouts/layout';
import defaultProfileImage from '@/assets/defaultImage.png';
import BackButton from '@/components/BackButton';
import { getAccountId } from '@/utils/auth';

interface FriendListProps {
    accountId: string;
    id: number;
    nickname: string;
    profileImage: string | undefined;
    isFollowing: boolean;
}

type FriendListType = 'following' | 'followers';

const FriendList = () => {
    const [friendList, setFriendList] = useState<FriendListProps[]>([]);
    const accountId = getAccountId();
    const [activeTab, setActiveTab] = useState<FriendListType>('following');

    const handleFollow = async (followerId: string) => {
        const targetUser = friendList.find((user) => user.accountId === followerId);
        if (!targetUser) return;

        const method = targetUser.isFollowing ? 'DELETE' : 'POST';
        const response = await fetchWithToken(`${FOLLOW_API_URL}/${followerId}?accountId=${followerId}`, {
            method,
        });
        await response.json();

        setFriendList((prev) =>
            prev.map((user) => (user.accountId === followerId ? { ...user, isFollowing: !user.isFollowing } : user)),
        );
    };

    const fetchList = async (type: FriendListType) => {
        let url = '';
        if (type === 'following') {
            // 팔로워 리스트
            url = `${FOLLOW_API_URL}/${accountId}/following`;
        } else if (type === 'followers') {
            // 팔로잉 리스트
            url = `${FOLLOW_API_URL}/${accountId}`;
        }

        const response = await fetchWithToken(url, { method: 'GET' });
        const { data } = await response.json();

        const listWithState = data.content.map((item: Omit<FriendListProps, 'isFollowing'>) => ({
            ...item,
            isFollowing: true,
        }));
        setFriendList(listWithState);
    };

    useEffect(() => {
        fetchList(activeTab);
    }, [activeTab]);

    return (
        <Layout>
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <BackButton />
                    <h1 className="text-xl font-bold">팔로워 목록</h1>
                    <span className="ml-2 text-gray-500">({friendList.length})</span>
                </div>
                <div className="flex flex-row gap-4 items-center justify-center">
                    <button
                        className={`text-lg font-bold ${activeTab === 'following' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('following')}
                    >
                        팔로워
                    </button>
                    <button
                        className={`text-lg font-bold ${activeTab === 'followers' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('followers')}
                    >
                        팔로잉
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {activeTab === 'following' ? (
                        <div className="flex flex-col gap-4">
                            {friendList.length === 0 ? (
                                <div>팔로워가 없습니다.</div>
                            ) : (
                                friendList.map((item) => (
                                    <div
                                        className="flex items-center gap-2 cursor-pointer bg-amber-50 w-full px-4 py-2 rounded-md"
                                        key={item.id}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.profileImage || defaultProfileImage}
                                                alt={item.nickname}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full ml-2">
                                            <div className="text-lg font-bold">{item.nickname}</div>
                                            <div className="text-sm text-gray-500">{item.accountId}</div>
                                        </div>
                                        <button
                                            onClick={() => handleFollow(item.accountId)}
                                            className={`${
                                                item.isFollowing ? 'bg-amber-500' : 'bg-gray-500'
                                            } text-white w-24 p-2 rounded-md hover:bg-amber-600 cursor-pointer`}
                                        >
                                            {item.isFollowing ? '팔로잉' : '팔로우'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {friendList.length === 0 ? (
                                <div className="text-center text-gray-500 font-bold mt-4">팔로잉이 없습니다.</div>
                            ) : (
                                friendList.map((item) => (
                                    <div
                                        className="flex items-center gap-2 cursor-pointer bg-amber-50 w-full px-4 py-2 rounded-md"
                                        key={item.id}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.profileImage || defaultProfileImage}
                                                alt={item.nickname}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full ml-2">
                                            <div className="text-lg font-bold">{item.nickname}</div>
                                            <div className="text-sm text-gray-500">{item.accountId}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default FriendList;
