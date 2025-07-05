import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiOutlineDocumentText, HiX } from 'react-icons/hi';
import Spinner from './Spinner';

const FileUploader = ({ onFileChange, existingFile, onRemove }) => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setIsUploading(true);
            onFileChange(selectedFile, setProgress).finally(() => {
                setIsUploading(false);
            });
        }
    }, [onFileChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });
    
    const handleRemove = (e) => {
        e.stopPropagation();
        setFile(null);
        setProgress(0);
        onRemove();
    }

    const currentFile = file || existingFile;

    return (
        <div {...getRootProps()} className={`relative p-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-prym-pink bg-prym-pink/10' : 'border-gray-300 hover:border-prym-green'}`}>
            <input {...getInputProps()} />
            
            {isUploading ? (
                <>
                    <Spinner />
                    <p className="text-sm mt-2">Uploading...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-prym-green h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </>
            ) : currentFile ? (
                 <div className="flex items-center gap-3">
                    <HiOutlineDocumentText className="h-8 w-8 text-prym-green" />
                    <span className="text-sm font-medium text-gray-700 truncate">{currentFile.name || currentFile.original_filename}</span>
                    <button onClick={handleRemove} className="text-red-500 hover:text-red-700"><HiX /></button>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <HiOutlineUpload className="mx-auto h-8 w-8" />
                    <p className="mt-1 text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs">Max. file size: 50MB</p>
                </div>
            )}
        </div>
    );
};
export default FileUploader;