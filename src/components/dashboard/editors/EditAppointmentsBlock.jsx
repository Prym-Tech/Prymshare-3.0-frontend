import { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft, HiPlus, HiTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import ImageUploader from '../../ui/ImageUploader.jsx';
import { uploadImage } from '../../../services/imageService.js';


const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EditAppointmentsBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [draftContent, setDraftContent] = useState(section.content);
    const [isImageLoading, setIsImageLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDraftContent(current => ({ ...current, [name]: value }));
    };

    const handleAvailabilityChange = (day, field, value) => {
        setDraftContent(current => {
            const availability = { ...(current.availability || {}) };
            availability[day] = { ...(availability[day] || { active: false }), [field]: value };
            return { ...current, availability };
        });
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

    const addCustomField = () => {
        const newField = { id: Date.now(), label: '' };
        setDraftContent(current => ({ ...current, custom_fields: [...(current.custom_fields || []), newField] }));
    };
    
    const updateCustomField = (index, value) => {
        setDraftContent(current => {
            const newFields = [...current.custom_fields];
            newFields[index] = { ...newFields[index], label: value };
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
            toast.success("1-on-1 Session saved!");
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
                    <h2 className="text-2xl font-bold text-prym-dark-green">Edit 1-on-1 Session</h2>
                </div>
                <button onClick={handleSave} className="bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-sm">Save & Close</button>
            </div>
            
            <div className="space-y-6">
                 <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-prym-dark-green mb-2">Session Details</h3>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
                        <ImageUploader existingImageUrl={draftContent.cover_image_url} onImageChange={handleCoverImageChange} isLoading={isImageLoading} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" name="title" value={draftContent.title || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={draftContent.description || ''} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                            <input type="number" name="price" value={draftContent.price || '0'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="0 for free"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                            <input type="number" name="duration" value={draftContent.duration || '30'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-prym-dark-green mb-2">Meeting Location</h3>
                     <div className="flex items-center gap-4">
                        <input id="meeting-link" name="meeting_type" type="radio" value="link" checked={draftContent.meeting_type === 'link'} onChange={handleChange} className="h-4 w-4 border-gray-300 text-prym-pink focus:ring-prym-pink" />
                        <label htmlFor="meeting-link">I will use a meeting link</label>
                    </div>
                    {draftContent.meeting_type === 'link' && (
                        <div className="pl-6">
                            <input type="url" name="meeting_link" value={draftContent.meeting_link || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. https://zoom.us/j/..."/>
                            <p className="text-xs text-gray-500 mt-1">This link will be sent to clients after booking.</p>
                        </div>
                    )}
                     <div className="flex items-center gap-4">
                        <input id="meeting-call" name="meeting_type" type="radio" value="call" checked={draftContent.meeting_type === 'call'} onChange={handleChange} className="h-4 w-4 border-gray-300 text-prym-pink focus:ring-prym-pink" />
                        <label htmlFor="meeting-call">I will call the client</label>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-prym-dark-green mb-2">Set Your Availability</h3>
                    {daysOfWeek.map((day, index) => (
                        <div key={day} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3 sm:gap-3">
                            <div className="col-span-1 flex items-center">
                                <input 
                                    type="checkbox" 
                                    id={`day-${index}`}
                                    checked={draftContent.availability?.[day]?.active || false}
                                    onChange={(e) => handleAvailabilityChange(day, 'active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-prym-pink focus:ring-prym-pink"
                                />
                                <label htmlFor={`day-${index}`} className="ml-2 text-sm font-medium">{day}</label>
                            </div>
                            {draftContent.availability?.[day]?.active && (
                                <div className="col-span-1 sm:col-span-3 grid grid-cols-2 gap-2">
                                    <input type="time" value={draftContent.availability?.[day]?.start || '09:00'} onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)} className="w-full text-sm border-gray-300 rounded-md"/>
                                    <input type="time" value={draftContent.availability?.[day]?.end || '17:00'} onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)} className="w-full text-sm border-gray-300 rounded-md"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-prym-dark-green">Custom Registration Fields</h3>
                    <p className="text-sm text-gray-500">Name and Email are collected by default.</p>
                     {(draftContent.custom_fields || []).map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2">
                            <div className="flex-grow"><input type="text" placeholder="Field Label" value={field.label} onChange={e => updateCustomField(index, e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm"/></div>
                            <button onClick={() => removeCustomField(index)} className="p-2 text-gray-400 hover:text-red-500"><HiTrash /></button>
                        </div>
                    ))}
                    <button onClick={addCustomField} className="text-sm font-semibold text-prym-pink flex items-center gap-1"><HiPlus/> Add Field</button>
                </div>

                 <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <h3 className="font-semibold text-prym-dark-green">After Booking</h3>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL (Optional)</label>
                        <input type="url" name="redirect_url" value={draftContent.redirect_url || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" placeholder="https://..."/>
                        <p className="text-xs text-gray-500 mt-1">This could be a link to a WhatsApp group, Telegram, etc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditAppointmentsBlock;