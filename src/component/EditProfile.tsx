import { useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import tailogo from '../assets/tailogo.svg';
import TabBar from './TabBar';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';
import GenderSelect from '@/components/common/GenderSelect';
import FormField from './FormField';

const MAX_NICKNAME_LENGTH = 10;
const MAX_BIO_LENGTH = 150;

interface ProfileData {
    nickname: string;
    bio: string;
    profileImage: string;
    petType: string;
    petAge: number;
    petGender: 'MALE' | 'FEMALE';
    address: string;
}

const INITIAL_PROFILE_DATA: ProfileData = {
    nickname: '멍멍이맘',
    bio: '반려동물과 함께하는 일상을 공유해요 🐶',
    profileImage: tailogo,
    petType: '말티즈',
    petAge: 2,
    petGender: 'MALE',
    address: '서울시 강남구',
};

const EditProfile = () => {
    const { toast, showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProfileData>({
        defaultValues: INITIAL_PROFILE_DATA,
    });

    const profileImage = watch('profileImage');

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const maxSize = 1024 * 1024 * 5; // 5MB
            if (file.size > maxSize) {
                showToast('최대 5MB의 이미지를 업로드할 수 있습니다.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const profileImage = reader.result;
                if (profileImage && typeof profileImage === 'string') {
                    setValue('profileImage', profileImage);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                showToast('프로필 수정에 실패했습니다.', 'error');
                return;
            }

            showToast('프로필 수정 완료', 'success');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (error) {
            console.error('프로필 수정 실패', error);
            showToast(error instanceof Error ? error.message : '프로필 수정에 실패했습니다.', 'error');
        }
    };

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen">
                <header className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button onClick={() => navigate(-1)} className="text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-center w-full">프로필 수정</h1>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={profileImage}
                                    alt="프로필"
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={handleImageClick}
                                />
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <button type="button" onClick={handleImageClick} className="text-blue-500 text-sm font-medium">
                            프로필 사진 변경
                        </button>
                    </div>

                    <FormField label="닉네임" error={errors.nickname?.message}>
                        <input
                            {...register('nickname', {
                                required: '닉네임을 입력해주세요',
                                maxLength: {
                                    value: MAX_NICKNAME_LENGTH,
                                    message: `닉네임은 최대 ${MAX_NICKNAME_LENGTH}자까지 입력 가능합니다`,
                                },
                            })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            placeholder="닉네임을 입력하세요"
                        />
                    </FormField>

                    <FormField label="소개" error={errors.bio?.message}>
                        <textarea
                            {...register('bio', {
                                maxLength: {
                                    value: MAX_BIO_LENGTH,
                                    message: `소개는 최대 ${MAX_BIO_LENGTH}자까지 입력 가능합니다`,
                                },
                            })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none text-sm"
                            placeholder="자기소개를 입력하세요"
                        />
                    </FormField>

                    <div className="mb-2">
                        <h2 className="text-lg font-semibold mb-4">반려동물 정보</h2>

                        <FormField label="품종" error={errors.petType?.message}>
                            <input
                                {...register('petType', {
                                    required: '반려동물의 품종을 입력해주세요',
                                })}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                placeholder="반려동물의 품종을 입력하세요"
                            />
                        </FormField>

                        <FormField label="나이" error={errors.petAge?.message}>
                            <input
                                {...register('petAge', {
                                    required: '반려동물의 나이를 입력해주세요',
                                    min: {
                                        value: 0,
                                        message: '0세 이상 입력해주세요',
                                    },
                                })}
                                type="number"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                placeholder="반려동물의 나이를 입력하세요"
                            />
                        </FormField>

                        <FormField label="성별" error={errors.petGender?.message}>
                            <GenderSelect
                                label="성별"
                                value={watch('petGender')}
                                onChange={(value) => setValue('petGender', value)}
                            />
                        </FormField>

                        <FormField label="주소" error={errors.address?.message}>
                            <input
                                {...register('address', {
                                    required: '주소를 입력해주세요',
                                })}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                placeholder="주소를 입력하세요"
                            />
                        </FormField>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium mb-4"
                    >
                        저장하기
                    </button>
                </form>
            </div>
            <TabBar />
            {toast.show && (
                <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
            )}
        </>
    );
};

export default EditProfile;
