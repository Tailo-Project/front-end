import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import tailogo from '../assets/tailogo.svg';
import TabBar from './TabBar';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

import GenderRadioGroup from '@/components/form/GenderRadioGroup';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/form/FormInput';

type Gender = 'MALE' | 'FEMALE';

interface ProfileData {
    nickname: string;
    bio: string;
    profileImage: string | File;
    petType: string;
    petAge: string;
    petGender: Gender;
    address: string;
}

interface FormFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    maxLength?: number;
    type?: string;
    min?: string;
}

// 상수
const MAX_NICKNAME_LENGTH = 10;
const MAX_BIO_LENGTH = 150;
const INITIAL_PROFILE_DATA: ProfileData = {
    nickname: '멍멍이맘',
    bio: '반려동물과 함께하는 일상을 공유해요 🐶',
    profileImage: tailogo,
    petType: '말티즈',
    petAge: '2',
    petGender: 'MALE',
    address: '서울시 강남구',
};

// 재사용 가능한 폼 필드 컴포넌트
const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    maxLength,
    type = 'text',
    min,
}) => (
    <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {maxLength && (
                <span className="text-xs text-gray-400">
                    {value.length}/{maxLength}
                </span>
            )}
        </div>
        {type === 'textarea' ? (
            <textarea
                value={value}
                onChange={(e) => {
                    if (!maxLength || e.target.value.length <= maxLength) {
                        onChange(e.target.value);
                    }
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none text-sm"
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => {
                    if (!maxLength || e.target.value.length <= maxLength) {
                        onChange(e.target.value);
                    }
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder={placeholder}
                min={min}
            />
        )}
    </div>
);

const EditProfile = () => {
    const { register } = useForm({ mode: 'onChange', defaultValues: INITIAL_PROFILE_DATA });
    const { toast, showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileData, setProfileData] = useState<ProfileData>(INITIAL_PROFILE_DATA);

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
                    setProfileData((prev) => ({ ...prev, profileImage }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const createFormDataWithJson = (data: ProfileData) => {
        const { nickname, bio, petType, petAge, petGender, address } = data;
        const formData = new FormData();
        const jsonData = {
            nickname,
            bio,
            petType,
            petAge,
            petGender,
            address,
        };
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        formData.append('request', blob);

        if (data.profileImage instanceof File) formData.append('file', data.profileImage);

        return formData;
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = createFormDataWithJson(profileData);
            await fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData,
            });

            showToast('프로필 수정 완료', 'success');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (error) {
            console.error('프로필 수정 실패', error);
            showToast('프로필 수정에 실패했습니다.', 'error');
        }
    };

    const updateField = (field: keyof ProfileData) => (value: string) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
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

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={
                                        profileData.profileImage instanceof File
                                            ? URL.createObjectURL(profileData.profileImage)
                                            : profileData.profileImage
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
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <button type="button" onClick={handleImageClick} className="text-blue-500 text-sm font-medium">
                            프로필 사진 변경
                        </button>
                    </div>

                    <FormField
                        label="닉네임"
                        value={profileData.nickname}
                        onChange={updateField('nickname')}
                        placeholder="닉네임을 입력하세요"
                        maxLength={MAX_NICKNAME_LENGTH}
                    />

                    <FormField
                        label="소개"
                        value={profileData.bio}
                        onChange={updateField('bio')}
                        placeholder="자기소개를 입력하세요"
                        maxLength={MAX_BIO_LENGTH}
                        type="textarea"
                    />

                    <div className="mb-2">
                        <h2 className="text-lg font-semibold mb-4">반려동물 정보</h2>

                        <FormField
                            label="품종"
                            value={profileData.petType}
                            onChange={updateField('petType')}
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

                        <FormField
                            label="주소"
                            value={profileData.address}
                            onChange={updateField('address')}
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
