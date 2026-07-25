import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Posts/Sidebar';
import SuggestedFriends from '../Components/Posts/SuggestedFriends';

export default function FeedPage() {
    return (
        <div className="max-w-7xl mx-auto flex gap-6">

            <aside className="w-64 sticky top-24 self-start mt-6">
                <Sidebar />
            </aside>

            <main className="flex-1 max-w-xl">
                <Outlet />
            </main>

            <aside className="w-80 sticky top-24 self-start">
                <SuggestedFriends followersLimit={4} />
            </aside>

        </div>
    )
}
