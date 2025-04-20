export type Gender = 'MALE' | 'FEMALE';

export interface PetInfo {
    petType: string;
    petAge: string;
    petGender: Gender;
}

export interface ProfileInfo {
    nickname: string;
    bio: string;
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
