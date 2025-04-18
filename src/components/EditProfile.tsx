import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import tailogo from '../assets/tailogo.svg';
import TabBar from './TabBar';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

type Gender = 'MALE' | 'FEMALE';

interface ProfileData {
    nickname: string;
    bio: string;
    profileImage: string;
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

// 성별 선택 컴포넌트
const GenderSelect: React.FC<{
    value: Gender;
    onChange: (value: Gender) => void;
}> = ({ value, onChange }) => (
    <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
        <div className="flex gap-4">
            {[
                { value: 'male', label: '남' },
                { value: 'female', label: '여' },
            ].map((option) => (
                <label key={option.value} className="flex items-center">
                    <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value as Gender)}
                        className="mr-2"
                    />
                    <span className="text-sm">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);

const EditProfile = () => {
    const { toast, showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileData, setProfileData] = useState<ProfileData>(INITIAL_PROFILE_DATA);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData((prev) => ({
                    ...prev,
                    profileImage: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
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
                    <h1 className="text-lg font-semibold">프로필 수정</h1>
                    <button onClick={handleSubmit} className="text-blue-500 font-semibold">
                        완료
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-4">
                    {/* 프로필 이미지 */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={profileData.profileImage}
                                    alt="프로필"
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={handleImageClick}
                                />
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
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
                            placeholder="반려동물의 품종을 입력하세요"
                        />

                        <FormField
                            label="나이"
                            value={profileData.petAge}
                            onChange={updateField('petAge')}
                            placeholder="반려동물의 나이를 입력하세요"
                            type="number"
                            min="0"
                        />

                        <GenderSelect
                            value={profileData.petGender}
                            onChange={(value) => updateField('petGender')(value)}
                        />

                        <FormField
                            label="주소"
                            value={profileData.address}
                            onChange={updateField('address')}
                            placeholder="주소를 입력하세요"
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
