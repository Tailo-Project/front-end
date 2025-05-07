import { z } from 'zod';

export const profileSchema = z.object({
    nickname: z
        .string()
        .min(1, { message: '닉네임을 입력해주세요.' })
        .max(10, { message: '닉네임은 10자 이하로 입력해주세요.' }),
    breed: z
        .string()
        .min(1, { message: '견종을 입력해주세요.' })
        .max(10, { message: '견종은 10자 이하로 입력해주세요.' }),
    type: z
        .string()
        .min(1, { message: '타입을 입력해주세요.' })
        .max(10, { message: '타입은 10자 이하로 입력해주세요.' }),
    age: z
        .union([z.string(), z.number()])
        .transform(Number)
        .refine((val) => !isNaN(val), { message: '올바른 형식의 나이를 입력해주세요.' })
        .refine((val) => val > 0, { message: '나이는 0 이상의 숫자로 입력해주세요.' }),
    gender: z.enum(['MALE', 'FEMALE'], { message: '성별을 선택해주세요.' }),
    address: z
        .string()
        .min(1, { message: '주소를 입력해주세요.' })
        .max(100, { message: '주소는 100자 이하로 입력해주세요.' }),
    profileImage: z.union([
        z.string(),
        z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
            message: '프로필 이미지는 5MB 이하의 파일만 가능합니다.',
        }),
    ]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
