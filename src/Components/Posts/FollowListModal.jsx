import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { X, Users, UserCheck, Loader2, AlertCircle } from 'lucide-react'
import GetUserProfile from '../../Services/GetUserInfo'

/**
 * FollowListModal
 * @param {string}   type     - 'followers' | 'following'
 * @param {string}   userId   - ID of the user whose list to show
 * @param {Function} onClose  - called when the modal should be dismissed
 */
export default function FollowListModal({ type, userId, onClose }) {
    const navigate = useNavigate()
    const overlayRef = useRef(null)

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    // GetUserProfile already contains populated followers/following arrays
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user-profile-modal', userId],
        queryFn: () => GetUserProfile(userId),
        enabled: !!userId,
    })

    // The API returns data.data.user.followers / data.data.user.following
    // Each entry is a full user object: { _id, name, photo, ... }
    const users = data?.data?.user?.[type] ?? []

    const isFollowers = type === 'followers'

    const handleUserClick = (uid) => {
        onClose()
        navigate(`/user/${uid}`)
    }

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose()
    }

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-zinc-100 overflow-hidden"
                style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        {isFollowers
                            ? <Users size={18} className="text-indigo-500" />
                            : <UserCheck size={18} className="text-indigo-500" />
                        }
                        <h2 className="text-base font-semibold text-zinc-800 capitalize">
                            {type}
                        </h2>
                        {!isLoading && !isError && (
                            <span className="ml-1 text-xs font-medium text-white bg-indigo-500 rounded-full px-2 py-0.5">
                                {users.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-700 transition-colors rounded-full p-1 hover:bg-zinc-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="overflow-y-auto flex-1 px-3 py-3">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 size={28} className="animate-spin text-indigo-400" />
                            <p className="text-sm text-zinc-400">Loading {type}…</p>
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-red-400">
                            <AlertCircle size={28} />
                            <p className="text-sm">Failed to load {type}.</p>
                        </div>
                    )}

                    {!isLoading && !isError && users.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-400">
                            {isFollowers
                                ? <Users size={36} className="opacity-40" />
                                : <UserCheck size={36} className="opacity-40" />
                            }
                            <p className="text-sm font-medium">No {type} yet</p>
                        </div>
                    )}

                    {!isLoading && !isError && users.map((u) => (
                        <button
                            key={u._id}
                            onClick={() => handleUserClick(u._id)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 transition-colors text-left group"
                        >
                            {/* Avatar */}
                            <img
                                src={
                                    u.photo ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=random&size=80`
                                }
                                alt={u.name}
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                            />

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-800 group-hover:text-indigo-600 transition-colors truncate">
                                    {u.name || 'Unknown'}
                                </p>
                                {u.username && (
                                    <p className="text-xs text-zinc-400 truncate">@{u.username}</p>
                                )}
                            </div>

                            {/* Arrow hint */}
                            <span className="text-zinc-300 group-hover:text-indigo-400 transition-colors text-lg leading-none shrink-0">›</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
