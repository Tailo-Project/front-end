import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface BreedComboboxProps {
    value: string;
    onChange: (value: string) => void;
    breeds: string[];
    onAddBreed?: (breed: string) => void;
}

const BreedCombobox = ({ value, onChange, breeds, onAddBreed }: BreedComboboxProps) => {
    const [query, setQuery] = useState('');
    const [showAddBreed, setShowAddBreed] = useState(false);

    const filteredBreeds =
        query === '' ? breeds : breeds.filter((breed) => breed.toLowerCase().includes(query.toLowerCase()));

    const handleAddBreed = () => {
        if (query && !breeds.includes(query) && onAddBreed) {
            onAddBreed(query);
            onChange(query);
            setShowAddBreed(false);
        }
    };

    const inputClassName =
        'flex-1 h-[32px] px-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 placeholder:text-xs hover:border-gray-400 bg-gray-50/30';

    return (
        <div className="flex items-center gap-3">
            <label className="text-sm font-medium w-[49px] text-gray-700 select-none">품종</label>
            <div className="flex-1">
                <Combobox
                    value={value}
                    onChange={(newValue: string) => {
                        onChange(newValue || '');
                    }}
                >
                    <div className="relative">
                        <ComboboxInput
                            className={inputClassName}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setShowAddBreed(
                                    event.target.value !== '' && !filteredBreeds.includes(event.target.value),
                                );
                            }}
                            displayValue={(breed: string) => breed}
                            placeholder="품종을 선택해주세요"
                        />

                        <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black/5 overflow-auto focus:outline-none">
                            {filteredBreeds.map((breed) => (
                                <ComboboxOption
                                    key={breed}
                                    value={breed}
                                    className={({ active }: { active: boolean }) =>
                                        `cursor-default select-none relative py-2.5 pl-3 pr-9 ${
                                            active ? 'text-white bg-blue-500' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {breed}
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
