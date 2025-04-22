import { useState, useCallback } from 'react';

interface UseBreedSearchOptions {
    breeds: string[];
    onAddBreed?: (breed: string) => void;
}

export const useBreedSearch = ({ breeds, onAddBreed }: UseBreedSearchOptions) => {
    const [query, setQuery] = useState('');
    const [showAddBreed, setShowAddBreed] = useState(false);

    const filteredBreeds =
        query === '' ? breeds : breeds.filter((breed) => breed.toLowerCase().includes(query.toLowerCase()));

    const handleQueryChange = useCallback(
        (value: string) => {
            setQuery(value);
            setShowAddBreed(value !== '' && !breeds.includes(value));
        },
        [breeds],
    );

    const handleAddBreed = useCallback(() => {
        if (query && !breeds.includes(query) && onAddBreed) {
            onAddBreed(query);
            setShowAddBreed(false);
            return query;
        }
        return '';
    }, [query, breeds, onAddBreed]);

    return {
        query,
        showAddBreed,
        filteredBreeds,
        handleQueryChange,
        handleAddBreed,
    };
};
