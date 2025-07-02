import { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import ImageUploader from '../../ui/ImageUploader.jsx';
// --- CHANGE START ---
import { uploadImage } from '../../../services/imageService.js';
// --- CHANGE END ---

const EditImageCarouselBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [draftContent, setDraftContent] = useState(section.content);
    // --- CHANGE START ---
    const [imageLoading, setImageLoading] = useState({});
    // --- CHANGE END ---

    const slides = draftContent.slides || [];

    const updateSlideField = (index, field, value) => {
        setDraftContent(currentDraft => {
            const newSlides = [...(currentDraft.slides || [])];
            newSlides[index] = { ...(newSlides[index] || {}), [field]: value };
            return { ...currentDraft, slides: newSlides };
        });
    };
    
    // --- CHANGE START ---
    const handleImageChange = async (index, file) => {
        if (!file) {
            updateSlideField(index, 'imageUrl', null);
            return;
        }
        setImageLoading(loading => ({ ...loading, [index]: true }));
        try {
            const permanentUrl = await uploadImage(file);
            updateSlideField(index, 'imageUrl', permanentUrl);
            toast.success("Image updated!");
        } catch (error) {
            toast.error("Image upload failed.");
        } finally {
            setImageLoading(loading => ({ ...loading, [index]: false }));
        }
    };
    // --- CHANGE END ---

    const addSlide = () => {
        setDraftContent(currentDraft => {
            const newSlides = [...(currentDraft.slides || []), { id: Date.now(), title: '', description: '', imageUrl: null }];
            return { ...currentDraft, slides: newSlides };
        });
    };

    const removeSlide = (index) => {
        setDraftContent(currentDraft => {
            const newSlides = [...(currentDraft.slides || [])];
            newSlides.splice(index, 1);
            return { ...currentDraft, slides: newSlides };
        });
    };

    const handleSave = async () => {
        try {
            await updateSection(activePage.id, section.id, { content: draftContent });
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: draftContent } : s));
            toast.success("Carousel saved!");
            setEditingSectionId(null);
        } catch (error) { toast.error("Failed to save carousel."); }
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                    <h2 className="text-2xl font-bold text-prym-dark-green">Edit Image Carousel</h2>
                </div>
                <button onClick={handleSave} className="bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-sm">Save & Close</button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Carousel Title (e.g. "My Gallery")</label>
                 <input type="text" placeholder="Title" value={draftContent.title || ''} onChange={(e) => setDraftContent({...draftContent, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg"/>
            </div>

            <div className="space-y-4">
                {slides.map((slide, index) => (
                    <div key={slide.id || index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4"><p className="font-semibold text-gray-700">Slide #{index + 1}</p><button onClick={() => removeSlide(index)} className="text-gray-400 hover:text-red-500"><HiOutlineTrash className="h-5 w-5"/></button></div>
                        <div className="flex items-start gap-4">
                            {/* --- CHANGE START --- */}
                            <ImageUploader 
                                existingImageUrl={slide.imageUrl} 
                                onImageChange={(file) => handleImageChange(index, file)} 
                                isLoading={imageLoading[index]}
                            />
                            {/* --- CHANGE END --- */}
                            <div className="flex-1 space-y-3">
                                <input type="text" placeholder="Image Title" value={slide.title || ''} onChange={(e) => updateSlideField(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
                                <textarea placeholder="Description (optional)" value={slide.description || ''} onChange={(e) => updateSlideField(index, 'description', e.target.value)} rows="2" className="w-full px-3 py-2 border rounded-lg"></textarea>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={addSlide} className="w-full mt-4 py-3 border-2 border-dashed rounded-lg text-prym-dark-green font-semibold hover:bg-prym-green/10 hover:border-prym-green">+ Add New Slide</button>
        </div>
    );
};
export default EditImageCarouselBlock;
