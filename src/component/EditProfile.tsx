import React, { useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import defaultProfileImage from '../assets/defaultImage.png';
import TabBar from './TabBar';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';
import { useProfileImage } from '../hooks/useProfileImage';
import GenderRadioGroup from '@/components/form/GenderRadioGroup';
import FormInput from '@/components/form/FormInput';
import { ProfileData } from '../types/profile';
import { updateProfile, createProfileFormData } from '../api/profile';

// 상수
const MAX_NICKNAME_LENGTH = 10;
const MAX_BIO_LENGTH = 150;
const INITIAL_PROFILE_DATA: ProfileData = {
    nickname: '멍멍이맘',
    bio: '반려동물과 함께하는 일상을 공유해요 🐶',
    profileImage: defaultProfileImage,
    petType: '말티즈',
    petAge: '2',
    petGender: 'MALE',
    address: '서울시 강남구',
};

const EditProfile = () => {
    const { register, handleSubmit: handleFormSubmit } = useForm<ProfileData>({
        mode: 'onChange',
        defaultValues: INITIAL_PROFILE_DATA,
    });
    const { toast, showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { imageUrl, profileImage, handleImageChange } = useProfileImage(INITIAL_PROFILE_DATA.profileImage);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (file) {
                handleImageChange(file);
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            }
        }
    };

    const onSubmit = async (data: ProfileData) => {
        try {
            const formData = createProfileFormData({ ...data, profileImage });
            await updateProfile(formData);
            showToast('프로필 수정 완료', 'success');

            const navigationTimeout = setTimeout(() => {
                navigate('/profile');
            }, 1500);

            return () => clearTimeout(navigationTimeout);
        } catch (error) {
            console.error('프로필 수정 실패', error);
            showToast('프로필 수정에 실패했습니다.', 'error');
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

                <form onSubmit={handleFormSubmit(onSubmit)} className="p-4">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
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
                        <button type="button" onClick={handleImageClick} className="text-blue-500 text-sm font-medium">
                            프로필 사진 변경
                        </button>
                    </div>

                    <FormInput
                        label="닉네임"
                        name="nickname"
                        register={register}
                        required
                        maxLength={MAX_NICKNAME_LENGTH}
                        placeholder="닉네임을 입력하세요"
                    />

                    <FormInput
                        label="소개"
                        name="bio"
                        register={register}
                        required
                        maxLength={MAX_BIO_LENGTH}
                        placeholder="자기소개를 입력하세요"
                        type="textarea"
                    />

                    <div className="mb-2">
                        <FormInput
                            label="품종"
                            name="petType"
                            register={register}
                            required
                            placeholder="품종을 입력해주세요."
                        />

                        <FormInput
                            label="나이"
                            name="petAge"
                            register={register}
                            required
                            placeholder="나이를 입력해주세요."
                            suffix="세"
                        />

                        <GenderRadioGroup register={register} name="petGender" />

                        <FormInput
                            label="주소"
                            name="address"
                            register={register}
                            required
                            placeholder="주소를 입력해주세요."
                        />
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
