import FeedHeader from '@/components/features/feed/FeedHeader';
import FeedImages from '@/components/features/feed/FeedImages';
import FeedContent from '@/components/features/feed/FeedContent';
import LikeAction from '@/components/features/feed/like/LikeAction';
import CommentAction from '@/components/features/feed/comment/CommentAction';
import { HashtagInput } from '../feed/HashtagInput';
import { FeedPost } from '@/types';
import { useState } from 'react';
import { getToken } from '@/utils/auth';
import { FEED_API_URL } from '@/constants/apiUrl';
import { useNavigate } from 'react-router-dom';
import useConfirmModal from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useQueryClient } from '@tanstack/react-query';
import { fetchWithToken } from '@/token';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

interface FeedMainContentProps {
    feed: FeedPost;
    userProfile: UserProfile | null;
    onDeleteSuccess?: () => void;
}

const FeedMainContent = ({ feed, userProfile, onDeleteSuccess }: FeedMainContentProps) => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [hashtags, setHashtags] = useState<{ hashtag: string }[]>(
        Array.isArray(feed.hashtags) ? feed.hashtags.map((h) => ({ hashtag: h })) : [],
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const isAuthor = feed?.authorNickname === userProfile?.nickname;
    const totalComments = feed.commentsCount ?? 0;
    const navigate = useNavigate();
    const confirmModal = useConfirmModal();

    const handleFeedEdit = () => {
        const hashtags = Array.isArray(feed.hashtags) ? feed.hashtags.map((h) => ({ hashtag: h })) : [];
        setEditContent(feed.content);
        setHashtags(hashtags);
        setIsEditing(true);
    };

    const handleFeedEditSubmit = async () => {
        if (!feed.feedId || !editContent.trim()) return;
        try {
            const feedUpdateRequest = {
                content: editContent.trim(),
                hashtags,
                imageUrls: feed.imageUrls || [],
            };
            const formData = new FormData();
            formData.append('feedUpdateRequest', new Blob([JSON.stringify(feedUpdateRequest)]));
            const response = await fetchWithToken(`${FEED_API_URL}/${feed.feedId}`, {
                method: 'PATCH',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '피드 수정에 실패했습니다.');
            }
            setIsEditing(false);

            await queryClient.invalidateQueries({ queryKey: ['feeds'] });
            await queryClient.invalidateQueries({ queryKey: ['feed', Number(feed.feedId)] });
        } catch (error) {
            alert(error instanceof Error ? error.message : '피드 수정에 실패했습니다.');
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditContent('');
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${FEED_API_URL}/${feed.feedId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '피드 삭제에 실패했습니다.');
            }
            if (onDeleteSuccess) onDeleteSuccess();
            navigate('/');
        } catch (error) {
            alert(error instanceof Error ? error.message : '피드 삭제에 실패했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteModal = () => {
        confirmModal.show(
            {
                title: '피드 삭제 확인',
                description: '정말로 이 피드를 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.',
                confirmText: '삭제',
                cancelText: '취소',
            },
            handleDelete,
        );
    };

    return (
        <>
            <FeedHeader {...feed} />
            {isAuthor && (
                <div className="flex items-center justify-end gap-4 mb-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleFeedEditSubmit}
                                className="text-base text-[#FF785D] font-bold hover:text-[#FF785D]/80"
                            >
                                완료
                            </button>
                            <button onClick={handleEditCancel} className="text-base text-gray-500 hover:text-gray-600">
                                취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleFeedEdit} className="text-base text-gray-500 hover:text-[#FF785D]">
                                수정
                            </button>
                            <button
                                onClick={handleDeleteModal}
                                className="text-base text-red-500 hover:text-red-600"
                                disabled={isDeleting}
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            )}
            {isEditing ? (
                <div className="mt-4 flex flex-col gap-4 mb-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-base"
                        rows={4}
                        placeholder="내용을 입력하세요."
                    />
                    <HashtagInput hashtags={hashtags} onHashtagsChange={setHashtags} inputClassName="text-base" />
                </div>
            ) : (
                <FeedContent feed={feed} />
            )}
            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
            <div className="flex items-center justify-between px-2 mt-4 mb-2">
                <div className="flex items-center gap-4">
                    <LikeAction feedId={feed.feedId} count={feed.likesCount} isLiked={feed.liked} />
                    <CommentAction
                        count={totalComments}
                        onClick={() => {
                            const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (inputElement) inputElement.focus();
                        }}
                    />
                </div>
            </div>
            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                onConfirm={confirmModal.handleConfirm}
                onCancel={confirmModal.hide}
            />
        </>
    );
};

export default FeedMainContent;
