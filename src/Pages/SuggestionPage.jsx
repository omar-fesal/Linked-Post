import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetFollowSuggest } from '../Services/FollowSuggest';
import SearchBar from '../Components/Suggestion/SearchBar';
import FriendCard from '../Components/Suggestion/FriendCard';

const PAGE_SIZE = 12;

export default function SuggestionPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['follow suggest'],
        queryFn: () => GetFollowSuggest(50),
    });

    const allUsers = data?.data?.suggestions ?? [];

    // Filter by search
    const filteredUsers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return allUsers;
        return allUsers.filter(
            (u) =>
                u.name?.toLowerCase().includes(q) ||
                u.username?.toLowerCase().includes(q)
        );
    }, [allUsers, searchQuery]);

    // Reset pagination when search changes
    const visibleUsers = filteredUsers.slice(0, visibleCount);
    const hasMore = visibleCount < filteredUsers.length;

    function handleViewMore() {
        setVisibleCount((prev) => prev + PAGE_SIZE);
    }

    // Reset visible count whenever search query changes
    function handleSearch(q) {
        setSearchQuery(q);
        setVisibleCount(PAGE_SIZE);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-green-500 transition-colors">
                        ← Back
                    </Link>
                    <span>/</span>
                    <span className="flex items-center gap-1 text-green-500 font-medium">
                        <Users size={14} />
                        Suggestions
                    </span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Users size={20} className="text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">All Suggested Friends</h1>
                            <p className="text-gray-400 text-sm">Discover people you might know</p>
                        </div>
                    </div>

                    {/* Count badge */}
                    {!isLoading && (
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-bold text-sm">{allUsers.length}</span>
                        </div>
                    )}
                </div>

                {/* Search */}
                <SearchBar value={searchQuery} onChange={handleSearch} />

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 animate-pulse"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-2 bg-gray-200 rounded w-1/3" />
                                    <div className="h-2 bg-gray-200 rounded w-2/5" />
                                </div>
                                <div className="w-24 h-8 bg-gray-200 rounded-full" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <div className="text-center py-16 text-red-400">
                        <p className="text-lg font-semibold">Failed to load suggestions</p>
                        <p className="text-sm mt-1">Please try again later.</p>
                    </div>
                )}

                {/* User grid */}
                {!isLoading && !isError && (
                    <>
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Users size={48} className="mx-auto mb-3 opacity-30" />
                                <p className="text-lg font-semibold">No results found</p>
                                <p className="text-sm mt-1">Try a different name or username</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {visibleUsers.map((user) => (
                                        <FriendCard key={user._id ?? user.username} user={user} />
                                    ))}
                                </div>

                                {/* View More button */}
                                {hasMore && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={handleViewMore}
                                            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white border-2 border-green-500 text-green-600 font-semibold text-sm hover:bg-green-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <ChevronDown size={18} />
                                            View More
                                        </button>
                                    </div>
                                )}

                                {/* All loaded indicator */}
                                {!hasMore && filteredUsers.length > PAGE_SIZE && (
                                    <p className="text-center text-gray-400 text-sm mt-8">
                                        ✓ All {filteredUsers.length} suggestions shown
                                    </p>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
