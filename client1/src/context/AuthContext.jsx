// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(true);

    // Logout helper
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    // Authenticated Fetch Wrapper with standard Bearer header and 401 interceptor
    const authenticatedFetch = useCallback(
        async (endpoint, options = {}) => {
            const currentToken = localStorage.getItem('token');

            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            if (currentToken) {
                headers['Authorization'] = `Bearer ${currentToken}`;
            }

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            // Auto-logout on 401 Unauthorized
            if (response.status === 401) {
                logout();
                throw new Error('Session expired or unauthorized. Please log in again.');
            }

            return response;
        },
        [logout]
    );

    // Fetch user profile on initial load or token change
    useEffect(() => {
        async function loadUser() {
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await authenticatedFetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Authentication error:', err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [token, authenticatedFetch]);

    // Handle Login API Request
    const login = async (email, password) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Login failed. Please check your credentials.');
        }

        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user || null);
        return data;
    };

    // Handle Register API Request
    const register = async (email, password) => {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed.');
        }

        if (data.token) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user || null);
        }

        return data;
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
                authenticatedFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};