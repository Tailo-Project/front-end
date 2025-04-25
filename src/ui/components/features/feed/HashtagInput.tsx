import { useState, KeyboardEvent, ChangeEvent } from 'react';

interface HashtagInputProps {
    hashtags: { hashtag: string }[];
    onHashtagsChange: (hashtags: { hashtag: string }[]) => void;
}

export const HashtagInput = ({ hashtags, onHashtagsChange }: HashtagInputProps) => {
    const [hashtag, setHashtag] = useState<string>('');

    const handleHashtagSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedHashtag = hashtag.trim();
            const isMatchHashtag = !hashtags.some((h) => h.hashtag === trimmedHashtag);

            if (trimmedHashtag && isMatchHashtag) {
                onHashtagsChange([...hashtags, { hashtag: trimmedHashtag }]);
                setHashtag('');
            }
        }
    };

    const handleHashtagChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value.includes(' ')) {
            setHashtag(value);
        }
    };

    const removeHashtag = (index: number) => {
        onHashtagsChange(hashtags.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={hashtag}
                    onChange={handleHashtagChange}
                    onKeyDown={handleHashtagSubmit}
                    placeholder="해시태그를 입력하고 Enter를 누르세요"
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
            </div>
            {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <span>#{tag.hashtag}</span>
                            <button
                                type="button"
                                onClick={() => removeHashtag(index)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
