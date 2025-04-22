import React, { useRef, ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import defaultProfileImage from '../assets/defaultImage.png';
import TabBar from './TabBar';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';
import { useProfileImage } from '../hooks/useProfileImage';
import GenderRadioGroup from '@/components/form/GenderRadioGroup';
import FormInput from '@/components/form/FormInput';
import { Gender, ProfileData } from '../types/profile';
import { updateProfile, createProfileFormData } from '../api/profile';
import { fetchApi } from '@/utils/api';
import BreedCombobox from '@/components/form/BreedCombobox';

interface ProfileResponse {
    nickname: string;
    breed: string;
    type: string;
    age: number;
    gender: Gender;
    address: string;
    profileImageUrl: string | null;
    isFollow: boolean;
    accountId: string;
}

const EditProfile = () => {
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { imageUrl, profileImage, handleImageChange } = useProfileImage(defaultProfileImage);
    const [isLoading, setIsLoading] = useState(true);
    const [breeds, setBreeds] = useState<string[]>(['말티즈', '비숑', '푸들', '치와와', '포메라니안']); // 임시 데이터
    const [selectedBreed, setSelectedBreed] = useState('');

    const {
        register,
        handleSubmit: handleFormSubmit,
        setValue,
    } = useForm<ProfileData>({
        mode: 'onChange',
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

    const handleBreedChange = (breed: string) => {
        setSelectedBreed(breed);
        setValue('breed', breed);
    };

    const handleAddBreed = (newBreed: string) => {
        setBreeds((prev) => [...prev, newBreed]);
    };

    const updateProfileImage = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            handleImageChange(new File([blob], 'profile.jpg', { type: 'image/jpeg' }));
        } catch {
            showToast('프로필 이미지를 불러오는데 실패했습니다.', 'error');
        }
    };

    const updateFormFields = (profileData: ProfileResponse) => {
        const { breed, profileImageUrl, ...otherFields } = profileData;
        (Object.entries(otherFields) as [keyof Omit<ProfileData, 'profileImage' | 'breed'>, string | number][]).forEach(
            ([key, value]) => {
                setValue(key, value);
            },
        );
        setSelectedBreed(breed);
        setValue('breed', breed);
        setValue('profileImage', profileImageUrl || defaultProfileImage);
        return profileImageUrl;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const profileData = await fetchApi<ProfileResponse>('/api/member');

                const profileImageUrl = updateFormFields(profileData);

                if (profileImageUrl) {
                    await updateProfileImage(profileImageUrl);
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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (file) {
                handleImageChange(file);
            }
        } catch {
            showToast('이미지 업로드에 실패했습니다.', 'error');
        }
    };

    const onSubmit = async (data: ProfileData) => {
        try {
            const { nickname, breed, type, age, gender, address } = data;
            if (!nickname || !breed || !type || !age || !gender || !address) {
                showToast('모든 필드를 입력해주세요.', 'error');
                return;
            }
            const formData = createProfileFormData({ ...data, profileImage });
            await updateProfile(formData);
            showToast('프로필 수정 완료', 'success');

            const navigationTimeout = setTimeout(() => {
                navigate('/profile');
            }, 1500);

            return () => clearTimeout(navigationTimeout);
        } catch {
            showToast('프로필 수정에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    };

    return (
        <>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen">
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
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
                            <div className="w-6" /> {/* 헤더 중앙 정렬을 위한 더미 div */}
                        </header>

                        <form onSubmit={handleFormSubmit(onSubmit)} className="p-6 space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="relative mb-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                                        <img
                                            src={imageUrl || defaultProfileImage}
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
                                    suffix="세"
                                />

                                <GenderRadioGroup register={register} name="gender" />

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
