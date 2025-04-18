import React from 'react';
import tailogo from '../assets/tailogo.svg';

interface Comment {
    id: number;
    content: string;
    author: {
        name: string;
        profileImage: string;
    };
    createdAt: string;
}

interface CommentBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    feedId: number;
}

const CommentBottomSheet: React.FC<CommentBottomSheetProps> = ({ isOpen, onClose }) => {
    // 임시 더미 댓글 데이터
    const dummyComments: Comment[] = [
        {
            id: 1,
            content: '너무 귀여워요! 😍',
            author: {
                name: '멍멍이맘',
                profileImage: tailogo,
            },
            createdAt: '2024-03-20',
        },
        {
            id: 2,
            content: '우리 아이랑 닮았네요 ㅎㅎ',
            author: {
                name: '냥이집사',
                profileImage: tailogo,
            },
            createdAt: '2024-03-20',
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />
            <div
                className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
                style={{
                    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s ease-out',
                }}
            >
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">댓글</h2>
                        <button onClick={onClose} className="text-gray-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 댓글 목록 */}
                <div className="px-4 py-2">
                    {dummyComments.map((comment) => (
                        <div key={comment.id} className="py-4 border-b border-gray-100">
                            <div className="flex items-start">
                                <img
                                    src={comment.author.profileImage}
                                    alt={comment.author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-sm">{comment.author.name}</h3>
                                        <span className="text-xs text-gray-500">{comment.createdAt}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 댓글 입력 */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="댓글을 입력하세요..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600">
                            게시
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentBottomSheet;
