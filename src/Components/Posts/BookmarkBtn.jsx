import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { bookmarkApi } from '../../Services/PostService'
import toast from 'react-hot-toast'

export default function BookmarkBtn({ postId, initialBookmarked = false }) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)

    const { mutate, isPending } = useMutation({
        mutationFn: () => bookmarkApi(postId),
        onSuccess: (data) => {
            const bookmarked = data.data.bookmarked
            setIsBookmarked(bookmarked)
            toast.success(bookmarked ? 'Post saved! 🔖' : 'Removed from bookmarks')
        },
        onError: () => {
            toast.error('Failed to update bookmark. Try again.')
        }
    })

    return (
        <button
            onClick={() => { if (!isPending) mutate() }}
            title={isBookmarked ? 'Remove bookmark' : 'Save post'}
            className="flex items-center justify-center p-1 cursor-pointer"
            style={{ background: 'none', border: 'none', opacity: isPending ? 0.5 : 1 }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill={isBookmarked ? '#f59e0b' : 'none'}
                stroke={isBookmarked ? '#f59e0b' : '#6b7280'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
        </button>
    )
}
