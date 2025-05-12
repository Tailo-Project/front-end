import BackButton from '../../BackButton';
import Layout from '../../../layouts/layout';
import { FeedPost, CommentsResponse } from '@/types';

import useToast from '@/hooks/useToast';
import Toast from '@/components/Toast';
import useConfirmModal from '@/hooks/useConfirmModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import FeedMainContent from './FeedMainContent';
import FeedCommentSection from './FeedCommentSection';

interface UserProfile {
    nickname: string;
    profileImageUrl: string;
}

interface FeedDetailContentProps {
    feed: FeedPost;
    userProfile: UserProfile | null;
    comments: CommentsResponse | undefined;
    deleteComment: (commentId: number) => Promise<void>;
}

const FeedDetailContent = ({ feed, userProfile, comments, deleteComment }: FeedDetailContentProps) => {
    const { showToast, toast, hideToast } = useToast();
    const confirmModal = useConfirmModal();

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
                            onDeleteSuccess={() => showToast('피드가 삭제되었습니다.', 'success')}
                        />
                    </div>
                    <FeedCommentSection
                        userProfile={userProfile}
                        comments={comments}
                        deleteComment={deleteComment}
                        feedId={String(feed.feedId)}
                    />
                </div>
                <ConfirmModal
                    {...confirmModal}
                    onCancel={confirmModal.hide}
                />
                {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
            </div>
        </Layout>
    );
};

export default FeedDetailContent;
