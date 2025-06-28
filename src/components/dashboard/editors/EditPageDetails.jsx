import { useState, useEffect } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { activePageAtom, editingSectionIdAtom } from '../../../state/pageAtoms.js';
import { useDebounce } from '../../../hooks/useDebounce.js';
import { updatePageDetails } from '../../../services/pageService.js';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EditPageDetails = () => {
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);

    // Local draft state for the form inputs
    const [draftPage, setDraftPage] = useState(activePage);
    const debouncedDraft = useDebounce(draftPage, 1000); // Auto-save after 1s

    useEffect(() => {
        // This effect triggers the auto-save
        const saveDetails = async () => {
            // Only save if the debounced draft is different from the original state
            if (JSON.stringify(debouncedDraft) !== JSON.stringify(activePage)) {
                try {
                    const { brand_name, title } = debouncedDraft;
                    const updatedPage = await updatePageDetails(activePage.id, { brand_name, title });
                    setActivePage(updatedPage); // Update global state with response
                    toast.success("Page details saved!");
                } catch (error) {
                    toast.error(error.response?.data?.brand_name?.[0] || "Failed to save details.");
                    // Revert draft to last known good state on error
                    setDraftPage(activePage);
                }
            }
        };

        // Don't save on the initial render
        if (debouncedDraft.id === activePage.id) {
            saveDetails();
        }
    }, [debouncedDraft, activePage, setActivePage]);

    const handleChange = (e) => {
        setDraftPage({ ...draftPage, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center mb-6">
                <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2">
                    <HiOutlineArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-prym-dark-green">Appearance</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div>
                    <label htmlFor="brand_name" className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                    <input
                        type="text"
                        name="brand_name"
                        id="brand_name"
                        value={draftPage.brand_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green"
                    />
                     <p className="text-xs text-gray-500 mt-1">prymshare.co/{draftPage.slug}</p>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title / Bio</label>
                     <input
                        type="text"
                        name="title"
                        id="title"
                        value={draftPage.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green"
                    />
                </div>
            </div>
        </div>
    );
};

export default EditPageDetails;
