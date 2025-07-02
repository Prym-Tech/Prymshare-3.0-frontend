import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiOutlineX } from 'react-icons/hi';
import Spinner from './Spinner.jsx';

// --- CHANGE START ---
// The component now accepts an `isLoading` prop to show a spinner
// controlled by the parent component during the upload process.
const ImageUploader = ({ existingImageUrl, onImageChange, isLoading }) => {
// --- CHANGE END ---
    const [preview, setPreview] = useState(existingImageUrl);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onImageChange(file);
        }
    }, [onImageChange]);

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
            
            {/* --- CHANGE START --- */}
            {/* The spinner is now controlled by the isLoading prop from the parent. */}
            {isLoading ? <Spinner /> : preview ? (
            // --- CHANGE END ---
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