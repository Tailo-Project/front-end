import { useState } from 'react';
import { useForm } from 'react-hook-form';
import tailoLogo from '../assets/tailogo.svg';
import Toast from './Toast';
import { SignUpFormData, ToastState } from './form/types';
import ProfileImageUpload from './form/ProfileImageUpload';
import FormInput from './form/FormInput';
import BreedCombobox from './form/BreedCombobox';
import GenderRadioGroup from './form/GenderRadioGroup';

// 임시 품종 데이터
const initialBreeds = ['말티즈', '포메라니안', '치와와', '푸들', '시바견', '말라뮤트'];

export default function SignUpForm() {
    const [query, setQuery] = useState('');
    const [breeds, setBreeds] = useState(initialBreeds);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [showAddBreed, setShowAddBreed] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        show: false,
    });

    const {
        register,
        handleSubmit,
        formState: { isValid },
        setValue,
    } = useForm<SignUpFormData>({ mode: 'onChange' });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null) {
                    formData.append(key, value);
                }
            });

            const response = await fetch(`/api/auth/sign-up`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setToast({
                    message: '회원가입이 완료되었습니다!',
                    type: 'success',
                    show: true,
                });
                // 3초 후 메인 페이지로 이동
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('회원가입 처리 중 오류 발생:', error);
            setToast({
                message: '회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
                type: 'error',
                show: true,
            });
        }
    };

    return (
        <div className="flex flex-col items-start justify-start min-h-screen bg-white px-4 py-6">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast((prev) => ({ ...prev, show: false }))}
                />
            )}
            <h1 className="text-xl font-medium mb-8 flex items-center gap-2 mx-auto">
                회원가입 | <span className="text-blue-500">추가 정보를 입력해주세요.</span>
            </h1>

            <div className="w-full max-w-[320px] mx-auto">
                <div className="mb-8">
                    <img src={tailoLogo} alt="Tailo Logo" className="w-[140px] h-[140px] mx-auto" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        <ProfileImageUpload
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            setValue={setValue}
                        />

                        <FormInput
                            label="닉네임"
                            name="nickname"
                            register={register}
                            required
                            placeholder="반려동물의 프로필에 사용 될 닉네임을 적어주세요"
                        />

                        <FormInput
                            label="아이디"
                            name="userId"
                            register={register}
                            required
                            placeholder="사용하실 아이디를 적어주세요"
                        />

                        <FormInput
                            label="종류"
                            name="type"
                            register={register}
                            required
                            placeholder="ex) 강아지, 고양이, 햄스터"
                        />

                        <BreedCombobox
                            selectedBreed={selectedBreed}
                            setSelectedBreed={setSelectedBreed}
                            query={query}
                            setQuery={setQuery}
                            breeds={breeds}
                            setBreeds={setBreeds}
                            showAddBreed={showAddBreed}
                            setShowAddBreed={setShowAddBreed}
                            setValue={setValue}
                        />

                        <GenderRadioGroup register={register} />

                        <FormInput
                            label="나이"
                            name="age"
                            register={register}
                            required
                            placeholder="반려동물의 나이를 적어주세요"
                            suffix="세"
                        />

                        <FormInput
                            label="거주지"
                            name="location"
                            register={register}
                            required
                            placeholder="거주지를 적어주세요"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full h-[45px] rounded-xl text-white transition-all duration-300 ${
                            isValid
                                ? 'bg-[#FF785D] hover:bg-[#FF785D]/80 hover:shadow-md'
                                : 'bg-[#FFD1BA] cursor-not-allowed'
                        }`}
                    >
                        가입완료
                    </button>
                </form>
            </div>
        </div>
    );
}
