import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

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
        if (!file.type.startsWith('image/')) {
            onError('이미지 파일만 업로드할 수 있습니다.');
            return false;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            onError(`이미지 크기는 ${MAX_IMAGE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.`);
            return false;
        }
        return true;
    };

    const processFiles = (files: FileList | File[]) => {
        const fileArray = Array.from(files);

        if (images.length + fileArray.length > MAX_IMAGES) {
            onError(`이미지는 최대 ${MAX_IMAGES}개까지만 업로드할 수 있습니다.`);
            return;
        }

        const validFiles = fileArray.filter(validateImage);
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

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
            e.target.value = ''; // Reset input to allow selecting the same file again
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('border-[#FF785D]', 'bg-[#FFF5F3]');
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('border-[#FF785D]', 'bg-[#FFF5F3]');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div
                className="border-2 border-dashed rounded-xl p-6 text-center transition-colors border-gray-300 hover:border-gray-400 bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-[#FFE9E5] rounded-full">
                        <FiUpload className="w-6 h-6 text-[#FF785D]" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">여기에 이미지를 놓으세요</p>
                        <p className="text-sm text-gray-500 mt-1">
                            또는{' '}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[#FF785D] hover:underline font-medium"
                            >
                                컴퓨터에서 선택
                            </button>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG (최대 {MAX_IMAGE_SIZE / 1024 / 1024}MB)</p>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={preview}
                                    alt={`미리보기 ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                aria-label="이미지 제거"
                            >
                                <FiX className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}

                    {imagePreviews.length < MAX_IMAGES && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#FF785D] hover:text-[#FF785D] transition-colors"
                        >
                            <FiImage className="w-6 h-6 mb-1" />
                            <span className="text-sm">추가</span>
                        </button>
                    )}
                </div>
            )}

            {imagePreviews.length > 0 && (
                <p className="text-xs text-gray-500 text-right">
                    {imagePreviews.length}/{MAX_IMAGES}개 이미지 업로드됨
                </p>
            )}
        </div>
    );
};
