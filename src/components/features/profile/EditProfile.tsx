import { useRef, ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import defaultProfileImage from '@/assets/defaultImage.png';
import TabBar from '@/components/TabBar';
import Toast from '@/components/Toast';
import useToast from '@/hooks/useToast';
import GenderRadioGroup from '@/components/form/GenderRadioGroup';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '@/schema/profileSchema';

import { Gender } from '@/types';

import BreedCombobox from '@/components/form/BreedCombobox';

import { createProfileFormData, updateProfile } from '@/api/profile';
import { fetchWithToken } from '@/token';
import { MEMBER_API_URL } from '@/constants/apiUrl';
import { FormInput } from '@/components/form/FormInput';

interface ProfileResponse {
    nickname: string;
    breed: string;
    type: string;
    age: number;
    gender: Gender;
    address: string;
    profileImageUrl: string | File;
    isFollow: boolean;
    accountId: string;
}

const EditProfile = () => {
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [breeds, setBreeds] = useState<string[]>(['말티즈', '비숑', '푸들', '치와와', '포메라니안']); // 임시 데이터
    const [selectedBreed, setSelectedBreed] = useState('');
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

    const {
        register,
        handleSubmit: handleFormSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileFormData>({
        mode: 'onChange',
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nickname: '',
            breed: '',
            type: '',
            age: 0,
            gender: 'MALE' as Gender,
            address: '',
            profileImage: defaultProfileImage,
        },
    });

    const profileImage = watch('profileImage');

    const handleBreedChange = (breed: string) => {
        setSelectedBreed(breed);
        setValue('breed', breed);
    };

    const handleAddBreed = (newBreed: string) => {
        setBreeds((prev) => [...prev, newBreed]);
    };

    const updateFormFields = (profileData: ProfileResponse) => {
        const { breed, ...otherFields } = profileData;
        (
            Object.entries(otherFields) as [keyof Omit<ProfileFormData, 'profileImage' | 'breed'>, string | number][]
        ).forEach(([key, value]) => {
            setValue(key, value);
        });
        setSelectedBreed(breed);
        setValue('breed', breed);
        setValue('profileImage', profileData.profileImageUrl);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const profileData = await fetchWithToken(`${MEMBER_API_URL}`, {
                    method: 'GET',
                });
                const data = await profileData.json();
                updateFormFields(data.data);
            } catch (error) {
                console.error('프로필 조회 실패:', error);
                showToast('프로필 정보를 불러오는데 실패했습니다.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const checkImageSize = (file: File) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showToast(`이미지 크기는 ${maxSize / 1024 / 1024}MB 이하여야 합니다.`, 'error');
            return false;
        }
        return true;
    };

    const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];

            if (file && checkImageSize(file)) {
                setNewProfileImage(file);
            }
        } catch {
            showToast('이미지 업로드에 실패했습니다.', 'error');
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile(
                createProfileFormData({
                    ...data,
                    profileImage: newProfileImage || defaultProfileImage,
                }),
            );
            navigate('/profile', {
                state: { toast: { message: '프로필이 성공적으로 수정되었습니다.', type: 'success' } },
            });
        } catch {
            showToast('프로필 수정에 실패했습니다.', 'error');
        }
    };

    return (
        <>
            <div className="w-full max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto bg-white min-h-screen">
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FF785D] border-t-transparent" />
                            <span className="text-sm text-gray-500">프로필 불러오는 중...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-lg font-semibold text-gray-900">프로필 수정</h1>
                            <div className="w-6" />
                        </header>

                        <form onSubmit={handleFormSubmit(onSubmit)} className="p-6 space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden">
                                        <img
                                            src={
                                                newProfileImage
                                                    ? URL.createObjectURL(newProfileImage)
                                                    : typeof profileImage === 'string' && profileImage
                                                      ? profileImage
                                                      : defaultProfileImage
                                            }
                                            alt="프로필"
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={handleImageClick}
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
                                    onClick={handleImageClick}
                                    className="text-[#FF785D] text-base font-medium hover:text-[#FF785D]/80 transition-colors border border-[#FF785D] rounded-lg px-4 py-2"
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
                                    errorMessage={errors.type?.message}
                                />

                                <FormInput
                                    label="나이"
                                    name="age"
                                    register={register}
                                    required
                                    placeholder="나이를 입력해주세요"
                                    errorMessage={errors.age?.message}
                                    type="number"
                                />

                                <GenderRadioGroup register={register} name="gender" />

                                <FormInput
                                    label="주소"
                                    name="address"
                                    register={register}
                                    required
                                    placeholder="주소를 입력해주세요"
                                    errorMessage={errors.address?.message}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#FF785D] text-white rounded-lg text-sm font-medium
                                             hover:bg-[#FF785D]/80 focus:ring-2 focus:ring-[#FF785D] focus:ring-offset-2
                                             transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    저장하기
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <TabBar />
            {toast.show && (
                <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
            )}
        </>
    );
};

export default EditProfile;
