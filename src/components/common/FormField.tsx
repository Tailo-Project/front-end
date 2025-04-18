interface FormFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    maxLength?: number;
    type?: string;
    min?: string;
}

const FormField = ({ label, value, onChange, placeholder, maxLength, type = 'text', min }: FormFieldProps) => (
    <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {maxLength && (
                <span className="text-xs text-gray-400">
                    {value.length}/{maxLength}
                </span>
            )}
        </div>
        {type === 'textarea' ? (
            <textarea
                value={value}
                onChange={(e) => {
                    if (!maxLength || e.target.value.length <= maxLength) {
                        onChange(e.target.value);
                    }
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none text-sm"
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => {
                    if (!maxLength || e.target.value.length <= maxLength) {
                        onChange(e.target.value);
                    }
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder={placeholder}
                min={min}
            />
        )}
    </div>
);

export default FormField;
