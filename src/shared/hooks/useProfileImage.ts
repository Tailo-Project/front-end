import { useState, useEffect } from 'react';

interface UseProfileImageReturn {
    imageUrl: string | null;
    profileImage: string | File;
    handleImageChange: (file: File | null) => void;
}

export const useProfileImage = (initialImage: string | File): UseProfileImageReturn => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | File>(initialImage);

    useEffect(() => {
        if (profileImage instanceof File) {
            const url = URL.createObjectURL(profileImage);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(profileImage || null);
        }
    }, [profileImage]);

    const handleImageChange = (file: File | null) => {
        if (file) {
            const maxSize = 1024 * 1024 * 5;
            if (file.size > maxSize) {
                throw new Error('최대 5MB의 이미지를 업로드할 수 있습니다.');
            }
            setProfileImage(file);
        }
    };

    return { imageUrl, profileImage, handleImageChange };
};
