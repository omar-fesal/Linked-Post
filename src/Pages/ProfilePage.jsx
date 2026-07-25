import React, { useContext, useEffect, useState } from 'react'
import ProfilePostHead from '../Components/Posts/ProfilePostHead'
import PostForm from '../Components/PostForm'
import { AuthContext } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getUserPostApi } from '../Services/PostService'
import PostCard from '../Components/Posts/PostCard'
import LoadingScreen from '../Components/LoadingScreen'

export default function ProfilePage() {
    const { userData } = useContext(AuthContext)

    const { data, isLoading } = useQuery({
        queryKey: ["userPosts"],
        queryFn: () => getUserPostApi(userData?._id),
        enabled: !!userData?._id
    });

    // Local list so posts can be removed instantly on delete
    const [localPosts, setLocalPosts] = useState([])

    useEffect(() => {
        if (data?.data?.posts) {
            setLocalPosts(data.data.posts)
        }
    }, [data])

    function handlePostCreated(newPost) {
        const enriched = { ...newPost, user: newPost.user ?? userData }
        setLocalPosts((prev) => [enriched, ...prev])
    }

    function handlePostDeleted(deletedId) {
        setLocalPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <ProfilePostHead />
            </div>

            <div className="max-w-2xl mx-auto px-4">
                <PostForm onPostCreated={handlePostCreated} />
            </div>

            <div className="max-w-2xl mx-auto px-4 py-3">
                {isLoading ? (
                    <LoadingScreen />
                ) : localPosts.length > 0 ? (
                    <div>
                        {localPosts.map((post) => (
                            <PostCard
                                key={post._id || post.id}
                                post={post}
                                commentLimit={1}
                                callback={handlePostDeleted}
                                onPostShared={handlePostCreated}
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
        </div>
    )
}
