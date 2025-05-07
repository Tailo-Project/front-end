import { z } from 'zod';

export const profileSchema = z.object({
    nickname: z.string().min(1, { message: '닉네임을 입력해주세요.' }),
    breed: z.string().min(1, { message: '견종을 입력해주세요.' }),
    type: z.string().min(1, { message: '타입을 입력해주세요.' }),
    age: z.number().min(1, { message: '나이를 입력해주세요.' }),
    gender: z.enum(['MALE', 'FEMALE'], { message: '성별을 선택해주세요.' }),
    address: z.string().min(1, { message: '주소를 입력해주세요.' }),
    profileImage: z.any().refine(
        (file) => {
            if (typeof file === 'string') return true;
            if (file instanceof File) return file.size <= 5 * 1024 * 1024;
            return false;
        },
        { message: '프로필 이미지는 5MB 이하의 파일만 가능합니다.' },
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
