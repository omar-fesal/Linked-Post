import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthenLayout() {
    return <main main className='bg-sky-50 min-h-screen'>
        <Outlet />
    </main>
}
