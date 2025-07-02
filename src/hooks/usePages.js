import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/storefrontService.js'; // Assuming this is a typo and should be page service
import { getPages } from '../services/pageService.js'; // Corrected service
import { toast } from 'react-hot-toast';

export const usePages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getPages(); // Assuming getPages exists in pageService
            setPages(data);
        } catch (error) {
            toast.error("Could not fetch your pages.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    return { pages, setPages, loading, refetchPages: fetchPages };
};
