import { useState } from 'react';

type ModalState = {
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
};

type ModalOptions = Partial<Omit<ModalState, 'open' | 'onConfirm'>>;

const DEFAULTS: Omit<ModalState, 'open' | 'onConfirm'> = {
    title: '삭제 확인',
    description: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
};

const useConfirmModal = () => {
    const [modal, setModal] = useState<ModalState>({
        open: false,
        ...DEFAULTS,
        onConfirm: () => {},
    });

    const show = (options: ModalOptions = {}, onConfirm: () => void) => {
        setModal({
            ...DEFAULTS,
            ...options,
            open: true,
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
        open: modal.open,
        title: modal.title,
        description: modal.description,
        confirmText: modal.confirmText,
        cancelText: modal.cancelText,
        onConfirm: modal.onConfirm,
        show,
        hide,
        handleConfirm,
    };
};

export default useConfirmModal;
