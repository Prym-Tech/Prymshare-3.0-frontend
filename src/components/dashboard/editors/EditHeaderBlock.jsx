import { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { activePageAtom, pageSectionsAtom, editingSectionIdAtom } from '../../../state/pageAtoms.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { updatePageDetails } from '../../../services/pageService.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft, HiOutlinePhotograph, HiOutlineUserCircle, HiOutlineNewspaper, HiOutlineChatAlt } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaTiktok } from 'react-icons/fa';

const headerStyles = [
    { id: 'photo_top', name: 'Photo Top', icon: <HiOutlineUserCircle/> },
    { id: 'photo_banner', name: 'Photo & Banner', icon: <HiOutlineNewspaper/> },
    { id: 'banner_only', name: 'Banner Only', icon: <HiOutlinePhotograph/> },
    { id: 'minimal', name: 'Minimal', icon: <HiOutlineChatAlt/> },
];

const EditHeaderBlock = ({ section }) => {
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);

    const [draft, setDraft] = useState({
        brand_name: activePage.brand_name,
        title: activePage.title,
        ...section.content
    });

    const debouncedDraft = useDebounce(draft, 1000);

    useEffect(() => {
        const saveChanges = async () => {
            const pageDetailsChanged = debouncedDraft.brand_name !== activePage.brand_name || debouncedDraft.title !== activePage.title;
            const sectionContentChanged = JSON.stringify(debouncedDraft) !== JSON.stringify({ brand_name: activePage.brand_name, title: activePage.title, ...section.content });

            if (pageDetailsChanged) {
                try {
                    const pageData = { brand_name: debouncedDraft.brand_name, title: debouncedDraft.title };
                    const updatedPage = await updatePageDetails(activePage.id, pageData);
                    setActivePage(updatedPage);
                    toast.success("Page details saved!");
                } catch (error) { toast.error(error.response?.data?.brand_name?.[0] || "Failed to save page details."); }
            }
            
            if (sectionContentChanged) {
                try {
                    const { brand_name, title, ...content } = debouncedDraft;
                    const updatedSection = await updateSection(activePage.id, section.id, { content });
                    setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
                    toast.success("Header content saved!");
                } catch (error) { toast.error("Failed to save header content."); }
            }
        };
        if(debouncedDraft && activePage && section) saveChanges();
    }, [debouncedDraft, activePage, section, setActivePage, setSections]);

    const handleChange = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });
    const handleSocialChange = (e) => setDraft({ ...draft, social_links: { ...draft.social_links, [e.target.name]: e.target.value }});

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
                <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                <h2 className="text-2xl font-bold text-prym-dark-green">Edit Header</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                {/* Header Style Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Header Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {headerStyles.map(style => (
                            <button key={style.id} onClick={() => handleChange({ target: { name: 'style', value: style.id } })}
                                className={`p-3 border rounded-lg flex flex-col items-center justify-center text-center ${draft.style === style.id ? 'ring-2 ring-prym-pink border-prym-pink' : 'border-gray-300'}`}>
                                <span className="text-2xl text-gray-600">{style.icon}</span>
                                <span className="text-xs mt-1 font-medium">{style.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image URL Inputs */}
                <div>
                    <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                    <input type="text" name="profileImageUrl" id="profileImageUrl" value={draft.profileImageUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                </div>
                 <div>
                    <label htmlFor="bannerImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                    <input type="text" name="bannerImageUrl" id="bannerImageUrl" value={draft.bannerImageUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                </div>

                {/* Text Inputs */}
                <div><label htmlFor="brand_name" className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label><input type="text" name="brand_name" id="brand_name" value={draft.brand_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
                <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title (e.g., Business Coach)</label><input type="text" name="title" id="title" value={draft.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
                <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><textarea name="description" id="description" value={draft.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea></div>
                
                {/* Social Links */}
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label><div className="space-y-3">{socialFields.map(field => ( <div key={field.name} className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{field.icon}</div><input type="text" name={field.name} placeholder={`your-${field.name}-username`} value={draft.social_links[field.name] || ''} onChange={handleSocialChange} className="w-full pl-10 pr-3 py-2 border rounded-lg"/></div> ))}</div></div>
            </div>
        </div>
    );
};
export default EditHeaderBlock;

