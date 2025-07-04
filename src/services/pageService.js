import apiClient from '../lib/api.js';

/**
 * Updates the details of a page.
 * @param {number} pageId - The ID of the page to update.
 * @param {object} pageData - The data to update (e.g., { brand_name, title }).
 * @returns {Promise<object>} The updated page object from the backend.
 */

export const getPages = async () => {
    const response = await apiClient.get('/pages/');
    return response.data;
};


export const updatePageDetails = async (pageId, pageData) => {
    const response = await apiClient.patch(`/pages/${pageId}/`, pageData);
    return response.data;
};


export const getPublicPage = async (slug) => {
    const response = await apiClient.get(`/public/${slug}/`);
    return response.data;
};