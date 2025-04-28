import FeedHeader from '@/components/features/feed/FeedHeader';
import FeedImages from '@/components/features/feed/FeedImages';
import FeedContent from '@/components/features/feed/FeedContent';
import LikeAction from '@/components/features/feed/LikeAction';
import CommentAction from '@/components/features/feed/CommentAction';
import { HashtagInput } from '../feed/HashtagInput';
import { FeedPost } from '@/types';
import { useState } from 'react';
import { getToken } from '@/utils/auth';
import { FEED_API_URL } from '@/constants/apiUrl';
import { useNavigate } from 'react-router-dom';
import useConfirmModal from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/common/ConfirmModal';

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
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [hashtags, setHashtags] = useState(feed.hashtags.map((tag: string) => ({ hashtag: tag })));
    const [isDeleting, setIsDeleting] = useState(false);
    const isAuthor = feed?.authorNickname === userProfile?.nickname;
    const totalComments = feed.commentsCount ?? 0;
    const navigate = useNavigate();
    const confirmModal = useConfirmModal();

    const handleFeedEdit = () => {
        setEditContent(feed.content);
        setHashtags(feed.hashtags.map((tag: string) => ({ hashtag: tag })));
        setIsEditing(true);
    };

    const handleFeedEditSubmit = async () => {
        if (!feed.feedId || !editContent.trim()) return;
        try {
            const formData = new FormData();
            const feedUpdateRequest = {
                content: editContent.trim(),
                hashtags: hashtags.map((h: { hashtag: string }) => h.hashtag),
                imageUrls: feed.imageUrls || [],
            };
            formData.append(
                'feedUpdateRequest',
                new Blob([JSON.stringify(feedUpdateRequest)], { type: 'application/json' }),
            );
            const response = await fetch(`${FEED_API_URL}/${feed.feedId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '피드 수정에 실패했습니다.');
            }
            setIsEditing(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : '피드 수정에 실패했습니다.');
        }
    };

    // 피드 수정 취소
    const handleEditCancel = () => {
        setIsEditing(false);
        setEditContent('');
    };

    // 피드 삭제
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

    // 삭제 버튼 클릭 시 모달 오픈
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
                        placeholder="내용을 입력하세요. 해시태그는 #으로 시작합니다."
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
