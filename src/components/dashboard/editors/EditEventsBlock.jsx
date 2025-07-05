import { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { updateSection } from '../../../services/sectionService.js';
import { uploadImage } from '../../../services/imageService.js';
import { HiOutlineArrowLeft, HiPlus, HiTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import ImageUploader from '../../ui/ImageUploader.jsx';

const EditEventsBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [draftContent, setDraftContent] = useState(section.content);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const isEventType = section.section_type === 'events';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDraftContent(current => ({ ...current, [name]: value }));
    };

    const handleCoverImageChange = async (file) => {
        if (!file) {
            setDraftContent(current => ({ ...current, cover_image_url: null }));
            return;
        }
        setIsImageLoading(true);
        try {
            const url = await uploadImage(file);
            setDraftContent(current => ({ ...current, cover_image_url: url }));
        } catch (error) {
            toast.error("Cover image upload failed.");
        } finally {
            setIsImageLoading(false);
        }
    };

    // --- Functions for managing tickets ---
    const addTicket = () => {
        const newTicket = { id: Date.now(), name: '', price: '0' };
        setDraftContent(current => ({ ...current, tickets: [...(current.tickets || []), newTicket] }));
    };

    const updateTicket = (index, field, value) => {
        setDraftContent(current => {
            const newTickets = [...current.tickets];
            newTickets[index] = { ...newTickets[index], [field]: value };
            return { ...current, tickets: newTickets };
        });
    };

    const removeTicket = (index) => {
        setDraftContent(current => ({ ...current, tickets: current.tickets.filter((_, i) => i !== index) }));
    };

    // --- Functions for managing custom fields ---
    const addCustomField = () => {
        const newField = { id: Date.now(), label: '', required: false };
        setDraftContent(current => ({ ...current, custom_fields: [...(current.custom_fields || []), newField] }));
    };
    
    const updateCustomField = (index, field, value) => {
        setDraftContent(current => {
            const newFields = [...current.custom_fields];
            newFields[index] = { ...newFields[index], [field]: value };
            return { ...current, custom_fields: newFields };
        });
    };

    const removeCustomField = (index) => {
        setDraftContent(current => ({ ...current, custom_fields: current.custom_fields.filter((_, i) => i !== index) }));
    };


    const handleSave = async () => {
        try {
            const updatedSection = await updateSection(activePage.id, section.id, { content: draftContent });
            setSections(prev => prev.map(s => s.id === section.id ? updatedSection : s));
            toast.success("Block saved!");
            setEditingSectionId(null);
        } catch (error) {
            toast.error("Failed to save block.");
        }
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                    <h2 className="text-2xl font-bold text-prym-dark-green capitalize">Edit {section.section_type}</h2>
                </div>
                <button onClick={handleSave} className="bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-sm">Save & Close</button>
            </div>
            
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    <ImageUploader existingImageUrl={draftContent.cover_image_url} onImageChange={handleCoverImageChange} isLoading={isImageLoading} />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" name="title" value={draftContent.title || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={draftContent.description || ''} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input type="datetime-local" name="event_date" value={draftContent.event_date || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / URL</label>
                        <input type="text" name="location" value={draftContent.location || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., Zoom link or physical address"/>
                    </div>
                </div>

                {/* Conditional Ticket Section */}
                {isEventType && (
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                        <h3 className="font-semibold text-prym-dark-green">Tickets</h3>
                        {(draftContent.tickets || []).map((ticket, index) => (
                            <div key={ticket.id} className="flex items-end gap-2">
                                <div className="flex-grow"><label className="text-xs">Name</label><input type="text" value={ticket.name} onChange={e => updateTicket(index, 'name', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm"/></div>
                                <div className="flex-grow"><label className="text-xs">Price (₦)</label><input type="number" value={ticket.price} onChange={e => updateTicket(index, 'price', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm"/></div>
                                <button onClick={() => removeTicket(index)} className="p-2 text-gray-400 hover:text-red-500"><HiTrash /></button>
                            </div>
                        ))}
                        <button onClick={addTicket} className="text-sm font-semibold text-prym-pink flex items-center gap-1"><HiPlus/> Add Ticket</button>
                    </div>
                )}

                {/* Custom Fields Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-prym-dark-green">Custom Registration Fields</h3>
                     {(draftContent.custom_fields || []).map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2">
                            <div className="flex-grow"><label className="text-xs">Field Label</label><input type="text" value={field.label} onChange={e => updateCustomField(index, 'label', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm"/></div>
                            <button onClick={() => removeCustomField(index)} className="p-2 text-gray-400 hover:text-red-500"><HiTrash /></button>
                        </div>
                    ))}
                    <button onClick={addCustomField} className="text-sm font-semibold text-prym-pink flex items-center gap-1"><HiPlus/> Add Field</button>
                </div>
            </div>
        </div>
    );
};
export default EditEventsBlock;