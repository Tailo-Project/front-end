import { getAccountId, getToken } from '@/utils/auth';
import { ProfileData } from '@/shared/types/profile';
import { createFormDataWithJson } from '@/utils/formData';
import { MEMBER_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';

export const updateProfile = async (formData: FormData) => {
    const token = getToken();
    const accountId = getAccountId();

    if (!token) throw new Error('인증 토큰이 없습니다.');
    if (!accountId) throw new Error('계정 ID가 없습니다.');

    const response = await fetchWithToken(`${MEMBER_API_URL}`, {
        method: 'PATCH',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
    }
};

export const createProfileFormData = (data: ProfileData): FormData => {
    const accountId = getAccountId();
    const { nickname, type, age, gender, address, profileImage, breed } = data;

    return createFormDataWithJson({
        requestKey: 'request',
        jsonData: {
            nickname,
            type,
            age,
            gender,
            address,
            accountId,
            breed,
        },
        files: profileImage instanceof File ? [{ key: 'profileImage', files: [profileImage] }] : undefined,
    });
};
