import React, { useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PhotoDropDownMenu } from './PhotoDropDownMenu';
import { useQuery } from '@tanstack/react-query';
import { getUnreadCountApi } from '../Services/NotificationService';

export default function Navbar() {
    const { isLogged, setIsLogged, userData, setUserData } = useContext(AuthContext)

    const navigate = useNavigate();

    const { data: countData } = useQuery({
        queryKey: ['notif-unread-count'],
        queryFn: getUnreadCountApi,
        enabled: isLogged,
        refetchInterval: 30_000,
    });
    const unreadCount = countData?.data?.unreadCount ?? 0;

    function logout() {
        localStorage.removeItem('token')
        setIsLogged(false)
        setUserData(null)
    }
    return (
        <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-blue-200 shadow-sm  ">
            <div>
                <Link to={'/'} className="flex items-center gap-2 font-bold text-inherit text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2z"/>
                    </svg>
                    Postify
                </Link>
            </div>

            <div className="flex gap-6 items-center">
                {isLogged ? (
                    <>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center gap-1 ${isActive
                                    ? "text-blue-600 font-bold"
                                    : "text-gray-700 hover:text-black transition-colors"
                                }`
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                                <polyline points="9 21 9 12 15 12 15 21" />
                            </svg>
                            Home
                        </NavLink>

                        {/* Notification link with unread badge */}
                        <NavLink
                            to="/notification"
                            className={({ isActive }) =>
                                `relative flex items-center gap-1 ${isActive
                                    ? "text-blue-600 font-bold"
                                    : "text-gray-700 hover:text-black transition-colors"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                    <span>Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `flex items-center gap-1 ${isActive
                                    ? "text-blue-600 font-bold"
                                    : "text-gray-700 hover:text-black transition-colors"
                                }`
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Profile
                        </NavLink>

                    </>
                ) : (
                    <>
                        <Link className="text-gray-700 hover:text-black transition-colors" to={'/register'}>
                            Register
                        </Link>
                        <Link className="text-gray-700 hover:text-black transition-colors" to={'/login'}>
                            Login
                        </Link>
                    </>
                )}
            </div>
            <div className='flex justify-between items-center '>
                <PhotoDropDownMenu logout={logout} />


            </div>
        </nav>
    )
}
