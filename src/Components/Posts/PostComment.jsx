import React from 'react'
import CommentItem from './CommentItem'

/**
 * PostComment — thin wrapper that renders a single top-level comment
 * using the self-contained CommentItem component.
 *
 * Props:
 *   comment  – the comment object from the API
 *   postId   – the parent post's _id (required for API calls inside CommentItem)
 *   onDelete – (commentId) => void  called when this comment is deleted
 */
export default function PostComment({ comment, postId, onDelete }) {
    return (
        <CommentItem
            comment={comment}
            postId={postId}
            onDelete={onDelete}
            isReply={false}
        />
    )
}
