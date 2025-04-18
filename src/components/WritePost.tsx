import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from './TabBar';

interface PostForm {
    title: string;
    content: string;
    images: File[];
}

const WritePost = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<PostForm>({
        title: '',
        content: '',
        images: [],
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));

        // 이미지 미리보기 생성
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 호출 구현
        console.log('Form submitted:', form);
        navigate('/');
    };

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen pb-16">
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
                    <button onClick={() => navigate('/')} className="text-gray-500 font-semibold">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="text-blue-500 font-semibold">
                        게시
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={form.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="text-2xl p-2 border-b border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                        placeholder="내용을 입력하세요"
                        value={form.content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setForm((prev) => ({ ...prev, content: e.target.value }))
                        }
                        className="min-h-[300px] p-2 text-base border-none outline-none resize-y"
                    />
                    <div className="mt-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold"
                        >
                            이미지 추가
                        </button>
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
                </form>
            </div>
            <TabBar />
        </>
    );
};

export default WritePost;
