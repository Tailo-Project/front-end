import { UseFormRegister } from 'react-hook-form';
import { SignUpFormData } from './types';

interface GenderRadioGroupProps {
    register: UseFormRegister<SignUpFormData>;
}

const GenderRadioGroup = ({ register }: GenderRadioGroupProps) => {
    return (
        <div className="mb-2">
            <label className="text-sm font-medium text-gray-700">성별</label>
            <div className="mt-2 flex gap-4">
                <label className="flex items-center">
                    <input type="radio" {...register('gender')} value="MALE" className="mr-2" />
                    <span>남자</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" {...register('gender')} value="FEMALE" className="mr-2" />
                    <span>여자</span>
                </label>
            </div>
        </div>
    );
};

export default GenderRadioGroup;
