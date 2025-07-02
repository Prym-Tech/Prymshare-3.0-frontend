import apiClient from '../lib/api.js';

export const getProducts = async () => {
    const response = await apiClient.get('/products/');
    return response.data;
};


/**
 * Creates a new product.
 * @param {FormData} formData - The product data, including the image file.
 * @returns {Promise<object>} The newly created product object.
 */
export const createProduct = async (formData) => {
    const response = await apiClient.post('/products/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const response = await apiClient.patch(`/products/${productId}/`, productData);
    return response.data;
};

export const deleteProduct = async (productId) => {
    await apiClient.delete(`/products/${productId}/`);
};
