import FeedSearch from './FeedSearch';
import MemberSearch from './MemberSearch';
import { useState } from 'react';
import Layout from '@/layouts/layout';

const FeedAndMemberSearch = () => {
    const [searchType, setSearchType] = useState<'feed' | 'member'>('feed');
    const [searchKeyword, setSearchKeyword] = useState('');

    return (
        <Layout>
            <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen p-0">
                <h2 className="text-xl font-bold px-4 pt-6 pb-2">통합 검색</h2>
                <div className="flex px-4 gap-2 mb-2">
                    <button
                        className={`flex-1 py-2 rounded-md ${searchType === 'feed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSearchType('feed')}
                        aria-selected={searchType === 'feed'}
                    >
                        피드
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md ${searchType === 'member' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setSearchType('member')}
                        aria-selected={searchType === 'member'}
                    >
                        사용자
                    </button>
                </div>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-base focus:outline-blue-400"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    aria-label="통합 검색"
                />
                <div className="px-4 pt-4">
                    {searchType === 'feed' ? (
                        <FeedSearch keyword={searchKeyword} />
                    ) : (
                        <MemberSearch keyword={searchKeyword} />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default FeedAndMemberSearch;
