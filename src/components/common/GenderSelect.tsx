import { Gender } from '@/types';

interface GenderSelectProps {
    label: string;
    value: Gender;
    onChange: (value: Gender) => void;
}

const GenderSelect = ({ label, value, onChange }: GenderSelectProps) => (
    <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => onChange('MALE')}
                className={`flex-1 py-2.5 rounded-lg border ${
                    value === 'MALE' ? 'bg-[#FF785D] text-white' : 'text-gray-700'
                } text-sm font-medium`}
            >
                남성
            </button>
            <button
                type="button"
                onClick={() => onChange('FEMALE')}
                className={`flex-1 py-2.5 rounded-lg border ${
                    value === 'FEMALE' ? 'bg-[#FF785D] text-white' : 'text-gray-700'
                } text-sm font-medium`}
            >
                여성
            </button>
        </div>
    </div>
);

export default GenderSelect;
