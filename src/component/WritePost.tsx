import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from './TabBar';
import { createFormDataWithJson } from '@/utils/formData';

interface PostForm {
    content: string;
    images: File[];
    hashtags: { hashtag: string }[];
}

const MAX_CONTENT_LENGTH = 2000;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const WritePost = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<PostForm>({
        content: '',
        images: [],
        hashtags: [],
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [hashtag, setHashtag] = useState<string>('');

    const validateImage = (file: File): boolean => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setError('지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF만 가능)');
            return false;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError(`이미지 크기는 ${MAX_IMAGE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.`);
            return false;
        }
        return true;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (form.images.length + files.length > MAX_IMAGES) {
            setError(`이미지는 최대 ${MAX_IMAGES}개까지만 업로드할 수 있습니다.`);
            return;
        }

        const validFiles = files.filter(validateImage);
        if (validFiles.length === 0) return;

        setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...validFiles],
        }));

        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        setError('');
    };

    const removeImage = (index: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const isFormValid = (): boolean => {
        return form.content.trim().length > 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) {
            setError('내용을 입력해주세요.');
            return;
        }

        const formData = createFormDataWithJson({
            requestKey: 'feedPostRequest',
            jsonData: {
                content: form.content,
                hashtags: form.hashtags,
            },
            files: [
                {
                    key: 'images',
                    files: form.images,
                },
            ],
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('서버 응답 에러:', errorData);
                throw new Error('게시글 등록에 실패했습니다.');
            }

            navigate('/');
        } catch (error) {
            console.error('게시글 생성 실패:', error);
            setError('게시글 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleHashtagSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedHashtag = hashtag.trim();

            if (trimmedHashtag && !form.hashtags.some((h) => h.hashtag === trimmedHashtag)) {
                setForm((prev) => ({
                    ...prev,
                    hashtags: [...prev.hashtags, { hashtag: trimmedHashtag }],
                }));
                setHashtag('');
            }
        }
    };

    const handleHashtagChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value.includes(' ')) {
            // 공백 입력 방지
            setHashtag(value);
        }
    };

    const removeHashtag = (index: number) => {
        setForm((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter((_, i) => i !== index),
        }));
    };

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen pb-16">
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
                    <button onClick={() => navigate('/')} className="text-gray-500 font-semibold">
                        취소
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <div className="relative">
                        <textarea
                            placeholder="내용을 입력하세요"
                            value={form.content}
                            onChange={(e) => {
                                const newValue = e.target.value.slice(0, MAX_CONTENT_LENGTH);
                                setForm((prev) => ({ ...prev, content: newValue }));
                            }}
                            className="min-h-[300px] p-2 text-base border-none outline-none resize-y w-full"
                        />
                        <span className="absolute right-2 bottom-2 text-sm text-gray-400">
                            {form.content.length}/{MAX_CONTENT_LENGTH}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={hashtag}
                                onChange={handleHashtagChange}
                                onKeyDown={handleHashtagSubmit}
                                placeholder="해시태그를 입력하고 Enter를 누르세요"
                                className="flex-1 p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        {form.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.hashtags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"
                                    >
                                        <span>#{tag.hashtag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeHashtag(index)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold"
                                disabled={form.images.length >= MAX_IMAGES}
                            >
                                이미지 추가
                            </button>
                            <span className="text-sm text-gray-400">
                                {form.images.length}/{MAX_IMAGES}
                            </span>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-[150px] object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={`mt-4 w-full py-2 rounded-lg font-semibold ${
                            isFormValid() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid()}
                    >
                        게시하기
                    </button>
                </form>
            </div>
            <TabBar />
        </>
    );
};

export default WritePost;
