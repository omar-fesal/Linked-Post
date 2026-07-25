import React, { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyBookmarkedPosts } from '../Services/PostService'
import PostCard from '../Components/Posts/PostCard'
import LoadingScreen from '../Components/LoadingScreen'
import { AuthContext } from '../context/AuthContext'
import { Bookmark } from 'lucide-react'

export default function BookmarkedPage() {
    const { userData } = useContext(AuthContext)

    const { data, isLoading } = useQuery({
        queryKey: ['bookmarked-posts'],
        queryFn: getMyBookmarkedPosts,
    })

    const bookmarks = data?.data?.bookmarks || []

    return (
        <div className="py-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 px-1">
                <div className="bg-amber-100 p-2 rounded-xl">
                    <Bookmark size={22} className="text-amber-500 fill-amber-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Saved Posts</h1>
                    <p className="text-sm text-gray-400">
                        {isLoading ? '...' : `${bookmarks.length} saved post${bookmarks.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <LoadingScreen />
            ) : bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-gray-100 p-5 rounded-full mb-4">
                        <Bookmark size={36} className="text-gray-300" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-500">No saved posts yet</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Tap the bookmark icon on any post to save it here.
                    </p>
                </div>
            ) : (
                bookmarks.map((post) => (
                    <PostCard
                        key={post._id}
                        post={{
                            ...post,
                            // API returns bookmarked:true per post, normalise so BookmarkBtn works
                            bookmarks: post.bookmarked ? [userData?.id] : [],
                        }}
                        commentLimit={1}
                    />
                ))
            )}
        </div>
    )
}
