import { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';
import { updateSection } from '../../../services/sectionService.js';
import { toast } from 'react-hot-toast';
import ImageUploader from '../../ui/ImageUploader.jsx';
// --- CHANGE START ---
import { uploadImage } from '../../../services/imageService.js';
// --- CHANGE END ---

const EditLinkBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [draftContent, setDraftContent] = useState(section.content);
    // --- CHANGE START ---
    const [imageLoading, setImageLoading] = useState({});
    // --- CHANGE END ---

    const updateLinkField = (linkIndex, field, value) => {
        setDraftContent(currentDraft => {
            const newLinks = [...(currentDraft.links || [])];
            newLinks[linkIndex] = { ...(newLinks[linkIndex] || {}), [field]: value };
            return { ...currentDraft, links: newLinks };
        });
    };

    // --- CHANGE START ---
    const handleImageChange = async (linkIndex, file) => {
        if (!file) {
            updateLinkField(linkIndex, 'imageUrl', null);
            return;
        }

        setImageLoading(loading => ({ ...loading, [linkIndex]: true }));
        try {
            const permanentUrl = await uploadImage(file);
            updateLinkField(linkIndex, 'imageUrl', permanentUrl);
            toast.success("Image updated!");
        } catch (error) {
            toast.error("Image upload failed.");
        } finally {
            setImageLoading(loading => ({ ...loading, [linkIndex]: false }));
        }
    };
    // --- CHANGE END ---

    const addLink = () => {
        setDraftContent(currentDraft => {
            const newLinks = [...(currentDraft.links || []), { id: Date.now(), title: '', url: '', imageUrl: null }];
            return { ...currentDraft, links: newLinks };
        });
    };

    const removeLink = (linkIndex) => {
        setDraftContent(currentDraft => {
            const newLinks = [...(currentDraft.links || [])];
            newLinks.splice(linkIndex, 1);
            return { ...currentDraft, links: newLinks };
        });
    };

    const handleSave = async () => {
        try {
            const updatedSection = await updateSection(activePage.id, section.id, { content: draftContent });
            setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
            toast.success("Links saved!");
            setEditingSectionId(null);
        } catch (error) {
            toast.error("Failed to save links.");
        }
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                    <h2 className="text-2xl font-bold text-prym-dark-green">Edit Links</h2>
                </div>
                <button onClick={handleSave} className="bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-sm">Save & Close</button>
            </div>

            <div className="space-y-4">
                {(draftContent.links || []).map((link, index) => (
                    <div key={link.id || index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold text-gray-700">Link #{index + 1}</p>
                            <button onClick={() => removeLink(index)} className="text-gray-400 hover:text-red-500"><HiOutlineTrash className="h-5 w-5"/></button>
                        </div>
                        <div className="flex items-start gap-4">
                            {/* --- CHANGE START --- */}
                            <ImageUploader 
                                existingImageUrl={link.imageUrl}
                                onImageChange={(file) => handleImageChange(index, file)}
                                isLoading={imageLoading[index]}
                            />
                            {/* --- CHANGE END --- */}
                            <div className="flex-1 space-y-3">
                                <input type="text" placeholder="Title" value={link.title || ''} onChange={(e) => updateLinkField(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
                                <input type="url" placeholder="https://example.com" value={link.url || ''} onChange={(e) => updateLinkField(index, 'url', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addLink} className="w-full mt-4 py-3 border-2 border-dashed rounded-lg text-prym-dark-green font-semibold hover:bg-prym-green/10 hover:border-prym-green">
                + Add New Link
            </button>
        </div>
    );
};
export default EditLinkBlock;