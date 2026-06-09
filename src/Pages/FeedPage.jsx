import { Button } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { getPosts } from '../Services/PostService'
import LoadingScreen from '../Components/LoadingScreen';

import PostCard from '../Components/Posts/PostCard';
import PostForm from '../Components/PostForm';
import { useQuery } from '@tanstack/react-query';

export default function FeedPage() {
    // const [posts, setPosts] = useState([]);
    // const [loading, setLoading] = useState(true);

    // async function getAllPosts() {
    //     const resp = await getPosts();
    //     if (resp.message == 'success') {
    //         setPosts(resp.posts)
    //     }
    //     setLoading(false)
    // }
    // useEffect(
    //     () => { getAllPosts() }
    //     , [])

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts
    })

    return <>



        <div className="w-xl mx-auto">

            {/* <PostForm getAllPosts={getAllPosts} /> */}

            {isLoading ? <LoadingScreen /> :
                data.data.posts.map((post) => <PostCard key={post.id} post={post} commentLimit={1} />)

            }




        </div >





    </>
}
