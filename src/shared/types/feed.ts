export interface Author {
    nickname: string;
    profile: string | File;
}

export interface FeedPost {
    feedId: number;
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

export interface FeedLikesResponse {
    isLiked: boolean;
}
