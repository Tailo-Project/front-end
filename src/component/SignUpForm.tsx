import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import tailoLogo from '../assets/tailogo.svg';
import Toast from './Toast';
import { SignUpFormData, ToastState } from '../components/form/types';
import ProfileImageUpload from '../components/form/ProfileImageUpload';
import FormInput from '../components/form/FormInput';
import BreedCombobox from '../components/form/BreedCombobox';
import GenderRadioGroup from '../components/form/GenderRadioGroup';

const INITIAL_BREEDS = ['말티즈', '포메라니안', '치와와', '푸들', '시바견', '말라뮤트'];

interface SignUpFormProps {
    email: string;
}

interface ToastConfig {
    message: string;
    type: 'success' | 'error';
}

const SignUpForm = ({ email }: SignUpFormProps) => {
    const [query, setQuery] = useState('');
    const [breeds, setBreeds] = useState(INITIAL_BREEDS);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [showAddBreed, setShowAddBreed] = useState(false);
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
        defaultValues: { email },
    });

    const accountId = watch('accountId');

    useEffect(() => {
        setIdCheckStatus(null);
    }, [accountId]);

    const showToastMessage = ({ message, type }: ToastConfig) => {
        setToast({
            message,
            type,
            show: true,
        });
    };

    const createFormDataWithJson = (data: SignUpFormData) => {
        const { email, nickname, accountId, type, breed, gender, age, address } = data;
        const formData = new FormData();
        const jsonData = {
            email,
            nickname,
            accountId,
            type,
            breed,
            gender,
            age,
            address,
        };

        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        formData.append('request', blob);

        if (data.file) formData.append('file', data.file);

        return formData;
    };

    const checkAccountIdDuplicate = async () => {
        if (!accountId) {
            showToastMessage({
                message: '아이디를 입력해주세요.',
                type: 'error',
            });
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

            showToastMessage({
                message: data.statusCode === 200 ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.',
                type: data.statusCode === 200 ? 'success' : 'error',
            });
        } catch (error) {
            showToastMessage({
                message: error instanceof Error ? error.message : '중복 확인 중 오류가 발생했습니다.',
                type: 'error',
            });
        } finally {
            setIsCheckingId(false);
        }
    };

    const onSubmit = async (data: SignUpFormData) => {
        if (idCheckStatus !== 200) {
            showToastMessage({
                message: '아이디 중복 확인을 해주세요.',
                type: 'error',
            });
            return;
        }

        try {
            const formData = createFormDataWithJson(data);

            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-up`, {
                method: 'POST',
                body: formData,
            });
            navigate('/login');
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
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
