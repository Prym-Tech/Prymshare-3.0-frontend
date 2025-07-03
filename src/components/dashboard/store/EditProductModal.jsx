import { useForm } from 'react-hook-form';
import Modal from '../../ui/Modal.jsx';
import ImageUploader from '../../ui/ImageUploader.jsx';
import { useState, useEffect } from 'react';
import { updateProduct } from '../../../services/storefrontService.js';
import { uploadImage } from '../../../services/imageService.js';
import { toast } from 'react-hot-toast';
import Spinner from '../../ui/Spinner.jsx';
import { useAtomValue } from 'jotai';
import { activePageAtom } from '../../../state/pageAtoms.js';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
    // Pre-fill the form with the product data when the modal opens
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: product
    });

    useEffect(() => {
        if (product) {
            // This ensures the form is populated when the product prop changes
            setValue('name', product.name);
            setValue('description', product.description);
            setValue('price', product.price);
            setValue('stock', product.stock);
        }
    }, [product, setValue]);

    const [productImageFile, setProductImageFile] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const activePage = useAtomValue(activePageAtom);

    const handleImageChange = (file) => {
        setProductImageFile(file);
    };

    const onSubmit = async (data) => {
        if (!activePage || !product) {
            toast.error("An error occurred. Please try again.");
            return;
        }
        setFormLoading(true);

        let imageUrl = product.image; // Start with the existing image URL

        try {
            // If a new image file was selected, upload it first
            if (productImageFile) {
                setImageLoading(true);
                imageUrl = await uploadImage(productImageFile);
                setImageLoading(false);
            }

            const productData = {
                ...data,
                image_url: imageUrl, // Send the potentially new URL
            };

            const updatedProduct = await updateProduct(activePage.id, product.id, productData);
            toast.success("Product updated successfully!");
            onProductUpdated(updatedProduct); // Update the list in the parent
            reset();
            onClose();
        } catch (error) {
            toast.error("Failed to update product.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Product">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="flex items-start gap-4">
                    <ImageUploader 
                        existingImageUrl={product?.image}
                        onImageChange={handleImageChange}
                        isLoading={imageLoading}
                    />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                        <input {...register('price', { required: true, valueAsNumber: true })} type="number" step="0.01" className="w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input {...register('stock', { required: true, valueAsNumber: true })} type="number" className="w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={formLoading} className="bg-prym-green py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90 flex items-center gap-2">
                        {formLoading ? <Spinner /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditProductModal;