import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { authTokenAtom, refreshTokenAtom, userAtom, authLoadingAtom } from '../state/authAtoms.js';
import apiClient from '../lib/api.js';

export const useAuth = () => {
    const [, setAuthToken] = useAtom(authTokenAtom);
    const [, setRefreshToken] = useAtom(refreshTokenAtom);
    const [user, setUser] = useAtom(userAtom);
    const [authLoading, setAuthLoading] = useAtom(authLoadingAtom);
    const navigate = useNavigate();

    const login = async (userData, access, refresh) => {
        setAuthToken(access);
        setRefreshToken(refresh);
        setUser(userData);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        try {
            const response = await apiClient.get('/pages/');
            if (response.data.length === 0) {
                navigate('/onboarding');
            } else {
                navigate('/me/appearance');
            }
        } catch (error) {
            console.error("Failed to check for pages after login", error);
            navigate('/me/appearance');
        }
    };

    const logout = useCallback(() => {
        setAuthToken(null);
        setRefreshToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization'];
        navigate('/login');
    }, [setAuthToken, setRefreshToken, setUser, navigate]);

    const verifyAuth = useCallback(async () => {
        const token = localStorage.getItem('prymshare_access_token');
        if (!token) {
            setAuthLoading(false);
            return;
        }

        try {
            // This protected endpoint will succeed if the token is valid,
            // and fail with a 401 if it's expired.
            const response = await apiClient.get('/auth/user/');
            setUser(response.data); // Re-sync user data
        } catch (error) {
            // If the token is invalid, the API interceptor will try to refresh it.
            // If the refresh fails, it will throw an error, and we log out.
            console.error("Auth verification failed, logging out.", error);
            logout();
        } finally {
            setAuthLoading(false);
        }
    }, [setAuthLoading, setUser, logout]);

    return { login, logout, user, authLoading, verifyAuth };
};
