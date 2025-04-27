import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/defaultImage.png';

import ProfileImageUpload from '@/components/form/ProfileImageUpload';
import BreedCombobox from '@/components/form/BreedCombobox';
import GenderRadioGroup from '@/components/form/GenderRadioGroup';
import { createFormDataWithJson } from '@/utils/formData';
import { setToken, setAccountId } from '@/utils/auth';
import Toast from '@/components/Toast';
import { SignUpFormData, ToastState } from '@/types';
import useToast from '@/hooks/useToast';
import { AUTH_API_URL, MEMBER_API_URL } from '@/constants/apiUrl';
import { fetchWithToken } from '@/token';
import { FormInput } from '@/components/form/FormInput';

const INITIAL_BREEDS = ['말티즈', '포메라니안', '치와와', '푸들', '시바견', '말라뮤트'];

interface LocationState {
    email?: string;
}

const SignUpForm = () => {
    const location = useLocation();
    const email = (location.state as LocationState)?.email;

    const [selectedBreed, setSelectedBreed] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isCheckingId, setIsCheckingId] = useState(false);
    const [idCheckStatus, setIdCheckStatus] = useState<number | null>(null);
    const { toast, showToast } = useToast();
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
            breed: '',
        },
    });

    const accountId = watch('accountId');

    useEffect(() => {
        setIdCheckStatus(null);
    }, [accountId]);

    useEffect(() => {
        if (selectedBreed) {
            setValue('breed', selectedBreed);
        }
    }, [selectedBreed, setValue]);

    const showToastMessage = (message: string, type: ToastState['type']) => {
        showToast(message, type);
    };

    const checkAccountIdDuplicate = async () => {
        if (!accountId) {
            showToastMessage('아이디를 입력해주세요.', 'error');
            return;
        }

        setIsCheckingId(true);
        try {
            const response = await fetchWithToken(`${MEMBER_API_URL}/duplicate/${accountId}`, {});

            const data = await response.json();
            setIdCheckStatus(data.statusCode);

            const message = data.statusCode === 200 ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.';

            showToastMessage(message, data.statusCode === 200 ? 'success' : 'error');
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

            const response = await fetchWithToken(`${AUTH_API_URL}/sign-up`, {
                method: 'POST',
                body: formData,
            });

            const { data } = await response.json();

            if (data.accessToken && data.accountId) {
                setToken(data.accessToken);
                setAccountId(data.accountId);
                showToast('회원가입이 완료되었습니다.', 'success');
                navigate('/');
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            }
        }
    };

    return (
        <div className="flex flex-col items-start justify-start min-h-screen bg-white px-4 py-6">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => showToast('', 'success')} />}
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
                            onChange={(breed) => {
                                setSelectedBreed(breed);
                                setValue('breed', breed);
                            }}
                            breeds={INITIAL_BREEDS}
                            onAddBreed={(newBreed) => {
                                setValue('breed', newBreed);
                            }}
                        />

                        <GenderRadioGroup register={register} name="gender" />

                        <FormInput
                            label="나이"
                            name="age"
                            register={register}
                            required
                            placeholder="나이를 입력해주세요."
                            rightElement={<span className="text-gray-500">세</span>}
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
