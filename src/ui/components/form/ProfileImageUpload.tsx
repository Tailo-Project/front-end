import { PlusIcon } from '@heroicons/react/24/outline';
import { UseFormSetValue } from 'react-hook-form';
import { SignUpFormData } from './types';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/ui/components/ui/Toast';

interface ProfileImageUploadProps {
    profileImage: string | null;
    setProfileImage: (image: string | null) => void;
    setValue: UseFormSetValue<SignUpFormData>;
}

const ProfileImageUpload = ({ profileImage, setProfileImage, setValue }: ProfileImageUploadProps) => {
    const { showToast, toast } = useToast();
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.size > 8 * 1024 * 1024) {
            showToast('최대 8MB의 이미지를 업로드 해주세요.', 'error');
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setProfileImage(reader.result);
                    setValue('profileImage', file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <p className="text-sm font-medium mb-2">프로필 사진</p>
            <div className="relative w-[100px] h-[100px] mx-auto">
                <input
                    type="file"
                    accept="image/jpg, image/png"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profileImage"
                />
                <label
                    htmlFor="profileImage"
                    className="block w-full h-full rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
                >
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <PlusIcon className="w-6 h-6" />
                        </div>
                    )}
                </label>
                {toast.show && (
                    <Toast message={toast.message} type={toast.type} onClose={() => showToast('', toast.type, 0)} />
                )}
            </div>
        </div>
    );
};

export default ProfileImageUpload;
