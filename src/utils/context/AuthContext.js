import { createContext, useContext, useEffect, useState } from "react";
import { GetUserData, RemoveAuthUser, SetAuthToken } from "../storage/index";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [Token, setToken] = useState(null)
    const [user, setUser] = useState(null)

    const login = (data) => {
        setToken(data.Token);
        setUser(data.user);
        SetAuthToken(data.Token, data.user)
    };

    const logout = () => {
        setToken(null)
        setUser(null)
        RemoveAuthUser()
    }

    useEffect(() => {
        GetUserData().then((storedToken) => {
            setToken(storedToken?.token ? JSON.parse(storedToken?.token) : null)
            setUser(storedToken?.user || null)
        })
    }, []);

    return (
        <AuthContext.Provider value={{ Token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvideo");
    }

    return context;
}

