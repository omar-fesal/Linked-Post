import React, { useState, useEffect } from 'react'
import placeholder from '../../assets/placeholder.png'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostComment from './PostComment'
import PostFooter from './PostFooter'
import { Link } from 'react-router-dom'
import { Repeat2 } from 'lucide-react'
import { Button, InputGroup, Spinner } from '@heroui/react'
import {
    createCommentApi,
    getPostComments,
} from '../../Services/CommentService'

import { useMutation, useQuery } from '@tanstack/react-query'
import { ImagePlus } from "lucide-react"
import GetUserProfile from '../../Services/GetUserInfo'
import { followAndUnFollowApi } from '../../Services/PostService'
import toast from 'react-hot-toast'




export default function PostCard({ post: initialPost, commentLimit, callback, onPostShared }) {
    // Local copy of post so edits reflect instantly without refetching
    const [post, setPost] = useState(initialPost);


    function handlePostUpdated(updatedPost) {
        // Keep the original user + sharedPost objects — the API response doesn't
        // return them populated, so spreading updatedPost would wipe them out.
        setPost(prev => ({ ...prev, ...updatedPost, user: prev.user, sharedPost: prev.sharedPost }));
    }


    const { data, refetch } = useQuery({
        queryKey: ['comments', post?._id],
        queryFn: () => getPostComments(post._id),
        enabled: !!post?._id
    })

    const { data: usersData } = useQuery({
        queryKey: ['user-profile', post?.user?._id],
        queryFn: () => GetUserProfile(post?.user?._id),
        enabled: !!post?.user?._id
    });

    const comments = data?.data?.comments || []

    const [commentContent, setCommentContent] = useState('')
    const [loading, setLoading] = useState(false)

    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)

    const [isDeletPost, setIsDeletPost] = useState(false)
    const [likesCount, setLikesCount] = useState(post?.likesCount)
    const [localComments, setLocalComments] = useState([])


    // Sync localComments with fetched data
    useEffect(() => {
        if (data?.data?.comments) {
            setLocalComments(data.data.comments)
        }
    }, [data])

    function handleImage(e) {
        const file = e.target.files[0]
        setImage(file)
        file && setImageUrl(URL.createObjectURL(file))
        e.target.value = ''
    }


    async function createComment(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()

        commentContent && formData.append("content", commentContent)
        image && formData.append("image", image)


        const resp = await createCommentApi(formData, post._id)

        if (resp?.success === true) {
            // Instantly prepend the new comment — no refetch needed
            setLocalComments((prev) => [resp.data.comment, ...prev])
            setCommentContent('')
            setImage(null)
            setImageUrl(null)
            toast.success('Comment added! 💬')
        } else {
            toast.error('Failed to post comment. Please try again.')
        }

        setLoading(false)
    }


    // Remove a comment from the local list immediately (after delete inside CommentItem)
    function handleCommentDeleted(commentId) {
        setLocalComments((prev) => prev.filter((c) => c._id !== commentId))
    }


    // Drive follow state from the query; sync whenever the query resolves
    const [isFollowState, setIsFollowState] = useState(false);

    useEffect(() => {
        if (usersData?.data?.isFollowing !== undefined) {
            setIsFollowState(usersData.data.isFollowing);
        }
    }, [usersData?.data?.isFollowing]);

    const { mutate, isPending } = useMutation({
        mutationFn: () => followAndUnFollowApi(post?.user?._id),

        onSuccess: (data) => {

            if (data?.data?.following !== undefined) {
                setIsFollowState(data.data.following);
            }
        }
    });


    return (
        <div className="relative bg-white w-full rounded-md shadow-md h-auto py-3 px-3 my-5">

            {/* Loading overlay */}
            {isDeletPost && (
                <div className="bg-white/80 absolute inset-0 flex justify-center items-center z-30">
                    <Spinner />
                </div>
            )}

            {/* Header */}
            <PostHeader
                setIsDeletPost={setIsDeletPost}
                post={post}
                callback={callback}
                postId={post?._id}
                name={post?.user.name}
                photo={post?.user.photo}
                date={post?.createdAt?.split('.', 1)[0]?.replace('T', ' ')}
                userId={post?.user._id}
                onPostUpdated={handlePostUpdated}
                isFollow={isFollowState}
                usersId={post?.user?._id}
                onFollowToggle={mutate}
                isFollowPending={isPending}
            />



            {/* Body — shared post */}
            {post?.isShare ? (
                <div>
                    {/* Sharer's optional caption */}
                    {post?.body ? (
                        <p className="text-sm text-zinc-800 dark:text-zinc-200 mb-2 px-1">{post.body}</p>
                    ) : null}

                    {post?.sharedPost ? (
                        /* ── Embedded original post card ── */
                        <Link to={`/single-post/${post.sharedPost._id}`}>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                {/* Original author header */}
                                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                                    <img
                                        src={post.sharedPost.user?.photo || placeholder}
                                        alt={post.sharedPost.user?.name}
                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                            {post.sharedPost.user?.name}
                                        </span>
                                        <span className="text-[11px] text-zinc-400">
                                            @{post.sharedPost.user?.username}
                                            {' · '}
                                            {post.sharedPost.createdAt?.split('.')[0]?.replace('T', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Original body text */}
                                {post.sharedPost.body && (
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 px-3 pb-2">
                                        {post.sharedPost.body}
                                    </p>
                                )}

                                {/* Original image */}
                                {post.sharedPost.image && (
                                    <img
                                        src={post.sharedPost.image}
                                        alt={post.sharedPost.body || 'shared'}
                                        className="w-full object-cover max-h-80"
                                    />
                                )}

                                {/* Mini stats bar */}
                                <div className="flex items-center gap-4 px-3 py-2 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-400">
                                    <span>{post.sharedPost.likesCount ?? 0} likes</span>
                                    <span>{post.sharedPost.commentsCount ?? 0} comments</span>
                                    <span>{post.sharedPost.sharesCount ?? 0} shares</span>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        /* Original post was deleted */
                        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-6 text-center text-sm text-zinc-400">
                            <Repeat2 size={20} className="mx-auto mb-1 opacity-40" />
                            This post is no longer available.
                        </div>
                    )}
                </div>
            ) : (
                /* ── Regular (non-shared) post ── */
                <Link to={"/single-post/" + post?._id}>
                    <PostBody body={post?.body} image={post?.image} />
                </Link>
            )}

            {/* Footer */}
            <PostFooter
                commentsCount={comments.length}
                id={post?._id}
                likesCount={likesCount}
                post={post}
                onPostShared={onPostShared}
            />

            {/* COMMENT FORM */}
            <form
                onSubmit={createComment}
                className="flex gap-2 mt-3"
            >
                <InputGroup className="w-full">
                    <InputGroup.Input
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add a comment…"
                    />
                    <InputGroup.Suffix>
                        <input
                            type="file"
                            id="comment-image"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImage}
                        />

                        <label htmlFor="comment-image" className="cursor-pointer">
                            <ImagePlus size={20} />
                        </label>
                    </InputGroup.Suffix>
                </InputGroup>

                <Button
                    type="submit"
                    isPending={loading}
                    isDisabled={!(image || commentContent.trim())}
                >
                    Comment
                </Button>
            </form>

            {/* IMAGE PREVIEW */}
            {imageUrl && (
                <div className="mt-2 relative inline-block">
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-md"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setImage(null)
                            setImageUrl(null)
                        }}
                        className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* COMMENTS LIST */}
            {localComments.length > 0 &&
                localComments.slice(0, commentLimit).map((comment) => (
                    <PostComment
                        key={comment._id}
                        comment={comment}
                        postId={post._id}
                        onDelete={handleCommentDeleted}
                    />
                ))}
        </div>
    )
}
