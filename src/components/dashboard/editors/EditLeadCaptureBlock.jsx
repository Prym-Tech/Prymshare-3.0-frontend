import { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EditLeadCaptureBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [draftContent, setDraftContent] = useState(section.content);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDraftContent(current => ({ ...current, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedSection = await updateSection(activePage.id, section.id, { content: draftContent });
            setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
            toast.success("Lead Capture block saved!");
            setEditingSectionId(null);
        } catch (error) {
            toast.error("Failed to save.");
        }
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                    <h2 className="text-2xl font-bold text-prym-dark-green">Edit Lead Capture</h2>
                </div>
                <button onClick={handleSave} className="bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-sm">Save & Close</button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" value={draftContent.title || 'Join my mailing list'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input type="text" name="button_text" value={draftContent.button_text || 'Subscribe'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                </div>
            </div>
        </div>
    );
};
export default EditLeadCaptureBlock;