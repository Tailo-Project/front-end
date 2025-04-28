import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createFormDataWithJson } from '@/utils/formData';
import { fetchWithToken } from '@/token';
import { FEED_API_URL } from '../constants/apiUrl';

interface PostForm {
    content: string;
    images: File[];
    hashtags: { hashtag: string }[];
}

const MAX_CONTENT_LENGTH = 2000;

const usePostForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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

    const submitPost = async () => {
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
            const response = await fetchWithToken(`${FEED_API_URL}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('서버 응답 에러:', errorData);
                throw new Error('게시글 등록에 실패했습니다.');
            }

            await queryClient.invalidateQueries({ queryKey: ['feeds'] });

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

export default usePostForm;
