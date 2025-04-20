interface FormFieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

const FormField = ({ label, error, children }: FormFieldProps) => (
    <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export default FormField;
