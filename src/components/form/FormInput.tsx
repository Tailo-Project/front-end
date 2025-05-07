import { FormInputProps } from '@/types';
import { FieldValues } from 'react-hook-form';

export const FormInput = <T extends FieldValues>({
    label,
    name,
    register,
    required,
    placeholder,
    type,
    min,
    maxLength,
    errorMessage,
    disabled,
    rightElement,
}: FormInputProps<T>) => {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    id={name}
                    className={`shadow appearance-none border ${
                        errorMessage ? 'border-red-500' : 'border-gray-300'
                    } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        disabled ? 'bg-gray-100' : ''
                    }`}
                    {...register(name)}
                    placeholder={placeholder}
                    type={type}
                    min={min}
                    maxLength={maxLength}
                    disabled={disabled}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightElement}</div>
                )}
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
};
