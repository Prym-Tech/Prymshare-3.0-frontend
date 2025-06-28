import { useState, useEffect } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EditLinkBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    
    // Create a local draft state to avoid re-rendering the entire app on every keystroke
    const [draftContent, setDraftContent] = useState(section.content);
    const debouncedContent = useDebounce(draftContent, 1000); // 1-second delay for auto-save

    // Effect to save the debounced content to the backend
    useEffect(() => {
        const saveContent = async () => {
            // Only save if the debounced content is different from the original section content
            if (JSON.stringify(debouncedContent) !== JSON.stringify(section.content)) {
                try {
                    const updatedSection = await updateSection(activePage.id, section.id, { content: debouncedContent });
                    // Update the global state with the saved data from the backend
                    setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
                    toast.success("Changes saved!");
                } catch (error) {
                    toast.error("Failed to save changes.");
                }
            }
        };
        saveContent();
    }, [debouncedContent, activePage.id, section.id, section.content, setSections]);

    const links = draftContent.links || [];

    const updateLinkField = (linkIndex, field, value) => {
        const newLinks = [...links];
        newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
        setDraftContent({ ...draftContent, links: newLinks });
    };

    const addLink = () => {
        const newLinks = [...links, { id: Date.now(), title: '', url: '' }];
        setDraftContent({ ...draftContent, links: newLinks });
    };

    const removeLink = (linkIndex) => {
        const newLinks = [...links];
        newLinks.splice(linkIndex, 1);
        setDraftContent({ ...draftContent, links: newLinks });
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center mb-6">
                <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2">
                    <HiOutlineArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-prym-dark-green">Edit Links</h2>
            </div>

            <div className="space-y-4">
                {links.map((link, index) => (
                    <div key={link.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-gray-700">Link #{index + 1}</p>
                            <button onClick={() => removeLink(index)} className="text-gray-400 hover:text-red-500">
                                <HiOutlineTrash className="h-5 w-5"/>
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                placeholder="Title" 
                                value={link.title}
                                onChange={(e) => updateLinkField(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green"
                            />
                            <input 
                                type="url" 
                                placeholder="https://example.com" 
                                value={link.url}
                                onChange={(e) => updateLinkField(index, 'url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green"
                            />
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