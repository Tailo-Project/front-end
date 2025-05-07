import { z } from 'zod';

export const signUpSchema = z.object({
    email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
    nickname: z.string().min(1, { message: '닉네임을 입력해주세요.' }),
    accountId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
    type: z.string().min(1, { message: '종류를 입력해주세요.' }),
    breed: z.string().min(1, { message: '종류를 입력해주세요.' }),
    gender: z.enum(['MALE', 'FEMALE'], { message: '성별을 선택해주세요.' }),
    age: z.number().min(1, { message: '나이를 입력해주세요.' }),
    address: z.string().min(1, { message: '거주지를 입력해주세요.' }),
    profileImage: z.instanceof(File),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
