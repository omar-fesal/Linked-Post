import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    getAllNotificationsApi,
    getUnreadCountApi,
    markNotificationReadApi,
    markAllReadApi,
} from '../Services/NotificationService';

/* ─── Relative time helper (no external dep) ─────────────── */
function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}


/* ─── Icon helpers ──────────────────────────────────────────── */
function NotifIcon({ type }) {
    const base = 'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow';

    if (type === 'follow_user') {
        return (
            <span className={`${base} bg-emerald-100`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                </svg>
            </span>
        );
    }
    if (type === 'like_post' || type === 'like_comment') {
        return (
            <span className={`${base} bg-blue-100`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3m7-10a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2l-1 5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5Z" />
                </svg>
            </span>
        );
    }
    if (type === 'comment_post' || type === 'reply_comment') {
        return (
            <span className={`${base} bg-violet-100`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </span>
        );
    }
    // default bell
    return (
        <span className={`${base} bg-gray-100`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        </span>
    );
}

function actionLabel(type) {
    const map = {
        like_post: 'liked your post',
        like_comment: 'liked your comment',
        follow_user: 'started following you',
        comment_post: 'commented on your post',
        reply_comment: 'replied to your comment',
    };
    return map[type] ?? type.replace(/_/g, ' ');
}

function entityLink(n) {
    if (n.entityType === 'post' && !n.entity?.unavailable) return `/single-post/${n.entityId}`;
    if (n.entityType === 'user') return `/user/${n.entityId}`;
    return null;
}

/* ─── Single notification row ─────────────────────────────── */
function NotifItem({ notif, onRead }) {
    const link = entityLink(notif);
    const shortTime = timeAgo(notif.createdAt);

    return (
        <div
            className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200
                ${notif.isRead
                    ? 'bg-white border-gray-100'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
        >
            {/* Unread dot */}
            {!notif.isRead && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}

            {/* Type icon */}
            <NotifIcon type={notif.type} />

            {/* Avatar */}
            <img
                src={notif.actor.photo}
                alt={notif.actor.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow"
            />

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-snug">
                    <Link
                        to={`/user/${notif.actor._id}`}
                        className="font-semibold hover:underline mr-1"
                    >
                        {notif.actor.name}
                    </Link>
                    <span className={notif.isRead ? 'text-gray-500' : 'text-emerald-700 font-medium'}>
                        {actionLabel(notif.type)}
                    </span>
                </p>

                {/* Entity snippet */}
                {link && !notif.entity?.unavailable && (
                    <Link to={link} className="text-xs text-gray-400 hover:underline truncate block mt-0.5">
                        {notif.entity?.body || notif.entity?.name || ''}
                    </Link>
                )}

                {/* Bottom row */}
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">{shortTime}</span>

                    {notif.isRead ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Read
                        </span>
                    ) : (
                        <button
                            onClick={() => onRead(notif._id)}
                            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Mark as read
                        </button>
                    )}
                </div>
            </div>

            {/* Time badge top-right */}
            <span className="text-xs text-gray-400 shrink-0 mt-0.5">{shortTime}</span>
        </div>
    );
}

/* ─── Skeleton loader ─────────────────────────────────────── */
function NotifSkeleton() {
    return (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function NotificationPage() {
    const [tab, setTab] = useState('all'); // 'all' | 'unread'
    const [page, setPage] = useState(1);
    const limit = 10;

    const qc = useQueryClient();

    /* Fetch notifications */
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['notifications', tab, page],
        queryFn: () => getAllNotificationsApi({ page, limit, unread: tab === 'unread' }),
        keepPreviousData: true,
    });

    /* Fetch unread count */
    const { data: countData } = useQuery({
        queryKey: ['notif-unread-count'],
        queryFn: getUnreadCountApi,
        refetchInterval: 30_000, // poll every 30s
    });

    const notifications = data?.data?.notifications ?? [];
    const pagination = data?.meta?.pagination;
    const unreadCount = countData?.data?.unreadCount ?? 0;

    /* Mark one as read */
    const { mutate: markRead } = useMutation({
        mutationFn: markNotificationReadApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
            qc.invalidateQueries({ queryKey: ['notif-unread-count'] });
        },
    });

    /* Mark all as read */
    const { mutate: markAll, isPending: isMarkingAll } = useMutation({
        mutationFn: markAllReadApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
            qc.invalidateQueries({ queryKey: ['notif-unread-count'] });
        },
    });

    const handleTabChange = (t) => {
        setTab(t);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* ── Page header ── */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-sm text-gray-500">Stay on top of updates you care about</p>
                        </div>
                    </div>

                    {/* Mark all as read */}
                    <button
                        onClick={() => markAll()}
                        disabled={isMarkingAll || unreadCount === 0}
                        className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {isMarkingAll ? 'Marking…' : 'Mark all as read'}
                    </button>

                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'all'
                            ? 'bg-emerald-500 text-white shadow'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleTabChange('unread')}
                        className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'unread'
                            ? 'bg-emerald-500 text-white shadow'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold leading-none
                                ${tab === 'unread' ? 'bg-white text-emerald-600' : 'bg-red-500 text-white'}`}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Notification list ── */}
                <div className="space-y-2">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <NotifSkeleton key={i} />)
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <p className="text-base font-medium">
                                {tab === 'unread' ? 'All caught up! 🎉' : 'No notifications yet'}
                            </p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <NotifItem key={n._id} notif={n} onRead={markRead} />
                        ))
                    )}

                    {isFetching && !isLoading && (
                        <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* ── Pagination ── */}
                {pagination && pagination.numberOfPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ← Prev
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {pagination.currentPage} of {pagination.numberOfPages}
                        </span>
                        <button
                            disabled={!pagination.nextPage}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
