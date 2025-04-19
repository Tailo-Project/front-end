import { useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { UseFormSetValue } from 'react-hook-form';
import { SignUpFormData } from './types';

// 임시 품종 데이터
const DEFAULT_BREEDS = ['말티즈', '포메라니안', '치와와', '푸들', '시바견', '말라뮤트'];
const MAX_BREED_LENGTH = 20;

interface BreedComboboxProps {
    setValue: UseFormSetValue<SignUpFormData>;
    error?: string;
    required?: boolean;
    defaultBreeds?: string[];
}

const BreedCombobox = ({ setValue, error, required = true, defaultBreeds = DEFAULT_BREEDS }: BreedComboboxProps) => {
    const [selectedBreed, setSelectedBreed] = useState('');
    const [query, setQuery] = useState('');
    const [breeds, setBreeds] = useState(defaultBreeds);
    const [showAddBreed, setShowAddBreed] = useState(false);

    const filteredBreeds =
        query === '' ? breeds : breeds.filter((breed) => breed.toLowerCase().includes(query.toLowerCase().trim()));

    const handleAddBreed = () => {
        const trimmedQuery = query.trim();
        if (trimmedQuery && !breeds.includes(trimmedQuery)) {
            if (trimmedQuery.length > MAX_BREED_LENGTH) {
                return;
            }
            const newBreeds = [...breeds, trimmedQuery];
            setBreeds(newBreeds.sort());
            setSelectedBreed(trimmedQuery);
            setValue('breed', trimmedQuery);
            setShowAddBreed(false);
            setQuery('');
        }
    };

    const inputClassName = `
        flex-1 h-[32px] px-2 text-sm border rounded-md
        ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
        focus:outline-none transition-all duration-300
        placeholder:text-gray-400 placeholder:text-xs
        hover:border-gray-400 bg-gray-50/30
        disabled:bg-gray-100 disabled:cursor-not-allowed
    `;

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium w-[49px] text-gray-700 select-none">
                    품종{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <div className="flex-1">
                    <Combobox
                        value={selectedBreed}
                        onChange={(value: string) => {
                            setSelectedBreed(value || '');
                            setValue('breed', value || '');
                        }}
                    >
                        <div className="relative">
                            <ComboboxInput
                                className={inputClassName}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setQuery(value);
                                    setShowAddBreed(
                                        value.trim() !== '' &&
                                            !filteredBreeds.includes(value.trim()) &&
                                            value.length <= MAX_BREED_LENGTH,
                                    );
                                }}
                                displayValue={(breed: string) => breed}
                                placeholder="품종을 선택해주세요"
                            />
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            </ComboboxButton>
                            <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black/5 overflow-auto focus:outline-none">
                                {filteredBreeds.length === 0 && !showAddBreed ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        검색 결과가 없습니다
                                    </div>
                                ) : (
                                    <>
                                        {filteredBreeds.map((breed) => (
                                            <ComboboxOption
                                                key={breed}
                                                value={breed}
                                                className={({ active }) =>
                                                    `cursor-default select-none relative py-2.5 pl-3 pr-9 ${
                                                        active ? 'text-white bg-blue-500' : 'text-gray-900'
                                                    }`
                                                }
                                            >
                                                {({ selected, active }) => (
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                                    >
                                                        {breed}
                                                        {selected && (
                                                            <span
                                                                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${active ? 'text-white' : 'text-blue-500'}`}
                                                            >
                                                                ✓
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </ComboboxOption>
                                        ))}
                                        {showAddBreed && (
                                            <button
                                                type="button"
                                                onClick={handleAddBreed}
                                                className="flex items-center w-full px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <PlusIcon className="h-4 w-4 mr-2" />
                                                <span>"{query.trim()}" 추가하기</span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>
            </div>
            {error && <p className="text-sm text-red-500 pl-[64px]">{error}</p>}
        </div>
    );
};

export default BreedCombobox;
