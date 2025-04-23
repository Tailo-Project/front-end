import clsx from 'clsx';

interface FeedImagesProps {
    images: string[];
    authorNickname: string;
}

const FeedImages = ({ images, authorNickname }: FeedImagesProps) => {
    if (!images?.length) return null;

    const getGridSize = () => {
        if (images.length === 1) return '';
        if (images.length === 2) return 'grid-cols-2';
        if (images.length === 3) return 'grid-cols-3';
        return 'grid-cols-2 grid-rows-2';
    };

    const getImageSize = () => {
        if (images.length === 1) return 'h-[280px]';
        if (images.length === 2) return 'h-[200px]';
        if (images.length === 3) return 'h-[120px]';
        return 'h-[140px]';
    };

    return (
        <div className="mb-4">
            <div className={clsx('grid gap-1', getGridSize())}>
                {images.slice(0, 4).map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${authorNickname}님의 이미지 ${index + 1}`}
                        className={clsx('w-full', getImageSize())}
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedImages;
