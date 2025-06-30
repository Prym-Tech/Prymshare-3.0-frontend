import apiClient from '../lib/api.js';

/**
 * Uploads an image file to the backend.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/images/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.image; // Return the URL of the saved image
};