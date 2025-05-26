import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface BreedComboboxProps {
    value: string;
    onChange: (breed: string) => void;
    breeds: readonly string[];
    onAddBreed?: (breed: string) => void;
    placeholder?: string;
    className?: string;
}

const getOptionClassName = (active: boolean): string => {
    const baseClasses = 'cursor-default select-none relative py-2.5 pl-3 pr-9';
    const activeClasses = active ? 'text-white bg-[#FF785D]' : 'text-gray-900';

    return `${baseClasses} ${activeClasses}`.trim();
};

const renderBreedOption = (breed: string, selected: boolean, active: boolean) => {
    const textClasses = selected ? 'font-medium' : 'font-normal';

    return (
        <span
            className={`block truncate ${textClasses}
                ${active ? 'text-white' : ''}`}
        >
            {breed}
        </span>
    );
};

const BreedCombobox = ({
    value,
    onChange,
    breeds,
    onAddBreed,
    placeholder = '품종을 선택해주세요',
    className = '',
}: BreedComboboxProps) => {
    const [query, setQuery] = useState('');

    const filteredBreeds =
        query === '' ? breeds : breeds.filter((breed) => breed.toLowerCase().includes(query.toLowerCase()));
    const isNewBreed = query && !breeds.some((breed) => breed.toLowerCase() === query.toLowerCase());

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const exactMatch = filteredBreeds.find((breed) => breed.toLowerCase() === query.toLowerCase());

            if (exactMatch) {
                onChange(exactMatch);
                return;
            }

            if (isNewBreed && onAddBreed) {
                onAddBreed(query);
                onChange(query);
            }
        }
    };

    const inputClassName = `
        flex-1 h-[32px] px-2 text-sm border rounded-md

        focus:outline-none transition-all duration-300
        placeholder:text-gray-400 placeholder:text-xs
    `;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <label className="text-sm font-medium w-[49px] text-gray-700 select-none" aria-label="품종 선택">
                품종
            </label>
            <div className="flex-1">
                <Combobox value={value} onChange={onChange}>
                    <div className="relative">
                        <ComboboxInput
                            className={inputClassName}
                            onChange={handleQueryChange}
                            onKeyDown={handleKeyDown}
                            displayValue={(breed: string) => breed}
                            placeholder={placeholder}
                        />

                        <ComboboxOptions
                            className="absolute z-10 mt-1 w-full bg-white shadow-lg
                            max-h-60 rounded-md py-1 text-sm ring-1 ring-black/5
                            overflow-auto focus:outline-none"
                        >
                            {filteredBreeds.map((breed) => (
                                <ComboboxOption
                                    key={breed}
                                    value={breed}
                                    className={({ focus }) => getOptionClassName(focus)}
                                >
                                    {({ selected, focus }) => renderBreedOption(breed, selected, focus)}
                                </ComboboxOption>
                            ))}

                            {isNewBreed && onAddBreed && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onAddBreed(query);
                                        onChange(query);
                                    }}
                                    className="flex items-center w-full px-3 py-2.5
                                    text-sm text-[#FF785D] hover:bg-[#FF785D]/80
                                    transition-colors"
                                    aria-label={`"${query}" 품종 추가`}
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    <span>"{query}" 추가하기</span>
                                </button>
                            )}
                        </ComboboxOptions>
                    </div>
                </Combobox>
            </div>
        </div>
    );
};

export default BreedCombobox;
