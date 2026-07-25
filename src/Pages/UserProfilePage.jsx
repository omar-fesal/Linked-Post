import React, { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
    FileText, Users, UserCheck, Bookmark,
    Calendar, Mail, UserPlus, Loader2, ArrowLeft
} from 'lucide-react'
import GetUserProfile, { GetUserPosts } from '../Services/GetUserInfo'
import { followAndUnFollowApi } from '../Services/PostService'
import PostCard from '../Components/Posts/PostCard'
import LoadingScreen from '../Components/LoadingScreen'
import { AuthContext } from '../context/AuthContext'
import FollowListModal from '../Components/Posts/FollowListModal'

export default function UserProfilePage() {
    const { userId } = useParams()
    const navigate = useNavigate()
    const { userData: currentUser } = useContext(AuthContext)
    const [modal, setModal] = useState(null) // 'followers' | 'following' | null

    // Fetch the target user's profile
    const {
        data: profileData,
        isLoading: profileLoading,
        refetch: refetchProfile,
    } = useQuery({
        queryKey: ['user-profile-page', userId],
        queryFn: () => GetUserProfile(userId),
        enabled: !!userId,
    })

    // Fetch the target user's posts
    const { data: postsData, isLoading: postsLoading } = useQuery({
        queryKey: ['user-posts-page', userId],
        queryFn: () => GetUserPosts(userId),
        enabled: !!userId,
    })

    const user = profileData?.data?.user
    const isFollowing = profileData?.data?.isFollowing ?? false
    const posts = postsData?.data?.posts ?? []

    // Follow / Unfollow mutation
    const { mutate: toggleFollow, isPending: followPending } = useMutation({
        mutationFn: () => followAndUnFollowApi(userId),
        onSuccess: () => refetchProfile(),
    })

    if (profileLoading) return <LoadingScreen />

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null

    const dob = user?.dateOfBirth
        ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null

    const isOwnProfile = currentUser?._id === user?._id

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Top bar ── */}
            <div className="max-w-2xl mx-auto px-4 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {/* ── Profile card ── */}
            <div className="max-w-2xl mx-auto px-4">
                <div className="w-full rounded-2xl bg-white shadow-sm border border-zinc-100 overflow-hidden">
                    {/* Cover gradient */}
                    <div
                        className="h-32 w-full"
                        style={{
                            background: user?.cover
                                ? `url(${user.cover}) center/cover no-repeat`
                                : 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
                        }}
                    />

                    {/* Avatar + info row */}
                    <div className="px-6 pb-4">
                        {/* Avatar overlapping the cover */}
                        <div className="relative -mt-10 mb-3 flex items-end justify-between">
                            <div className="w-20 h-20 rounded-full ring-4 ring-white overflow-hidden bg-white shadow">
                                <img
                                    src={
                                        user?.photo ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=160`
                                    }
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Follow / Following button — only for other users */}
                            {!isOwnProfile && (
                                <button
                                    onClick={() => !followPending && toggleFollow()}
                                    disabled={followPending}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all select-none
                                        ${isFollowing
                                            ? 'bg-zinc-100 text-zinc-700 hover:bg-red-50 hover:text-red-600 border border-zinc-200'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }
                                        ${followPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {followPending
                                        ? <Loader2 size={15} className="animate-spin" />
                                        : isFollowing
                                            ? <UserCheck size={15} />
                                            : <UserPlus size={15} />
                                    }
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>

                        {/* Name + username */}
                        <h1 className="text-xl font-bold text-zinc-900 leading-tight">
                            {user?.name || 'Unknown User'}
                        </h1>
                        {user?.username && (
                            <p className="text-sm text-zinc-500 mt-0.5">@{user.username}</p>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-zinc-400">
                            {user?.email && (
                                <span className="flex items-center gap-1">
                                    <Mail size={12} /> {user.email}
                                </span>
                            )}
                            {joinDate && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} /> Joined {joinDate}
                                </span>
                            )}
                            {dob && (
                                <span className="flex items-center gap-1">
                                    🎂 {dob}
                                </span>
                            )}
                            {user?.gender && (
                                <span className="capitalize flex items-center gap-1">
                                    {user.gender === 'male' ? '♂' : '♀'} {user.gender}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-zinc-100 mx-6" />

                    {/* Stats row */}
                    <div className="grid grid-cols-4 divide-x divide-zinc-100">
                        {[
                            { label: 'POSTS', value: posts.length, icon: <FileText size={13} />, onClick: null },
                            { label: 'FOLLOWERS', value: user?.followersCount ?? 0, icon: <Users size={13} />, onClick: () => setModal('followers') },
                            { label: 'FOLLOWING', value: user?.followingCount ?? 0, icon: <UserCheck size={13} />, onClick: () => setModal('following') },
                            { label: 'BOOKMARKS', value: user?.bookmarksCount ?? 0, icon: <Bookmark size={13} />, onClick: null },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                onClick={stat.onClick ?? undefined}
                                className={`flex flex-col items-center py-4 px-2 transition-colors
                                    ${stat.onClick
                                        ? 'cursor-pointer hover:bg-indigo-50 select-none'
                                        : 'cursor-default hover:bg-zinc-50'
                                    }`}
                            >
                                <span className="text-xl font-bold text-indigo-500">{stat.value}</span>
                                <span className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1 tracking-wide">
                                    {stat.icon}
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Posts ── */}
            <div className="max-w-2xl mx-auto px-4 py-4">
                {postsLoading ? (
                    <LoadingScreen />
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} commentLimit={1} />
                    ))
                ) : (
                    <div className="bg-white rounded-md shadow p-8 text-center mt-4">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Posts Yet</h2>
                        <p className="text-gray-500">This user hasn't shared any posts yet.</p>
                    </div>
                )}
            </div>

            {/* Followers / Following modal */}
            {modal && userId && (
                <FollowListModal
                    type={modal}
                    userId={userId}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    )
}
