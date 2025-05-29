import { useNavigate } from 'react-router-dom';
import { ImageUploader } from './ImageUploader';
import { HashtagInput } from './HashtagInput';
import usePostForm from '@/hooks/usePostForm';
import Layout from '@/layouts/layout';
import { FiArrowLeft } from 'react-icons/fi';

const WritePost = () => {
    const navigate = useNavigate();
    const { form, error, setError, updateContent, updateImages, updateHashtags, submitPost, MAX_CONTENT_LENGTH } =
        usePostForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }
        if (form.images.length === 0) {
            setError('이미지를 1개 이상 업로드해주세요.');
            return;
        }

        submitPost();
    };

    const isSubmitDisabled = !form.content.trim() || form.images.length === 0;

    return (
        <Layout>
            <div className="w-full max-w-[600px] mx-auto bg-white min-h-screen">
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="뒤로 가기"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">새 게시물</h1>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                isSubmitDisabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#FF785D] text-white hover:bg-[#FF6A4D]'
                            }`}
                        >
                            공유하기
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-56px)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div className="relative">
                            <textarea
                                placeholder="이야기를 나눠보세요..."
                                value={form.content}
                                onChange={(e) => updateContent(e.target.value)}
                                className="w-full min-h-[120px] p-3 text-gray-900 placeholder-gray-400 text-base border-0 focus:ring-0 resize-none"
                                maxLength={MAX_CONTENT_LENGTH}
                                rows={5}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                {form.content.length}/{MAX_CONTENT_LENGTH}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-sm font-medium text-gray-700">사진 추가</h2>
                            <ImageUploader
                                images={form.images}
                                onImagesChange={updateImages}
                                error={error}
                                onError={setError}
                            />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-sm font-medium text-gray-700">해시태그</h2>
                            <HashtagInput hashtags={form.hashtags} onHashtagsChange={updateHashtags} />
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default WritePost;
