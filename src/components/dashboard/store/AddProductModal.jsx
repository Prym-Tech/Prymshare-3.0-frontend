import { useForm } from 'react-hook-form';
import Modal from '../../ui/Modal.jsx';
import ImageUploader from '../../ui/ImageUploader.jsx';
import { useState } from 'react';
import { createProduct } from '../../../services/storefrontService.js';
import { toast } from 'react-hot-toast';
import Spinner from '../../ui/Spinner.jsx';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const { register, handleSubmit, reset } = useForm();
    const [productImageFile, setProductImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (file) => {
        // We need the raw File object for FormData
        setProductImageFile(file);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        // Append all form data
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        // Append the image file if it exists
        if (productImageFile) {
            formData.append('image', productImageFile);
        }

        try {
            const newProduct = await createProduct(formData);
            toast.success("Product added successfully!");
            onProductAdded(newProduct); // Update the product list in the parent component
            reset();
            setProductImageFile(null);
            onClose();
        } catch (error) {
            toast.error("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="flex items-start gap-4">
                    <ImageUploader onImageChange={handleImageChange} />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
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