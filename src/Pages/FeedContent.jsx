import React, { useContext, useEffect, useState } from 'react'
import { getPosts } from '../Services/PostService'
import LoadingScreen from '../Components/LoadingScreen';
import PostCard from '../Components/Posts/PostCard';
import PostForm from '../Components/PostForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';

export default function FeedContent() {
    const queryClient = useQueryClient();
    const { userData } = useContext(AuthContext);

    const { data, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts
    })

    // Local list so we can prepend new posts instantly
    const [localPosts, setLocalPosts] = useState([])

    useEffect(() => {
        if (data?.data?.data?.posts) {
            setLocalPosts(data.data.data.posts)
        }
    }, [data])

    function handlePostCreated(newPost) {
        // The API response may not include the full user object —
        // inject the logged-in user's data so photo/name show immediately
        const enriched = {
            ...newPost,
            user: newPost.user ?? userData,
        }
        setLocalPosts((prev) => [enriched, ...prev])
    }

    // Callback passed to each PostCard so deleted posts are removed instantly
    function handlePostDeleted(deletedId) {
        setLocalPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
    }

    return (
        <>
            <PostForm onPostCreated={handlePostCreated} />

            {isLoading ? (
                <LoadingScreen />
            ) : (
                localPosts.map((post) => (
                    <PostCard
                        key={post.id || post._id}
                        post={post}
                        commentLimit={1}
                        callback={handlePostDeleted}
                        onPostShared={handlePostCreated}
                    />
                ))
            )}
        </>
    )
}
