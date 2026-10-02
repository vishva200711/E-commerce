import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on first load if a token exists
    useEffect(() => {
        const token = localStorage.getItem('lw_token');
        if (!token) {
            setLoading(false);
            return;
        }
        api.me()
            .then((data) => setUser(data.user))
            .catch(() => {
                localStorage.removeItem('lw_token');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const data = await api.login(email, password);
        localStorage.setItem('lw_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const signup = async (name, email, password) => {
        const data = await api.signup(name, email, password);
        localStorage.setItem('lw_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('lw_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
