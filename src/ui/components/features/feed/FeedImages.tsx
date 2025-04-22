interface FeedImagesProps {
    images: string[];
    authorNickname: string;
}

const FeedImages = ({ images, authorNickname }: FeedImagesProps) => {
    if (!images?.length) return null;

    return (
        <div className="mb-4">
            <div
                className={`grid gap-1 ${
                    images.length === 1
                        ? ''
                        : images.length === 2
                          ? 'grid-cols-2'
                          : images.length === 3
                            ? 'grid-cols-3'
                            : 'grid-cols-2 grid-rows-2'
                }`}
            >
                {images.slice(0, 4).map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${authorNickname}님의 이미지 ${index + 1}`}
                        className={`w-full ${
                            images.length === 1
                                ? 'h-[280px]'
                                : images.length === 2
                                  ? 'h-[200px]'
                                  : images.length === 3
                                    ? 'h-[120px]'
                                    : 'h-[140px]'
                        } object-cover rounded-lg`}
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedImages;
