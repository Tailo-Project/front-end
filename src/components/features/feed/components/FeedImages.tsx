interface FeedImagesProps {
    images: string[];
    authorNickname: string;
}

const FeedImages = ({ images, authorNickname }: FeedImagesProps) => {
    if (!images?.length) return null;

    const getGridClassName = () => {
        if (images.length === 1) return '';
        if (images.length === 2) return 'grid-cols-2';
        if (images.length === 3) return 'grid-cols-3';
        return 'grid-cols-2 grid-rows-2';
    };

    return (
        <div className="mb-4">
            <div className={`grid gap-1 ${getGridClassName()}`}>
                {images.slice(0, 4).map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${authorNickname}님의 이미지 ${index + 1}`}
                        className={`w-full ${images.length === 1 ? 'aspect-video rounded-2xl' : 'rounded-lg'} object-cover`}
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedImages;
