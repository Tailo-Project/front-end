export interface Author {
    nickname: string;
    profile: string | File;
}

export interface FeedPost {
    feedId: number;
    content: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
    likes: number;
    imageUrls?: string[];
    authorNickname: string;
    authorProfile: string | File;
    hashtags: string[];
}

export interface Comment {
    commentId: number;
    content: string;
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
