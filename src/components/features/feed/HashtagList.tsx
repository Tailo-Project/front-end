interface HashtagListProps {
    hashtags: string[];
    className?: string;
}

const HashtagList = ({ hashtags, className = '' }: HashtagListProps) => {
    if (!hashtags.length) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {hashtags.map((hashtag, index) => (
                <span
                    key={`${hashtag}-${index}`}
                    className="text-[#FF785D] hover:text-[#FF785D]/80 cursor-pointer text-sm"
                >
                    #{hashtag}
                </span>
            ))}
        </div>
    );
};

export default HashtagList;
