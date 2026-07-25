import React, { useContext, useState, useRef, useEffect } from 'react'
import placeholder from '../../assets/placeholder.png'
import { AuthContext } from '../../context/AuthContext'
import {
    likeAndUnlikeCommentApi,
    createReplyApi,
    getPostReplyApi,
    deleteCommentApi,
    updateCommentApi,
} from '../../Services/CommentService'
import { ImagePlus, MoreHorizontal, Pencil, Trash2, Heart, Reply, X, Send, ChevronDown } from 'lucide-react'

const REPLY_INITIAL_LIMIT = 6

// Pure helper — derives liked state from comment data + current user ID
// Handles both string and ObjectId types, and an explicit isLiked boolean
function deriveLiked(comment, userId) {
    if (comment.isLiked !== undefined) return Boolean(comment.isLiked)
    if (!Array.isArray(comment.likes)) return false
    const uid = String(userId ?? '')
    return comment.likes.some((id) => String(id) === uid)
}

/* ─────────────────────────────────────────────── */
/*  Tiny inline edit form that replaces the bubble  */
/* ─────────────────────────────────────────────── */
function InlineEditForm({ comment, postId, onCancel, onSaved }) {
    const [content, setContent] = useState(comment.content || '')
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [existingImage, setExistingImage] = useState(comment.image || null)
    const [saving, setSaving] = useState(false)
    const fileId = `edit-img-${comment._id}`

    function handleFile(e) {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setImageUrl(URL.createObjectURL(file))
        e.target.value = ''
    }

    async function handleSave(e) {
        e.preventDefault()
        if (!content.trim() && !image && !existingImage) return
        setSaving(true)
        const fd = new FormData()
        content.trim() && fd.append('content', content)
        image && fd.append('image', image)
        const resp = await updateCommentApi(postId, comment._id, fd)
        setSaving(false)
        // Accept any non-error response (API may return different message strings)
        if (resp && !resp.message?.toLowerCase().includes('error') && !resp.status) {
            onSaved({
                content: content.trim(),
                image: imageUrl || existingImage || null,
            })
        }
    }

    return (
        <form onSubmit={handleSave} className="w-full">
            {/* Text area */}
            <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Image preview */}
            {(imageUrl || existingImage) && (
                <div className="relative inline-block mt-1 mb-1">
                    <img
                        src={imageUrl || existingImage}
                        alt="preview"
                        className="h-16 w-16 rounded-md object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => { setImage(null); setImageUrl(null); setExistingImage(null) }}
                        className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                        <X size={10} />
                    </button>
                </div>
            )}

            {/* Actions row */}
            <div className="flex items-center gap-2 mt-1">
                <input
                    type="file" id={fileId} className="hidden"
                    accept="image/*" onChange={handleFile}
                />
                <label htmlFor={fileId} className="cursor-pointer text-gray-500 hover:text-blue-500">
                    <ImagePlus size={16} />
                </label>

                <div className="flex gap-2 ml-auto">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-xs text-gray-500 font-semibold hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || (!content.trim() && !image && !existingImage)}
                        className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                        {saving ? 'Saving…' : <><Send size={12} /> Save</>}
                    </button>
                </div>
            </div>
        </form>
    )
}

/* ─────────────────────────────────────────────── */
/*  Reply creation form (inline under a comment)   */
/* ─────────────────────────────────────────────── */
function ReplyForm({ postId, commentId, onReplied, onCancel, creatorPhoto }) {
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const inputRef = useRef(null)
    const fileId = `reply-img-${commentId}`

    useEffect(() => { inputRef.current?.focus() }, [])

    function handleFile(e) {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setImageUrl(URL.createObjectURL(file))
        e.target.value = ''
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!content.trim() && !image) return
        setSubmitting(true)
        const fd = new FormData()
        content.trim() && fd.append('content', content)
        image && fd.append('image', image)
        const resp = await createReplyApi(postId, commentId, fd)
        setSubmitting(false)
        if (resp?.message === 'reply created successfully') {
            onReplied(resp.data.reply)
            setContent('')
            setImage(null)
            setImageUrl(null)
        }
    }

    return (
        <div className="flex items-start gap-2 mt-2 ml-10">
            <img
                src={creatorPhoto || placeholder}
                onError={(e) => (e.target.src = placeholder)}
                alt="you"
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
            />
            <form onSubmit={handleSubmit} className="flex-1">
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-1.5">
                    <input
                        ref={inputRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a reply…"
                        className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <input
                        type="file" id={fileId} className="hidden"
                        accept="image/*" onChange={handleFile}
                    />
                    <label htmlFor={fileId} className="cursor-pointer text-gray-400 hover:text-blue-500">
                        <ImagePlus size={15} />
                    </label>
                    <button
                        type="submit"
                        disabled={submitting || (!content.trim() && !image)}
                        className="text-blue-500 disabled:opacity-40 hover:text-blue-600"
                    >
                        <Send size={15} />
                    </button>
                </div>

                {imageUrl && (
                    <div className="relative inline-block mt-1">
                        <img src={imageUrl} alt="preview" className="h-14 w-14 rounded-md object-cover" />
                        <button
                            type="button"
                            onClick={() => { setImage(null); setImageUrl(null) }}
                            className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                            <X size={10} />
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-gray-400 hover:text-gray-600 mt-1 ml-1"
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

/* ─────────────────────────────────────────────── */
/*  Three-dots dropdown menu                        */
/* ─────────────────────────────────────────────── */
function ThreeDotMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>

            {open && (
                <div className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[130px] py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                        onClick={() => { setOpen(false); onEdit() }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                        <Pencil size={14} />
                        Edit
                    </button>
                    <button
                        onClick={() => { setOpen(false); onDelete() }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

/* ─────────────────────────────────────────────── */
/*  Main CommentItem — recursive for replies        */
/* ─────────────────────────────────────────────── */
export default function CommentItem({
    comment: initialComment,
    postId,
    onDelete,    // (commentId) => void  — called when deleted so parent list updates
    isReply = false,
}) {
    const { userData } = useContext(AuthContext)
    const isOwner = userData?._id === initialComment.commentCreator?._id

    /* ── local comment state (for optimistic like updates + edits) ── */
    const [comment, setComment] = useState(initialComment)

    /* ── like state ── */
    const [liked, setLiked] = useState(() => deriveLiked(initialComment, userData?._id))
    const [likeCount, setLikeCount] = useState(initialComment.likesCount ?? initialComment.likes?.length ?? 0)
    const [likePending, setLikePending] = useState(false)

    // Re-sync when the comment is re-fetched from the API (e.g. on page refresh)
    useEffect(() => {
        setLiked(deriveLiked(initialComment, userData?._id))
        setLikeCount(initialComment.likesCount ?? initialComment.likes?.length ?? 0)
    }, [initialComment._id, initialComment.likes, initialComment.likesCount, initialComment.isLiked, userData?._id])

    /* ── inline editing ── */
    const [isEditing, setIsEditing] = useState(false)

    /* ── reply UI ── */
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replies, setReplies] = useState([])
    const [repliesLoaded, setRepliesLoaded] = useState(false)
    const [loadingReplies, setLoadingReplies] = useState(false)
    const [replyLimit, setReplyLimit] = useState(REPLY_INITIAL_LIMIT)
    const [totalReplies, setTotalReplies] = useState(comment.repliesCount ?? 0)

    /* ── Like handler ── */
    async function handleLike() {
        if (likePending) return
        setLikePending(true)
        // optimistic
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikeCount((c) => c + (wasLiked ? -1 : 1))
        try {
            const resp = await likeAndUnlikeCommentApi(postId, comment._id)
            if (resp?.data) {
                setLiked(resp.data.liked)
                setLikeCount(resp.data.likesCount)
            }
        } catch {
            // revert on failure
            setLiked(wasLiked)
            setLikeCount((c) => c + (wasLiked ? 1 : -1))
        } finally {
            setLikePending(false)
        }
    }

    /* ── Delete handler ── */
    async function handleDelete() {
        await deleteCommentApi(postId, comment._id)
        onDelete?.(comment._id)
    }

    /* ── Edit saved ── */
    function handleSaved(updatedFields) {
        // Merge updated fields directly into local comment state — no refresh needed
        setComment((prev) => ({
            ...prev,
            content: updatedFields.content ?? prev.content,
            image: updatedFields.image !== undefined ? updatedFields.image : prev.image,
        }))
        setIsEditing(false)
    }

    /* ── Load replies ── */
    async function loadReplies(limit = REPLY_INITIAL_LIMIT) {
        setLoadingReplies(true)
        const resp = await getPostReplyApi(postId, comment._id, limit)
        if (resp?.data?.replies) {
            setReplies(resp.data.replies)
            setTotalReplies(resp.data.totalReplies ?? resp.data.replies.length)
        }
        setRepliesLoaded(true)
        setLoadingReplies(false)
    }

    /* ── Toggle reply form — also triggers initial reply load ── */
    function handleToggleReply() {
        setShowReplyForm((v) => !v)
        if (!repliesLoaded) loadReplies(REPLY_INITIAL_LIMIT)
    }

    /* ── New reply added ── */
    function handleReplied(newReply) {
        setReplies((prev) => [...prev, newReply])
        setTotalReplies((n) => n + 1)
        setShowReplyForm(false)
        setRepliesLoaded(true)
    }

    /* ── Reply deleted ── */
    function handleReplyDeleted(replyId) {
        setReplies((prev) => prev.filter((r) => r._id !== replyId))
        setTotalReplies((n) => Math.max(0, n - 1))
    }

    /* ── View more replies ── */
    function handleViewMore() {
        const newLimit = replyLimit + 100 // load everything
        setReplyLimit(newLimit)
        loadReplies(newLimit)
    }

    const hasMoreReplies = totalReplies > replies.length && repliesLoaded

    return (
        <div className={`flex items-start gap-2 ${isReply ? 'ml-10 mt-2' : 'mt-3'}`}>
            {/* Avatar */}
            <img
                src={comment.commentCreator?.photo || placeholder}
                onError={(e) => (e.target.src = placeholder)}
                alt={comment.commentCreator?.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
            />

            <div className="flex-1 min-w-0">
                {/* Bubble */}
                {isEditing ? (
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <InlineEditForm
                            comment={comment}
                            postId={postId}
                            onCancel={() => setIsEditing(false)}
                            onSaved={handleSaved}
                        />
                    </div>
                ) : (
                    <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
                        <p className="text-xs font-semibold text-gray-900 leading-tight">
                            {comment.commentCreator?.name}
                        </p>
                        {comment.content && (
                            <p className="text-sm text-gray-800 mt-0.5 break-words whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        )}
                        {comment.image && (
                            <div className="mt-2 overflow-hidden rounded-lg">
                                <img
                                    src={comment.image}
                                    alt="comment attachment"
                                    className="max-h-60 w-auto rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Action row */}
                <div className="flex items-center gap-3 mt-1 ml-1">
                    {/* Timestamp */}
                    <span className="text-[11px] text-gray-400">
                        {comment.createdAt?.split('.')[0]?.replace('T', ' ')}
                    </span>

                    {/* Like */}
                    <button
                        onClick={handleLike}
                        disabled={likePending}
                        className={`text-xs font-semibold transition-colors ${liked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                        Like
                    </button>

                    {/* Reply (only for top-level comments) */}
                    {!isReply && (
                        <button
                            onClick={handleToggleReply}
                            className="text-xs font-semibold text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            Reply
                        </button>
                    )}
                </div>

                {/* Like count + three-dots row */}
                <div className="flex items-center gap-1 mt-0.5 ml-1">
                    {likeCount > 0 && (
                        <div className="flex items-center gap-0.5">
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                <Heart size={9} fill="white" stroke="none" />
                            </div>
                            <span className="text-[11px] text-gray-500">{likeCount}</span>
                        </div>
                    )}
                </div>

                {/* Three-dots — floated right, only owner */}
                {isOwner && !isEditing && (
                    <div className="absolute right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                {/* Replies section */}
                {!isReply && (
                    <>
                        {/* Show replies toggle button when there are known replies */}
                        {totalReplies > 0 && !repliesLoaded && (
                            <button
                                onClick={() => loadReplies(REPLY_INITIAL_LIMIT)}
                                disabled={loadingReplies}
                                className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-blue-500 transition-colors mt-1 ml-1"
                            >
                                <ChevronDown size={13} />
                                {loadingReplies ? 'Loading…' : `View ${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}`}
                            </button>
                        )}

                        {/* Reply form */}
                        {showReplyForm && (
                            <ReplyForm
                                postId={postId}
                                commentId={comment._id}
                                creatorPhoto={userData?.photo}
                                onReplied={handleReplied}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        )}

                        {/* Replies list */}
                        {replies.length > 0 && (
                            <div className="mt-1">
                                {replies.map((reply) => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        postId={postId}
                                        onDelete={handleReplyDeleted}
                                        isReply={true}
                                    />
                                ))}

                                {/* View more replies */}
                                {hasMoreReplies && (
                                    <button
                                        onClick={handleViewMore}
                                        disabled={loadingReplies}
                                        className="flex items-center gap-1 ml-10 mt-1 text-xs font-semibold text-gray-500 hover:text-blue-500 transition-colors"
                                    >
                                        <ChevronDown size={13} />
                                        {loadingReplies ? 'Loading…' : `View ${totalReplies - replies.length} more ${totalReplies - replies.length === 1 ? 'reply' : 'replies'}`}
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Three-dots button — outside bubble, always visible on hover */}
            {isOwner && !isEditing && (
                <ThreeDotMenu
                    onEdit={() => setIsEditing(true)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
