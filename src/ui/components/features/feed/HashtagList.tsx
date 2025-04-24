interface HashtagListProps {
    hashtags: string[];
    className?: string;
}

const HashtagList = ({ hashtags, className = '' }: HashtagListProps) => {
    if (!hashtags.length) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {hashtags.map((hashtag) => (
                <span key={hashtag} className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm">
                    #{hashtag}
                </span>
            ))}
        </div>
    );
};

export default HashtagList;
