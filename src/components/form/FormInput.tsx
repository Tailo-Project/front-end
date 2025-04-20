import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SignUpFormData } from './types';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: keyof SignUpFormData;
    register: UseFormRegister<SignUpFormData>;
    required?: boolean;
    suffix?: string;
    disabled?: boolean;
    rightElement?: React.ReactNode;
}

const FormInput = ({
    label,
    name,
    register,
    required = false,
    type = 'text',
    placeholder,
    suffix,
    disabled = false,
    rightElement,
}: FormInputProps) => {
    const labelClassName = 'text-sm font-medium text-gray-700';

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className={labelClassName}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative flex items-center">
                <input
                    id={name}
                    type={type}
                    {...register(name, { required })}
                    className={`w-full h-[45px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        rightElement ? 'pr-[100px]' : ''
                    }`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                {suffix && <span className="absolute right-4 text-gray-500">{suffix}</span>}
                {rightElement && <div className="absolute right-2">{rightElement}</div>}
            </div>
        </div>
    );
};

export default FormInput;
