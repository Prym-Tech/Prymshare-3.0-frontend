import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/storefrontService.js';
import { toast } from 'react-hot-toast';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Could not fetch your products.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, setProducts, loading, refetch: fetchProducts };
};