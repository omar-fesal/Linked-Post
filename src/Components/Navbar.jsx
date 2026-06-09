import React, { useContext, useState } from 'react'
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
export default function Navbar() {
    const { isLogged, setIsLogged, setUserData } = useContext(AuthContext)

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('token')
        setIsLogged(false)
        setUserData(null)
        // navigate('/login')
    }
    return <>

        <HeroNavbar className='bg-blue-200'>
            <NavbarBrand>

                <Link to={'/'} className="font-bold text-inherit">ACME</Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {isLogged ? <>
                    <NavbarItem>
                        <Link color="foreground" to={'/profile'}>
                            Profile
                        </Link>
                    </NavbarItem>
                    <span onClick={() => logout()} color='foreground' className='cursor-pointer'> Logout</span>
                </> :
                    <>
                        <NavbarItem>
                            <Link color="foreground" to={'/register'}>
                                Register
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" to={'/login'}>
                                Login
                            </Link>
                        </NavbarItem>

                    </>
                }






            </NavbarContent>

        </HeroNavbar>
    </>
}
