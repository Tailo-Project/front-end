export interface SignUpFormData {
    email: string;
    accountId: string;
    nickname: string;
    type: string;
    age: number;
    breed: string;
    gender: 'MALE' | 'FEMALE';
    address: string;
    file: string;
}

export interface ToastState {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}
