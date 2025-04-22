import { getAccountId } from '@/utils/auth';
import { ProfileData } from '../types/profile';
import { createFormDataWithJson } from '@/utils/formData';
import { fetchApi } from '@/utils/api';

export const updateProfile = async (formData: FormData): Promise<void> => {
    await fetchApi('/api/member', {
        method: 'PATCH',
        body: formData,
    });
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
