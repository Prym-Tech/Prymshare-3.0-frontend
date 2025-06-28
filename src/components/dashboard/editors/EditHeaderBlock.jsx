import { useState, useEffect } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { activePageAtom, pageSectionsAtom, editingSectionIdAtom } from '../../../state/pageAtoms.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { updatePageDetails } from '../../../services/pageService.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaTiktok } from 'react-icons/fa';

const EditHeaderBlock = ({ section }) => {
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);

    // Create a unified draft state for all fields
    const [draft, setDraft] = useState({
        brand_name: activePage.brand_name,
        title: activePage.title,
        description: section.content.description || '',
        social_links: section.content.social_links || {},
    });

    const debouncedDraft = useDebounce(draft, 1000); // Auto-save after 1s

    useEffect(() => {
        const saveChanges = async () => {
            // Check if page details have changed
            if (debouncedDraft.brand_name !== activePage.brand_name || debouncedDraft.title !== activePage.title) {
                try {
                    const pageData = { brand_name: debouncedDraft.brand_name, title: debouncedDraft.title };
                    const updatedPage = await updatePageDetails(activePage.id, pageData);
                    setActivePage(updatedPage); // Update global state
                    toast.success("Page details saved!");
                } catch (error) {
                    toast.error(error.response?.data?.brand_name?.[0] || "Failed to save page details.");
                }
            }
            
            // Check if section content has changed
            const sectionContentChanged = debouncedDraft.description !== section.content.description ||
                                        JSON.stringify(debouncedDraft.social_links) !== JSON.stringify(section.content.social_links);

            if (sectionContentChanged) {
                try {
                    const sectionData = { content: { description: debouncedDraft.description, social_links: debouncedDraft.social_links }};
                    const updatedSection = await updateSection(activePage.id, section.id, sectionData);
                    setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
                    toast.success("Header content saved!");
                } catch (error) {
                     toast.error("Failed to save header content.");
                }
            }
        };

        saveChanges();
    }, [debouncedDraft, activePage, section, setActivePage, setSections]);

    const handleChange = (e) => {
        setDraft({ ...draft, [e.target.name]: e.target.value });
    };
    
    const handleSocialChange = (e) => {
        setDraft({ 
            ...draft, 
            social_links: {
                ...draft.social_links,
                [e.target.name]: e.target.value
            }
        });
    };

    const socialFields = [
        { name: 'twitter', icon: <FaTwitter className="text-gray-400" /> },
        { name: 'instagram', icon: <FaInstagram className="text-gray-400" /> },
        { name: 'facebook', icon: <FaFacebook className="text-gray-400" /> },
        { name: 'linkedin', icon: <FaLinkedin className="text-gray-400" /> },
        { name: 'tiktok', icon: <FaTiktok className="text-gray-400" /> },
    ];

    return (
        <div className="animate-faderrout">
            <div className="flex items-center mb-6">
                <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2">
                    <HiOutlineArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-prym-dark-green">Edit Header & Profile</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <div>
                    <label htmlFor="brand_name" className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                    <input type="text" name="brand_name" id="brand_name" value={draft.brand_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green" />
                    <p className="text-xs text-gray-500 mt-1">prymshare.co/{activePage.slug}</p>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title / Bio</label>
                    <input type="text" name="title" id="title" value={draft.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green" />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <textarea name="description" id="description" value={draft.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                    <div className="space-y-3">
                        {socialFields.map(field => (
                            <div key={field.name} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{field.icon}</div>
                                <input
                                    type="text"
                                    name={field.name}
                                    placeholder={`your-${field.name}-username`}
                                    value={draft.social_links[field.name] || ''}
                                    onChange={handleSocialChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditHeaderBlock;
