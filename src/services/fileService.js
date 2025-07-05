import apiClient from '../lib/api.js';

/**
 * Uploads a digital file to the backend.
 * @param {File} file - The file to upload.
 * @param {function} onUploadProgress - Callback to track upload progress.
 * @returns {Promise<string>} The URL of the uploaded file.
 */
export const uploadDigitalFile = async (file, onUploadProgress) => {
    // Use FormData for a more robust file upload.
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
        `/files/upload/`, // The filename is now part of the FormData, not a query param.
        formData, 
        {
            headers: {
                'Content-Type': undefined, 
            },
            onUploadProgress,
        }
    );
    return response.data.file; 
};