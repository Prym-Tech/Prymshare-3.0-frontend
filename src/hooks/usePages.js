import { useState, useEffect } from 'react';
import apiClient from '../lib/api.js';
import { toast } from 'react-hot-toast';

export const usePages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/pages/');
                setPages(response.data);
            } catch (err) {
                setError(err);
                toast.error("Could not fetch your pages.");
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    return { pages, loading, error };
};

