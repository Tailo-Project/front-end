import { useState, useCallback, useEffect, useRef } from 'react';

export type ToastType = 'success' | 'error';

interface ToastState {
    message: string;
    type: ToastType;
    show: boolean;
}

interface UseToastReturn {
    toast: ToastState;
    showToast: (message: string, type: ToastType, duration?: number) => void;
    hideToast: () => void;
}

const useToast = (defaultDuration = 1500): UseToastReturn => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        show: false,
    });
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, show: false }));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType, duration = defaultDuration) => {
            clearTimer();
            setToast({
                message,
                type,
                show: true,
            });

            if (duration > 0) {
                timerRef.current = setTimeout(hideToast, duration);
            }
        },
        [defaultDuration, hideToast, clearTimer],
    );

    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);

    return { toast, showToast, hideToast };
};

export default useToast;
