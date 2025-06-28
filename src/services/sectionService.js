import apiClient from '../lib/api.js';

/**
 * Creates a new section for a given page.
 * @param {number} pageId - The ID of the page.
 * @param {object} sectionData - The data for the new section (e.g., { section_type, content }).
 * @returns {Promise<object>} The newly created section object from the backend.
 */
export const createSection = async (pageId, sectionData) => {
    const response = await apiClient.post(`/pages/${pageId}/sections/`, sectionData);
    return response.data;
};

/**
 * Updates an existing section.
 * @param {number} pageId - The ID of the page.
 * @param {number} sectionId - The ID of the section to update.
 * @param {object} updatedData - The data to update (e.g., { content, is_enabled }).
 * @returns {Promise<object>} The updated section object.
 */
export const updateSection = async (pageId, sectionId, updatedData) => {
    const response = await apiClient.patch(`/pages/${pageId}/sections/${sectionId}/`, updatedData);
    return response.data;
};

/**
 * Deletes a section.
 * @param {number} pageId - The ID of the page.
 * @param {number} sectionId - The ID of the section to delete.
 */
export const deleteSection = async (pageId, sectionId) => {
    await apiClient.delete(`/pages/${pageId}/sections/${sectionId}/`);
};

/**
 * Updates the order of all sections on a page.
 * @param {number} pageId - The ID of the page.
 * @param {number[]} sectionIds - An array of section IDs in the new order.
 */
export const updateSectionOrder = async (pageId, sectionIds) => {
    await apiClient.post(`/pages/${pageId}/sections/update-order/`, { section_ids: sectionIds });
};
