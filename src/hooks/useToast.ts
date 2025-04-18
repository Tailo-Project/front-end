import { useState, useCallback } from 'react';

interface ToastState {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}

interface UseToastReturn {
    toast: ToastState;
    showToast: (message: string, type: 'success' | 'error', duration?: number) => void;
    hideToast: () => void;
}

export const useToast = (defaultDuration = 1500): UseToastReturn => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        show: false,
    });

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    const showToast = useCallback(
        (message: string, type: 'success' | 'error', duration = defaultDuration) => {
            setToast({
                message,
                type,
                show: true,
            });

            if (duration > 0) {
                setTimeout(hideToast, duration);
            }
        },
        [defaultDuration, hideToast],
    );

    return { toast, showToast, hideToast };
};
