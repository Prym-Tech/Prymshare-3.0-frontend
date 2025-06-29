import { useState, useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EditVideoBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);

    const [draftContent, setDraftContent] = useState(section.content);
    const debouncedContent = useDebounce(draftContent, 1000);

    useEffect(() => {
        const saveContent = async () => {
            if (JSON.stringify(debouncedContent) !== JSON.stringify(section.content)) {
                try {
                    const updatedSection = await updateSection(activePage.id, section.id, { content: debouncedContent });
                    setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
                    toast.success("Video block saved!");
                } catch (error) { toast.error("Failed to save video."); }
            }
        };
        if (debouncedContent) saveContent();
    }, [debouncedContent, activePage.id, section.id, section.content, setSections]);

    const handleChange = (e) => {
        setDraftContent({ ...draftContent, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center mb-6">
                <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                <h2 className="text-2xl font-bold text-prym-dark-green">Edit Video</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" id="title" value={draftContent.title || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
                    <input type="url" name="videoUrl" id="videoUrl" value={draftContent.videoUrl || ''} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <textarea name="description" id="description" value={draftContent.description || ''} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
            </div>
        </div>
    );
};

export default EditVideoBlock;
