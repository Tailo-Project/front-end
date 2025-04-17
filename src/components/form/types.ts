export interface SignUpFormData {
    nickname: string;
    userId: string;
    profileImage: File;
    type: string;
    breed: string;
    gender: 'male' | 'female';
    age: string;
    location: string;
}

export interface ToastState {
    message: string;
    type: 'success' | 'error';
    show: boolean;
}
