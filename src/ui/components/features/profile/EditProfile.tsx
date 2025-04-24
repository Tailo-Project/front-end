import { useRef, ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import defaultProfileImage from '@/assets/defaultImage.png';
import TabBar from '@/ui/components/ui/TabBar';
import Toast from '@/ui/components/ui/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { useProfileImage } from '@/shared/hooks/useProfileImage';
import GenderRadioGroup from '@/ui/components/form/GenderRadioGroup';
import { Gender, ProfileData } from '@/shared/types/profile';
import BreedCombobox from '@/ui/components/form/BreedCombobox';
import { createProfileFormData, updateProfile } from '@/core/api/profile';
import { fetchWithToken } from '@/token';
import { BASE_API_URL } from '@/shared/constants/apiUrl';
import { FormInput } from '@/ui/components/form/FormInput';

interface ProfileResponse {
    data: {
        nickname: string;
        breed: string;
        type: string;
        age: number;
        gender: Gender;
        address: string;
        profileImageUrl: string | null;
        isFollow: boolean;
        accountId: string;
    };
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EditProfile = () => {
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [breeds] = useState<string[]>(['말티즈', '비숑', '푸들', '치와와', '포메라니안']);
    const [selectedBreed, setSelectedBreed] = useState('');
    const { imageUrl, profileImage, handleImageChange } = useProfileImage(defaultProfileImage);

    const {
        register,
        handleSubmit: handleFormSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ProfileData>({
        mode: 'onChange',
        defaultValues: {
            nickname: '',
            breed: '',
            type: '',
            age: undefined,
            gender: undefined,
            address: '',
        },
    });

    const handleBreedChange = (breed: string) => {
        setSelectedBreed(breed);
        setValue('breed', breed);
    };

    const handleAddBreed = (newBreed: string) => {
        breeds.push(newBreed);
        handleBreedChange(newBreed);
    };

    const validateImage = (file: File): boolean => {
        if (file.size > MAX_IMAGE_SIZE) {
            showToast('이미지 크기는 5MB 이하여야 합니다.', 'error');
            return false;
        }

        return true;
    };

    const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && validateImage(file)) {
            try {
                handleImageChange(file);
            } catch {
                showToast('이미지 업로드에 실패했습니다.', 'error');
            }
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithToken(`${BASE_API_URL}/member`, {});

                if (!response.ok) {
                    throw new Error('프로필 조회에 실패했습니다');
                }

                const profileData: ProfileResponse = await response.json();

                const {
                    data: { nickname, breed, type, age, gender, address, profileImageUrl },
                } = profileData;

                reset({ nickname, breed, type, age, gender, address });

                setSelectedBreed(breed);

                if (profileImageUrl && profileImageUrl !== 'null') {
                    handleImageChange(profileImageUrl);
                }
            } catch (error) {
                console.error('프로필 조회 실패:', error);
                showToast('프로필 정보를 불러오는데 실패했습니다.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const onSubmit = async (data: ProfileData) => {
        try {
            await updateProfile(createProfileFormData({ ...data, profileImage }));
            navigate('/profile', {
                state: { toast: { message: '프로필이 성공적으로 수정되었습니다.', type: 'success' } },
            });
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            showToast('프로필 수정에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                    <span className="text-sm text-gray-500">프로필 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen">
                <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">프로필 수정</h1>
                    <div className="w-6" />
                </header>

                <form onSubmit={handleFormSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-3">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                                <img
                                    src={imageUrl ?? defaultProfileImage}
                                    alt="프로필"
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleImageInputChange}
                                className="hidden"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            프로필 사진 변경
                        </button>
                    </div>

                    <div className="space-y-4">
                        <FormInput
                            label="닉네임"
                            name="nickname"
                            register={register}
                            required
                            placeholder="닉네임을 입력하세요"
                            errorMessage={errors.nickname?.message}
                        />

                        <BreedCombobox
                            value={selectedBreed}
                            onChange={handleBreedChange}
                            breeds={breeds}
                            onAddBreed={handleAddBreed}
                        />

                        <FormInput
                            label="타입"
                            name="type"
                            register={register}
                            required
                            placeholder="타입을 입력해주세요"
                        />

                        <FormInput
                            label="나이"
                            name="age"
                            register={register}
                            required
                            placeholder="나이를 입력해주세요"
                            rightElement={<span className="text-gray-500">세</span>}
                            type="number"
                            min={0}
                        />

                        <GenderRadioGroup name="gender" register={register} />

                        <FormInput
                            label="주소"
                            name="address"
                            register={register}
                            required
                            placeholder="주소를 입력해주세요"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white rounded-lg text-sm font-medium
                                     hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                     transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            저장하기
                        </button>
                    </div>
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
