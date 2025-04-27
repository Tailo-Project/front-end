import FeedHeader from '@/components/features/feed/FeedHeader';
import FeedImages from '@/components/features/feed/FeedImages';
import FeedContent from '@/components/features/feed/FeedContent';
import LikeAction from '@/components/features/feed/LikeAction';
import CommentAction from '@/components/features/feed/CommentAction';
import CommentInput from '@/components/features/feed/CommentInput';
import CommentList from './CommentList';
import BackButton from '../../BackButton';
import Layout from '../../../layouts/layout';
import { FeedPost, CommentsResponse } from '@/shared/types/feed';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { getToken } from '@/utils/auth';
import { FEED_API_URL } from '@/constants/apiUrl';
import { HashtagInput } from '../feed/HashtagInput';
import useFeedComments from '@/hooks/useFeedComments';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

interface FeedDetailContentProps {
    feed: FeedPost;
    userProfile: UserProfile | null;
    comments: CommentsResponse | undefined;
    deleteComment: (commentId: number) => Promise<void>;
    handleLike: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface FeedMainContentProps {
    feed: FeedPost;
    userProfile: UserProfile | null;
    handleLike: (e: React.MouseEvent<HTMLButtonElement>) => void;
    navigate: ReturnType<typeof useNavigate>;
}

interface FeedCommentSectionProps {
    userProfile: UserProfile | null;
    comments: CommentsResponse | undefined;
    deleteComment: (commentId: number) => Promise<void>;
    feedId: string;
}

const FeedMainContent = ({ feed, userProfile, handleLike, navigate }: FeedMainContentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [hashtags, setHashtags] = useState(feed.hashtags.map((tag) => ({ hashtag: tag })));
    const [isDeleting, setIsDeleting] = useState(false);
    const isAuthor = feed?.authorNickname === userProfile?.nickname;
    const totalComments = feed.commentsCount ?? 0;

    // 피드 수정 버튼 클릭
    const handleEdit = () => {
        setEditContent(feed.content);
        setHashtags(feed.hashtags.map((tag) => ({ hashtag: tag })));
        setIsEditing(true);
    };

    // 피드 수정 완료
    const handleEditSubmit = async () => {
        if (!feed.feedId || !editContent.trim()) return;
        try {
            const formData = new FormData();
            const feedUpdateRequest = {
                content: editContent.trim(),
                hashtags: hashtags.map((h) => h.hashtag),
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
        if (!window.confirm('피드를 삭제하시겠습니까?')) return;
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
            alert('피드가 삭제되었습니다.');
            navigate('/');
        } catch (error) {
            alert(error instanceof Error ? error.message : '피드 삭제에 실패했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <FeedHeader {...feed} />
            {isAuthor && (
                <div className="flex items-center justify-end gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleEditSubmit} className="text-xs text-blue-500 hover:text-blue-600">
                                완료
                            </button>
                            <button onClick={handleEditCancel} className="text-xs text-gray-500 hover:text-gray-600">
                                취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleEdit} className="text-xs text-gray-500 hover:text-blue-500">
                                수정
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-xs text-red-500 hover:text-red-600"
                                disabled={isDeleting}
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            )}
            {isEditing ? (
                <div className="mt-4 flex flex-col gap-2">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="내용을 입력하세요. 해시태그는 #으로 시작합니다."
                    />
                    <HashtagInput hashtags={hashtags} onHashtagsChange={setHashtags} />
                </div>
            ) : (
                <FeedContent feed={feed} />
            )}
            <FeedImages images={feed.imageUrls || []} authorNickname={feed.authorNickname} />
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-4">
                    <LikeAction count={feed.likesCount} isLiked={feed.isLiked} onToggle={handleLike} />
                    <CommentAction
                        count={totalComments}
                        onClick={() => {
                            const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (inputElement) inputElement.focus();
                        }}
                    />
                </div>
            </div>
        </>
    );
};

const FeedCommentSection = ({ userProfile, comments, deleteComment, feedId }: FeedCommentSectionProps) => {
    const { addComment } = useFeedComments(feedId);
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [newComment, setNewComment] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmitComment = async () => {
        if (!newComment.trim() || isSubmitting || !userProfile) return;
        setIsSubmitting(true);
        try {
            await addComment(newComment, replyToId);
            setNewComment('');
            setReplyToId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : '댓글 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <CommentInput
                newComment={newComment}
                onCommentChange={(e) => setNewComment(e.target.value)}
                onCommentSubmit={(e) => {
                    e.preventDefault();
                    onSubmitComment();
                }}
                isSubmitting={isSubmitting}
                replyToId={replyToId}
                onCancelReply={() => setReplyToId(null)}
            />
            <CommentList
                comments={comments?.comments || []}
                userProfile={userProfile}
                onReply={(id: number) => setReplyToId(id)}
                onDelete={deleteComment}
            />
        </>
    );
};

const FeedDetailContent = ({ feed, userProfile, comments, deleteComment, handleLike }: FeedDetailContentProps) => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="bg-white min-h-screen flex flex-col">
                <header className="flex items-center px-4 h-[52px] border-b border-gray-200 flex-shrink-0">
                    <BackButton />
                    <h1 className="flex-1 text-center font-medium">게시물</h1>
                </header>
                <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
                    <div className="p-4">
                        <FeedMainContent
                            feed={feed}
                            userProfile={userProfile}
                            handleLike={handleLike}
                            navigate={navigate}
                        />
                    </div>
                    <FeedCommentSection
                        userProfile={userProfile}
                        comments={comments}
                        deleteComment={deleteComment}
                        feedId={String(feed.feedId)}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default FeedDetailContent;
