import { UseFormRegister } from 'react-hook-form';
import { SignUpFormData } from './types';

interface GenderRadioGroupProps {
    register: UseFormRegister<SignUpFormData>;
}

export default function GenderRadioGroup({ register }: GenderRadioGroupProps) {
    return (
        <div className="flex items-center gap-3">
            <label className="text-sm font-medium w-[49px] text-gray-700 select-none">성별</label>
            <div className="flex items-center gap-6">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                        type="radio"
                        {...register('gender')}
                        value="MALE"
                        className="w-3.5 h-3.5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-600">남</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                        type="radio"
                        {...register('gender')}
                        value="FEMALE"
                        className="w-3.5 h-3.5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-600">여</span>
                </label>
            </div>
        </div>
    );
}
