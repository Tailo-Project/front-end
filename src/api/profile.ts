import { ProfileData } from '../types/profile';
import { createFormDataWithJson } from '@/utils/formData';

export const updateProfile = async (formData: FormData): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('프로필 수정에 실패했습니다.');
    }
};

export const createProfileFormData = (data: ProfileData): FormData => {
    const { nickname, bio, petType, petAge, petGender, address, profileImage } = data;

    return createFormDataWithJson({
        requestKey: 'request',
        jsonData: {
            nickname,
            bio,
            petType,
            petAge,
            petGender,
            address,
        },
        files: profileImage instanceof File ? [{ key: 'file', files: [profileImage] }] : undefined,
    });
};
