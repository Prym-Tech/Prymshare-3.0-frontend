import { useForm } from 'react-hook-form';
import Modal from '../../ui/Modal.jsx';
import ImageUploader from '../../ui/ImageUploader.jsx';
import { useState } from 'react';
import { createProduct } from '../../../services/storefrontService.js';
import { uploadImage } from '../../../services/imageService.js'; // Import the image service
import { toast } from 'react-hot-toast';
import Spinner from '../../ui/Spinner.jsx';
import { useAtomValue } from 'jotai';
import { activePageAtom } from '../../../state/pageAtoms.js';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const { register, handleSubmit, reset } = useForm();
    // --- CHANGE START ---
    // This state now holds the raw file for uploading, not the URL.
    const [productImageFile, setProductImageFile] = useState(null);
    // --- CHANGE END ---
    const [loading, setLoading] = useState(false);
    const activePage = useAtomValue(activePageAtom);

    const handleImageChange = (file) => {
        // The uploader now gives us the raw file, which we'll upload separately.
        setProductImageFile(file);
    };

    const onSubmit = async (data) => {
        if (!activePage) {
            toast.error("Cannot add product without an active page.");
            return;
        }
        setLoading(true);

        let imageUrl = '';
        try {
            // --- CHANGE START ---
            // Step 1: Upload the image if one was selected.
            if (productImageFile) {
                imageUrl = await uploadImage(productImageFile);
            }

            // Step 2: Prepare the final product data with the image URL.
            const productData = {
                ...data,
                image_url: imageUrl, // Send the URL to the backend
            };

            // Step 3: Create the product with the complete data.
            const newProduct = await createProduct(activePage.id, productData);
            // --- CHANGE END ---

            toast.success("Product added successfully!");
            onProductAdded(newProduct);
            reset();
            setProductImageFile(null); // Clear the file state
            onClose();
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="flex items-start gap-4">
                    {/* --- CHANGE START --- */}
                    {/* The ImageUploader will now pass the raw file to handleImageChange */}
                    <ImageUploader onImageChange={handleImageChange} />
                    {/* --- CHANGE END --- */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input {...register('name', { required: true })} type="text" className="w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea {...register('description')} rows="3" className="w-full border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {/* --- CHANGE START --- */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                        {/* --- CHANGE END --- */}
                        <input {...register('price', { required: true, valueAsNumber: true })} type="number" step="0.01" className="w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input {...register('stock', { required: true, valueAsNumber: true })} type="number" className="w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-prym-green py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90 flex items-center gap-2">
                        {loading && <Spinner />}
                        {loading ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddProductModal;