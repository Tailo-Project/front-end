import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({
    open,
    title = '삭제 확인',
    description = '정말로 삭제하시겠습니까?',
    confirmText = '삭제',
    cancelText = '취소',
    onConfirm,
    onCancel,
}: ConfirmModalProps) => {
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onCancel]);

    useEffect(() => {
        if (open && cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fadeIn flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h2>
                <p className="text-base text-gray-600 mb-8 text-center">{description}</p>
                <div className="flex justify-end gap-2">
                    <button
                        ref={cancelButtonRef}
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring"
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring"
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
