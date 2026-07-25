import React, { useContext, useEffect, useState } from 'react'
import ProfilePostHead from '../Components/Posts/ProfilePostHead'
import PostForm from '../Components/PostForm'
import { AuthContext } from '../context/AuthContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserPostApi } from '../Services/PostService'
import PostCard from '../Components/Posts/PostCard'
import LoadingScreen from '../Components/LoadingScreen'

export default function MyPosts() {
    const { userData } = useContext(AuthContext)
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["userPosts"],
        queryFn: () => getUserPostApi(userData?._id),
        enabled: !!userData?._id
    });

    // Local list so new posts appear instantly
    const [localPosts, setLocalPosts] = useState([])

    useEffect(() => {
        if (data?.data?.posts) {
            setLocalPosts(data.data.posts)
        }
    }, [data])

    function handlePostCreated(newPost) {
        // Inject the logged-in user's data so photo/name show immediately
        const enriched = {
            ...newPost,
            user: newPost.user ?? userData,
        }
        setLocalPosts((prev) => [enriched, ...prev])
    }

    function handlePostDeleted(deletedId) {
        setLocalPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
    }

    return <>
        <PostForm onPostCreated={handlePostCreated} />

        <div className="py-3">
            {isLoading ? (
                <LoadingScreen />
            ) : localPosts.length > 0 ? (
                <div>
                    {localPosts.map((post) => (
                        <PostCard
                            key={post.id || post._id}
                            post={post}
                            commentLimit={1}
                            callback={handlePostDeleted}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-md shadow p-8 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        No Posts Yet
                    </h2>
                    <p className="text-gray-500 mb-6">
                        You haven't shared any posts yet. Create your first post and let
                        people know what's on your mind.
                    </p>
                    <div className="text-sm text-gray-400">
                        Your posts will appear here.
                    </div>
                </div>
            )}
        </div>

    </>
}
