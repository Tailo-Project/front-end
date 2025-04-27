import { MouseEvent } from 'react';

export interface LikeProps {
    count: number;
    isLiked: boolean;
    onToggle: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface CommentProps {
    count: number;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface ShareProps {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface Author {
    nickname: string;
    profile: string | File;
}

export interface FeedPost {
    feedId: number;
    accountId: string;
    authorNickname: string;
    authorProfile: string;
    content: string;
    imageUrls: string[];
    hashtags: string[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    isLiked: boolean;
}

export interface Comment {
    commentId: number;
    content: string;
    accountId: string;
    authorNickname: string;
    authorProfile: string | null;
    createdAt: string;
    replies: {
        replies: Comment[];
        totalCount: number;
    };
}

export interface CommentsResponse {
    comments: Comment[];
}

export interface FeedListResponse {
    isLiked?: boolean;
    feedPosts: FeedPost[];
    hasNext: boolean;
    page: number;
}

import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import React from 'react';

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

export interface BaseInputProps {
    label?: string;
    placeholder?: string;
    maxLength?: number;
    type?: string;
    min?: number;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
    rightElement?: React.ReactNode;
}

export interface FormInputProps<T extends FieldValues = FieldValues> extends BaseInputProps {
    name: Path<T>;
    register: UseFormRegister<T>;
}

export interface FormFieldProps<T extends FieldValues = FieldValues> extends BaseInputProps {
    name: Path<T>;
    register: UseFormRegister<T>;
}
