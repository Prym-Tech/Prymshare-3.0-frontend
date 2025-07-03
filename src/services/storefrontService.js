import apiClient from '../lib/api.js';

export const getProducts = async (pageId) => {
    if (!pageId) return [];
    const response = await apiClient.get(`/pages/${pageId}/products/`);
    return response.data;
};

export const createProduct = async (pageId, productData) => {
    const response = await apiClient.post(`/pages/${pageId}/products/`, productData);
    return response.data;
};

// --- CHANGE START ---
// The update function now needs the pageId for the URL.
export const updateProduct = async (pageId, productId, productData) => {
    const response = await apiClient.patch(`/pages/${pageId}/products/${productId}/`, productData);
    return response.data;
};

// The delete function also needs the pageId for the URL.
export const deleteProduct = async (pageId, productId) => {
    await apiClient.delete(`/pages/${pageId}/products/${productId}/`);
};