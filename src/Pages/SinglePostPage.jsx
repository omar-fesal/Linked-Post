import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSinglePosts } from '../Services/PostService'
import LoadingScreen from '../Components/LoadingScreen';
import { h2 } from 'framer-motion/client';
import PostCard from '../Components/Posts/PostCard';

export default function SinglePostPage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(null);
    const { id } = useParams()



    async function getPost() {
        setLoading(true)
        const resp = await getSinglePosts(id);
        if (resp.message == 'success') {
            setPost(resp.data.post)

        }
        setLoading(false)
    }

    useEffect(() => {
        getPost()
    }, [])

    return <>
        {
            loading ? <LoadingScreen /> :
                <div className="w-xl mx-auto">
                    <PostCard post={post} commentLimit={post?.commentsCount + 1} />

                </div>
        }
    </>
}
