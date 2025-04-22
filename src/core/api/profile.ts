import { getAccountId, getToken } from '@/shared/utils/auth';
import { ProfileData } from '@/shared/types/profile';
import { createFormDataWithJson } from '@/shared/utils/formData';

export const updateProfile = async (formData: FormData) => {
    const token = getToken();
    const accountId = getAccountId();

    if (!token) throw new Error('인증 토큰이 없습니다.');
    if (!accountId) throw new Error('계정 ID가 없습니다.');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
    }
};

export const createProfileFormData = (data: ProfileData): FormData => {
    const accountId = getAccountId();
    const { nickname, type, age, gender, address, profileImage } = data;

    return createFormDataWithJson({
        requestKey: 'request',
        jsonData: {
            nickname,
            type,
            age,
            gender,
            address,
            accountId,
        },
        files: profileImage instanceof File ? [{ key: 'file', files: [profileImage] }] : undefined,
    });
};
