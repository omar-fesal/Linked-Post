import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { myFeedPageApi } from '../Services/PostService';
import LoadingScreen from '../Components/LoadingScreen';
import PostCard from '../Components/Posts/PostCard';

export default function CommunityPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['MyFeedPage'],
        queryFn: () => myFeedPageApi()
    });

    const [posts, setPosts] = useState([]);
    console.log("🚀 ~ CommunityPage ~ posts:", posts)

    useEffect(() => {
        if (data) {
            setPosts(data.data.posts);
        }
    }, [data]);

    function handlePostDeleted(deletedId) {
        setPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
    }

    function handlePostShared(newPost) {
        setPosts((prev) => [newPost, ...prev])
    }

    return <>
        {isLoading ? (
            <LoadingScreen />
        ) : posts.length === 0 ? (
            <div className="text-center text-default-400 py-16">
                <p className="text-lg font-medium">No community posts yet</p>
                <p className="text-sm mt-1">Follow people to see their posts here</p>
            </div>
        ) : (
            posts.map((post) => (
                <PostCard
                    key={post.id || post._id}
                    post={post}
                    commentLimit={1}
                    callback={handlePostDeleted}
                    onPostShared={handlePostShared}
                />
            ))
        )}
    </>;
}
