import { useState } from 'react';

interface UseConfirmModalOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

const DEFAULTS = {
    title: '삭제 확인',
    description: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
};

const useConfirmModal = () => {
    const [modal, setModal] = useState({
        open: false,
        title: DEFAULTS.title,
        description: DEFAULTS.description,
        confirmText: DEFAULTS.confirmText,
        cancelText: DEFAULTS.cancelText,
        onConfirm: (() => {}) as () => void,
    });

    const show = (options: UseConfirmModalOptions = {}, onConfirm: () => void) => {
        setModal({
            open: true,
            title: options.title || DEFAULTS.title,
            description: options.description || DEFAULTS.description,
            confirmText: options.confirmText || DEFAULTS.confirmText,
            cancelText: options.cancelText || DEFAULTS.cancelText,
            onConfirm,
        });
    };

    const hide = () => {
        setModal((prev) => ({ ...prev, open: false }));
    };

    const handleConfirm = () => {
        modal.onConfirm();
        hide();
    };

    return {
        ...modal,
        show,
        hide,
        handleConfirm,
    };
};

export default useConfirmModal;
