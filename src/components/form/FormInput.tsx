import { InputHTMLAttributes } from 'react';
import { UseFormRegister, Path, FieldValues } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    suffix?: string;
    rightElement?: React.ReactNode;
}

const FormInput = <T extends FieldValues>({
    label,
    name,
    register,
    suffix,
    rightElement,
    className = '',
    ...props
}: FormInputProps<T>) => {
    return (
        <div className="space-y-1">
            <label htmlFor={name.toString()} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={name.toString()}
                    {...register(name)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
                    {...props}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{suffix}</span>
                )}
                {rightElement && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">{rightElement}</div>
                )}
            </div>
        </div>
    );
};

export default FormInput;
