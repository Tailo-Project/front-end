import { UseFormRegister } from 'react-hook-form';
import { SignUpFormData } from './types';

interface FormInputProps {
    label: string;
    name: keyof SignUpFormData;
    register: UseFormRegister<SignUpFormData>;
    required?: boolean;
    placeholder?: string;
    type?: string;
    suffix?: string;
}

export default function FormInput({
    label,
    name,
    register,
    required = false,
    placeholder,
    type = 'text',
    suffix,
}: FormInputProps) {
    const inputClassName =
        'flex-1 h-[32px] px-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 placeholder:text-xs hover:border-gray-400 bg-gray-50/30';
    const labelClassName = 'text-sm font-medium w-[49px] text-gray-700 select-none';

    return (
        <div className="flex items-center gap-3">
            <label className={labelClassName}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-2 flex-1">
                <input
                    type={type}
                    {...register(name, { required })}
                    className={inputClassName}
                    placeholder={placeholder}
                />
                {suffix && <span className="text-sm text-gray-600">{suffix}</span>}
            </div>
        </div>
    );
}
