import apiClient from '../lib/api.js';

/**
 * Updates the details of a page.
 * @param {number} pageId - The ID of the page to update.
 * @param {object} pageData - The data to update (e.g., { brand_name, title }).
 * @returns {Promise<object>} The updated page object from the backend.
 */
export const updatePageDetails = async (pageId, pageData) => {
    const response = await apiClient.patch(`/pages/${pageId}/`, pageData);
    return response.data;
};
