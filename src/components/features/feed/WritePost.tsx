import { useNavigate } from 'react-router-dom';
import { ImageUploader } from './ImageUploader';
import { HashtagInput } from './HashtagInput';
import usePostForm from '@/hooks/usePostForm';
import Layout from '@/layouts/layout';

const WritePost = () => {
    const navigate = useNavigate();
    const { form, error, setError, updateContent, updateImages, updateHashtags, submitPost, MAX_CONTENT_LENGTH } =
        usePostForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitPost();
        } catch {
            // Error is already handled in usePostForm
        }
    };

    return (
        <Layout>
            <div className="w-full max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto bg-white min-h-screen pb-16">
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
                    <button onClick={() => navigate('/')} className="text-gray-500 font-semibold hover:text-gray-600">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!form.content.trim() || form.images.length === 0}
                        className="px-4 py-2 bg-[#FF785D] text-white rounded-lg hover:bg-[#FF785D]/80 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        게시하기
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <div className="relative">
                        <textarea
                            placeholder="내용을 입력하세요"
                            value={form.content}
                            onChange={(e) => updateContent(e.target.value)}
                            className="min-h-[300px] p-2 text-base border-none outline-none resize-y w-full"
                        />
                        <span className="absolute right-2 bottom-2 text-sm text-gray-400">
                            {form.content.length}/{MAX_CONTENT_LENGTH}
                        </span>
                    </div>

                    <ImageUploader
                        images={form.images}
                        onImagesChange={updateImages}
                        error={error}
                        onError={setError}
                    />

                    <HashtagInput hashtags={form.hashtags} onHashtagsChange={updateHashtags} />
                </form>
            </div>
        </Layout>
    );
};

export default WritePost;
