export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export interface ProfileData {
    nickname: string;
    bio: string;
    profileImage: string;
    petType: string;
    petAge: string;
    petGender: Gender;
    address: string;
}
