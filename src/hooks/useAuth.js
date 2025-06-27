import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { authTokenAtom, userAtom } from '../state/authAtoms.js';
import apiClient from '../lib/api.js';

export const useAuth = () => {
    const [token, setToken] = useAtom(authTokenAtom);
    const [user, setUser] = useAtom(userAtom);
    const navigate = useNavigate();

    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        // After logging in, check if the user has any pages.
        try {
            const response = await apiClient.get('/pages/', {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (response.data.length === 0) {
                // If the user has no pages, send them to onboarding.
                navigate('/onboarding');
            } else {
                // Otherwise, send them to their dashboard.
                navigate('/me/appearance');
            }
        } catch (error) {
            console.error("Failed to check for pages after login", error);
            // Default to dashboard even if check fails
            navigate('/me/appearance');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        navigate('/login');
    };

    return { login, logout, user, token };
};