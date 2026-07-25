import { createContext, useEffect, useState } from "react";
import { isLoggedInData } from "../Services/login";

export const AuthContext = createContext()


export default function AuthContextProvider({ children }) {

    const [isLogged, setIsLogged] = useState(() => {
        const token = localStorage.getItem('token');
        return token !== null && token !== undefined && token !== '';
    });



    const [userData, setUserData] = useState(null)
    async function getUserData() {
        const response = await isLoggedInData();
        if (response.message === 'success') {
            setUserData(response.data.user)
        } else {
            // If token is invalid, clear it and log out
            localStorage.removeItem('token');
            setIsLogged(false);
            setUserData(null);
        }
    }
    useEffect(() => {
        if (isLogged) {
            getUserData()
        }
    }, [isLogged])


    return <AuthContext.Provider value={{ isLogged, setIsLogged, userData, setUserData }}>
        {children}
    </AuthContext.Provider>
}
