import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/defaultImage.png';

import ProfileImageUpload from '@/ui/components/form/ProfileImageUpload';
import FormInput from '@/ui/components/form/FormInput';
import BreedCombobox from '@/ui/components/form/BreedCombobox';
import GenderRadioGroup from '@/ui/components/form/GenderRadioGroup';
import { createFormDataWithJson } from '@/shared/utils/formData';
import { setToken, setAccountId } from '@/shared/utils/auth';
import Toast from '@/ui/components/ui/Toast';
import { SignUpFormData, ToastState } from '@/ui/components/form/types';

const INITIAL_BREEDS = ['말티즈', '포메라니안', '치와와', '푸들', '시바견', '말라뮤트'];

interface LocationState {
    email?: string;
}

const SignUpForm = () => {
    const location = useLocation();
    const email = (location.state as LocationState)?.email;

    const [breeds, setBreeds] = useState(INITIAL_BREEDS);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isCheckingId, setIsCheckingId] = useState(false);
    const [idCheckStatus, setIdCheckStatus] = useState<number | null>(null);
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        show: false,
    });
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { isValid },
        setValue,
        watch,
    } = useForm<SignUpFormData>({
        mode: 'onChange',
        defaultValues: {
            email,
            gender: 'MALE',
        },
    });

    const accountId = watch('accountId');

    useEffect(() => {
        setIdCheckStatus(null);
    }, [accountId]);

    const showToastMessage = (message: string, type: ToastState['type']) => {
        setToast({
            message,
            type,
            show: true,
        });
    };

    const checkAccountIdDuplicate = async () => {
        if (!accountId) {
            showToastMessage('아이디를 입력해주세요.', 'error');
            return;
        }

        setIsCheckingId(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/member/duplicate/${accountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setIdCheckStatus(data.statusCode);

            showToastMessage(
                data.statusCode === 200 ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.',
                data.statusCode === 200 ? 'success' : 'error',
            );
        } catch (error) {
            showToastMessage(error instanceof Error ? error.message : '중복 확인 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsCheckingId(false);
        }
    };

    const onSubmit = async (data: SignUpFormData) => {
        const { email, nickname, accountId, type, breed, gender, age, address, profileImage } = data;
        if (idCheckStatus !== 200) {
            showToastMessage('아이디 중복 확인을 해주세요.', 'error');
            return;
        }

        try {
            const formData = createFormDataWithJson({
                requestKey: 'request',
                jsonData: { email, nickname, accountId, type, breed, gender, age, address },
                files: profileImage ? [{ key: 'profileImage', files: [profileImage] }] : undefined,
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-up`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.accessToken && data.accountId) {
                setToken(data.accessToken);
                setAccountId(data.accountId);
                showToastMessage('회원가입이 완료되었습니다.', 'success');
                navigate('/');
            } else {
                throw new Error('회원가입 응답에 필요한 데이터가 없습니다.');
            }
        } catch (error) {
            if (error instanceof Error) {
                showToastMessage(error.message, 'error');
            }
        }
    };

    const handleAddBreed = (newBreed: string) => {
        setBreeds((prev) => [...prev, newBreed]);
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
                    <img src={defaultProfileImage} alt="Tailo Logo" className="w-[140px] h-[140px] mx-auto" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        <ProfileImageUpload
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            setValue={setValue}
                        />

                        <FormInput
                            label="이메일"
                            name="email"
                            register={register}
                            required
                            placeholder="이메일을 입력해주세요"
                            disabled
                        />

                        <FormInput
                            label="닉네임"
                            name="nickname"
                            register={register}
                            required
                            placeholder="닉네임을 입력해주세요."
                        />

                        <FormInput
                            label="아이디"
                            name="accountId"
                            register={register}
                            required
                            placeholder="아이디를 입력해주세요."
                            rightElement={
                                <button
                                    type="button"
                                    onClick={checkAccountIdDuplicate}
                                    disabled={isCheckingId || !accountId}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300
                            ${
                                idCheckStatus === 200
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            } ${isCheckingId ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    {isCheckingId ? '확인 중...' : idCheckStatus === 200 ? '확인 완료' : '중복 확인'}
                                </button>
                            }
                        />

                        <FormInput
                            label="종류"
                            name="type"
                            register={register}
                            required
                            placeholder="ex) 강아지, 고양이, 햄스터"
                        />

                        <BreedCombobox
                            value={selectedBreed}
                            onChange={setSelectedBreed}
                            breeds={breeds}
                            onAddBreed={handleAddBreed}
                        />

                        <GenderRadioGroup register={register} name="gender" />

                        <FormInput
                            label="나이"
                            name="age"
                            register={register}
                            required
                            placeholder="나이를 입력해주세요."
                            suffix="세"
                        />

                        <FormInput
                            label="거주지"
                            name="address"
                            register={register}
                            required
                            placeholder="거주지를 입력해주세요."
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
};

export default SignUpForm;
