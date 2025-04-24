export type Gender = 'MALE' | 'FEMALE';

export interface GenderOption {
    value: Gender;
    label: string;
    icon?: string;
}

export interface PetInfo {
    type: string;
    age: number;
    gender: Gender;
}

export interface ProfileInfo {
    nickname: string;
    breed: string;
    address: string;
}

export interface ProfileData extends ProfileInfo, PetInfo {
    profileImage: string | File;
}

export interface FormFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    maxLength?: number;
    type?: string;
    min?: string;
}
