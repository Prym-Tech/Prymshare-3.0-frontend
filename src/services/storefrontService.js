import apiClient from '../lib/api.js';

export const getProducts = async (pageId) => {
    if (!pageId) return []; // Don't fetch if there's no pageId
    const response = await apiClient.get(`/pages/${pageId}/products/`);
    return response.data;
};


/**
 * Creates a new product for a specific page.
 * @param {number} pageId - The ID of the page to add the product to.
 * --- CHANGE START ---
 * @param {object} productData - The product data as a JSON object.
 * --- CHANGE END ---
 * @returns {Promise<object>} The newly created product object.
 */
// --- CHANGE START ---
// The function now sends a standard JSON payload instead of FormData.
export const createProduct = async (pageId, productData) => {
    const response = await apiClient.post(`/pages/${pageId}/products/`, productData);
    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const response = await apiClient.patch(`/products/${productId}/`, productData);
    return response.data;
};

export const deleteProduct = async (productId) => {
    await apiClient.delete(`/products/${productId}/`);
};
