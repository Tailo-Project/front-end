import { useState, useRef, ChangeEvent } from 'react';

interface ImageUploaderProps {
    images: File[];
    onImagesChange: (images: File[]) => void;
    error: string;
    onError: (error: string) => void;
}

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export const ImageUploader = ({ images, onImagesChange, error, onError }: ImageUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const validateImage = (file: File): boolean => {
        if (file.size > MAX_IMAGE_SIZE) {
            onError(`이미지 크기는 ${MAX_IMAGE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.`);
            return false;
        }
        return true;
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > MAX_IMAGES) {
            onError(`이미지는 최대 ${MAX_IMAGES}개까지만 업로드할 수 있습니다.`);
            return;
        }

        const validFiles = files.filter(validateImage);
        if (validFiles.length === 0) return;

        onImagesChange([...images, ...validFiles]);

        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        onError('');
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#FF785D] text-white rounded-lg hover:bg-[#FF785D]/80"
                >
                    이미지 업로드
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="w-6 h-6 absolute top-2 right-2 bg-red-500 text-white rounded-full"
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
