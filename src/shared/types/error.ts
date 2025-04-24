export type ApiErrorType = 'AUTH' | 'NETWORK' | 'UNKNOWN' | 'NOT_FOUND' | 'BAD_REQUEST';

export interface ApiError {
    type: ApiErrorType;
    message: string;
}

const ERROR_MESSAGES: Record<ApiErrorType, string> = {
    AUTH: '로그인이 필요한 서비스입니다.',
    NETWORK: '네트워크 연결을 확인해주세요.',
    UNKNOWN: '알 수 없는 에러가 발생했습니다.',
    NOT_FOUND: '해당 회원이 존재하지 않습니다.',
    BAD_REQUEST: '잘못된 요청입니다.',
};

export const createApiError = (type: ApiErrorType, customMessage?: string): ApiError => ({
    type,
    message: customMessage || ERROR_MESSAGES[type],
});

export const handleApiError = (error: unknown, status?: number): ApiError => {
    if (status === 401) {
        return createApiError('AUTH');
    }

    if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return createApiError('NETWORK');
        }
        return createApiError('UNKNOWN', error.message);
    }

    return createApiError('UNKNOWN');
};
