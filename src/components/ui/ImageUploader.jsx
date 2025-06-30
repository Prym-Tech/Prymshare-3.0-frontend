import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../../services/imageService.js';
import { HiOutlineUpload, HiOutlineX } from 'react-icons/hi';
import Spinner from './Spinner.jsx';
import { toast } from 'react-hot-toast';

const ImageUploader = ({ existingImageUrl, onImageChange }) => {
    const [preview, setPreview] = useState(existingImageUrl);
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            handleUpload(file);
        }
    }, []);

    const handleUpload = async (file) => {
        setLoading(true);
        try {
            const imageUrl = await uploadImage(file);
            setPreview(imageUrl);
            onImageChange(imageUrl); // Pass the permanent URL up
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Image upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.gif'] },
        multiple: false,
    });

    useEffect(() => {
        setPreview(existingImageUrl);
    }, [existingImageUrl]);

    const removeImage = (e) => {
        e.stopPropagation();
        setPreview(null);
        onImageChange(null);
    };

    return (
        <div {...getRootProps()}
            className={`w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all
            ${isDragActive ? 'border-prym-pink bg-prym-pink/10' : 'border-gray-300 hover:border-prym-green'}`}>
            <input {...getInputProps()} />
            
            {loading ? <Spinner /> : preview ? (
                <div className="relative w-full h-full">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    <button onClick={removeImage} className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow"><HiOutlineX className="h-3 w-3 text-red-500" /></button>
                </div>
            ) : (
                <div className="text-center text-gray-400"><HiOutlineUpload className="mx-auto h-6 w-6" /></div>
            )}
        </div>
    );
};
export default ImageUploader;