import React, { useEffect, useState } from 'react'
import placeholder from '../../assets/placeholder.png'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostComment from './PostComment'
import PostFooter from './PostFooter'
import { Link } from 'react-router-dom'
import { Button, Input, Spinner } from '@heroui/react'
import { createCommentApi, getCommentsApi, updateCommentApi } from '../../Services/CommentService'

export default function PostCard({ post, commentLimit, callback }) {
    const [commentContent, setCommentContent] = useState("")

    const [comments, setComments] = useState(post.comments || [])

    const [loading, setLoading] = useState(false);

    const [isDeletPost, setIsDeletPost] = useState(false)
    const [isUpdatingComment, setIsUpdatingComment] = useState(null)

    function reverseComment() {
        let newComments = structuredClone(comments)
        newComments.reverse();
        setComments(newComments)
    }

    async function createComment(e) {
        e.preventDefault();
        setLoading(true)
        const resp = await createCommentApi(commentContent, post.id)
        if (resp.message == 'success') {
            setComments(resp.comments)
            setCommentContent("")
        }
        setLoading(false)
    }

    useEffect(
        () => reverseComment(),
        [])


    function setFormForUpdate(comment) {
        setCommentContent(comment.content)
        setIsUpdatingComment(comment._id)
    }
    async function updateComment(e) {
        e.preventDefault()
        setLoading(true)
        const resp = await updateCommentApi(commentContent, isUpdatingComment);
        if (resp.message == 'success') {
            const { comments } = await getCommentsApi(resp.comment.post)
            setComments(comments)
            setCommentContent('')
            setIsUpdatingComment(null)
        }
        setLoading(false)
    }

    return <>
        {
            <div className="relative bg-white w-full rounded-md shadow-md h-auto py-3 px-3 my-5">
                {isDeletPost && <div className="bg-white/80 absolute inset-0 rounded-md flex justify-center items-center z-30">
                    <Spinner />
                </div>}


                <PostHeader
                    setIsDeletPost={setIsDeletPost}
                    callback={callback}
                    postId={post._id}
                    name={post.user.name}
                    photo={post.user.photo}
                    date={post.createdAt.split('.', 1)[0].replace('T', ' ')}
                    userId={post.user._id}
                />

                <Link to={"/single-post/" + post.id}>
                    <PostBody body={post.body} image={post.image} />
                </Link>




                <PostFooter comments={comments.length} id={post.id} />


                <form onSubmit={isUpdatingComment ? updateComment : createComment} className='flex gap-1 mt-2 py-3 ' >
                    <Input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder='Add Comment'></Input>
                    <Button type='submit' isLoading={loading} disabled={commentContent.length == 0}>Comment</Button>
                </form>




                {post.comments.length > 0 &&
                    comments.slice(0, commentLimit).map((comment) => <PostComment
                        key={post.id}
                        comment={comment}
                        userId={post.user._id}
                        setFormForUpdate={setFormForUpdate}
                        updateComment={updateComment}
                    />)
                }







            </div>
        }

    </>
}
