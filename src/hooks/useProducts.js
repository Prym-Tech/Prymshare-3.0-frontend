import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/storefrontService.js';
import { toast } from 'react-hot-toast';


export const useProducts = (pageId) => {
// --- CHANGE END ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        
        if (!pageId) {
            setLoading(false);
            return;
        }
        // --- CHANGE END ---
        try {
            setLoading(true);
            // --- CHANGE START ---
            const data = await getProducts(pageId);
            // --- CHANGE END ---
            setProducts(data);
        } catch (error) {
            toast.error("Could not fetch your products.");
        } finally {
            setLoading(false);
        }
    // --- CHANGE START ---
    }, [pageId]);
    // --- CHANGE END ---

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, setProducts, loading, refetch: fetchProducts };
};