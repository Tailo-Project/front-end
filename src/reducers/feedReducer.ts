export interface Feed {
    id: number;
    title: string;
    content: string;
    author: {
        name: string;
        profileImage: string;
    };
    createdAt: string;
    likes: number;
    comments: number;
    images?: string[];
}

export interface FeedState {
    displayedFeeds: Feed[];
    page: number;
    isLoading: boolean;
    likedFeeds: { [key: number]: boolean };
    selectedFeedId: number | null;
    isCommentSheetOpen: boolean;
    error: string | null;
}

export type FeedAction =
    | { type: 'LOAD_MORE_START' }
    | { type: 'LOAD_MORE_SUCCESS'; feeds: Feed[] }
    | { type: 'TOGGLE_LIKE'; feedId: number }
    | { type: 'OPEN_COMMENTS'; feedId: number }
    | { type: 'CLOSE_COMMENTS' }
    | { type: 'SET_ERROR'; error: string };

export const initialState: FeedState = {
    displayedFeeds: [],
    page: 1,
    isLoading: false,
    likedFeeds: {},
    selectedFeedId: null,
    isCommentSheetOpen: false,
    error: null,
};

export function feedReducer(state: FeedState, action: FeedAction): FeedState {
    switch (action.type) {
        case 'LOAD_MORE_START':
            return { ...state, isLoading: true };
        case 'LOAD_MORE_SUCCESS':
            return {
                ...state,
                displayedFeeds: [...state.displayedFeeds, ...action.feeds],
                page: state.page + 1,
                isLoading: false,
            };
        case 'TOGGLE_LIKE': {
            const newLikedState = !state.likedFeeds[action.feedId];
            return {
                ...state,
                likedFeeds: { ...state.likedFeeds, [action.feedId]: newLikedState },
                displayedFeeds: state.displayedFeeds.map((feed) =>
                    feed.id === action.feedId
                        ? { ...feed, likes: newLikedState ? feed.likes + 1 : feed.likes - 1 }
                        : feed,
                ),
            };
        }
        case 'OPEN_COMMENTS':
            return {
                ...state,
                selectedFeedId: action.feedId,
                isCommentSheetOpen: true,
            };
        case 'CLOSE_COMMENTS':
            return {
                ...state,
                selectedFeedId: null,
                isCommentSheetOpen: false,
            };
        case 'SET_ERROR':
            return { ...state, error: action.error, isLoading: false };
        default:
            return state;
    }
}
