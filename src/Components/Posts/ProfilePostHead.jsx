import React, { useContext, useState, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { FileText, Users, UserCheck, Bookmark, Camera, ImagePlus, Loader2, CheckCircle, XCircle } from 'lucide-react'
import FollowListModal from './FollowListModal'
import { UploadProfilePhotoApi, UploadCoverPhotoApi } from '../../Services/UploadProfilePhoto'

/* ─── tiny toast ─────────────────────────────────────────────── */
function Toast({ type, msg }) {
    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium text-white transition-all
            ${type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {type === 'ok' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {msg}
        </div>
    )
}

export default function ProfilePostHead({ postsCount }) {
    const { userData, setUserData } = useContext(AuthContext)
    const [modal, setModal] = useState(null)           // 'followers' | 'following' | null
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [coverLoading, setCoverLoading] = useState(false)
    const [toast, setToast] = useState(null)           // { type:'ok'|'err', msg }

    const avatarInputRef = useRef(null)
    const coverInputRef = useRef(null)

    /* ── show a self-dismissing toast ── */
    function showToast(type, msg) {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3000)
    }

    /* ── avatar upload ── */
    async function handleAvatarChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarLoading(true)
        const fd = new FormData()
        fd.append('photo', file)
        const res = await UploadProfilePhotoApi(fd)
        setAvatarLoading(false)
        if (res?.message === 'success' || res?.success) {
            // Optimistically update avatar in context
            setUserData(prev => ({ ...prev, photo: res?.data?.user?.photo || URL.createObjectURL(file) }))
            showToast('ok', 'Profile photo updated!')
        } else {
            showToast('err', res?.message || 'Upload failed')
        }
        e.target.value = ''
    }

    /* ── cover upload ── */
    async function handleCoverChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        setCoverLoading(true)
        const fd = new FormData()
        fd.append('cover', file)
        const res = await UploadCoverPhotoApi(fd)
        setCoverLoading(false)
        if (res?.message === 'success' || res?.success) {
            setUserData(prev => ({ ...prev, cover: res?.data?.user?.cover || URL.createObjectURL(file) }))
            showToast('ok', 'Cover photo updated!')
        } else {
            showToast('err', res?.message || 'Upload failed')
        }
        e.target.value = ''
    }

    const stats = [
        { label: 'POSTS', value: postsCount ?? 0, icon: <FileText size={14} />, onClick: null },
        { label: 'FOLLOWERS', value: userData?.followersCount ?? userData?.followers?.length ?? 0, icon: <Users size={14} />, onClick: () => setModal('followers') },
        { label: 'FOLLOWING', value: userData?.followingCount ?? userData?.following?.length ?? 0, icon: <UserCheck size={14} />, onClick: () => setModal('following') },
        { label: 'BOOKMARKS', value: userData?.bookmarksCount ?? userData?.savedPosts?.length ?? 0, icon: <Bookmark size={14} />, onClick: null },
    ]

    return (
        <>
            {/* Hidden file inputs */}
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

            <div className="w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">

                {/* ══ COVER PHOTO ══ */}
                <div className="relative group h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    {userData?.cover ? (
                        <img
                            src={userData.cover}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        /* Decorative gradient cover when no cover set */
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                    )}

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                    {/* Upload cover button */}
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        disabled={coverLoading}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex  items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white text-xs font-medium backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 select-none"
                    >
                        {coverLoading
                            ? <Loader2 size={13} className="animate-spin" />
                            : <ImagePlus size={13} />
                        }
                        {coverLoading ? 'Uploading…' : 'Edit cover'}
                    </button>
                </div>

                {/* ══ AVATAR + NAME ROW ══ */}
                <div className="px-6 pb-4">
                    <div className="relative -mt-12 mb-3 flex items-end justify-between">

                        {/* Avatar wrapper */}
                        <div className="relative group/avatar shrink-0">
                            <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-zinc-900 overflow-hidden shadow-lg bg-white">
                                {avatarLoading ? (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                        <Loader2 size={24} className="animate-spin text-indigo-400" />
                                    </div>
                                ) : (
                                    <img
                                        src={userData?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=random&size=192`}
                                        alt={userData?.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Camera overlay on avatar hover */}
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={avatarLoading}
                                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover/avatar:bg-black/40 transition-all duration-200 cursor-pointer"
                                title="Change profile photo"
                            >
                                <div className="opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center gap-0.5">
                                    <Camera size={20} className="text-white drop-shadow" />
                                    <span className="text-white text-[9px] font-semibold tracking-wide drop-shadow">EDIT</span>
                                </div>
                            </button>

                            {/* Online dot */}
                            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900 shadow" />
                        </div>

                        {/* Spacer — room for future action buttons */}
                        <div />
                    </div>

                    {/* Name & username */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                            {userData?.name || 'Loading…'}
                        </h1>
                        {userData?.username && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                                @{userData.username}
                            </p>
                        )}
                        <div className="mt-1.5 h-0.5 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-6" />

                {/* ══ STATS ROW ══ */}
                <div className="grid grid-cols-4 divide-x divide-zinc-100 dark:divide-zinc-800">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            onClick={stat.onClick ?? undefined}
                            className={`flex flex-col items-center py-4 px-2 transition-colors
                                ${stat.onClick
                                    ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 select-none'
                                    : 'cursor-default hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                }`}
                        >
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                {stat.value}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 tracking-wide">
                                {stat.icon}
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Follow list modal */}
            {modal && userData?._id && (
                <FollowListModal
                    type={modal}
                    userId={userData._id}
                    onClose={() => setModal(null)}
                />
            )}

            {/* Toast notification */}
            {toast && <Toast type={toast.type} msg={toast.msg} />}
        </>
    )
}
