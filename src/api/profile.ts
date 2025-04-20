import { ProfileData } from '../types/profile';

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

export const createFormDataWithJson = (data: ProfileData) => {
    const { nickname, bio, petType, petAge, petGender, address } = data;
    const formData = new FormData();
    const jsonData = {
        nickname,
        bio,
        petType,
        petAge,
        petGender,
        address,
    };
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    formData.append('request', blob);

    if (data.profileImage instanceof File) {
        formData.append('file', data.profileImage);
    }

    return formData;
};
