import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFormDataWithJson } from '@/utils/formData';

interface PostForm {
    content: string;
    images: File[];
    hashtags: { hashtag: string }[];
}

const MAX_CONTENT_LENGTH = 2000;

export const usePostForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<PostForm>({
        content: '',
        images: [],
        hashtags: [],
    });
    const [error, setError] = useState<string>('');

    const updateContent = (content: string) => {
        const newValue = content.slice(0, MAX_CONTENT_LENGTH);
        setForm((prev) => ({ ...prev, content: newValue }));
    };

    const updateImages = (images: File[]) => {
        setForm((prev) => ({ ...prev, images }));
    };

    const updateHashtags = (hashtags: { hashtag: string }[]) => {
        setForm((prev) => ({ ...prev, hashtags }));
    };

    const isFormValid = (): boolean => {
        return form.content.trim().length > 0;
    };

    const submitPost = async () => {
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
            throw error;
        }
    };

    return {
        form,
        error,
        setError,
        updateContent,
        updateImages,
        updateHashtags,
        submitPost,
        MAX_CONTENT_LENGTH,
    };
};
