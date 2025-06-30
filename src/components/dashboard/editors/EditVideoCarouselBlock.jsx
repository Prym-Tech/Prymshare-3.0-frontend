import { useState } from 'react';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { pageSectionsAtom, editingSectionIdAtom, activePageAtom } from '../../../state/pageAtoms.js';
import { updateSection } from '../../../services/sectionService.js';
import { HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const EditVideoCarouselBlock = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [draftContent, setDraftContent] = useState(section.content);

    const videos = draftContent.videos || [];

    const updateVideoField = (index, field, value) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: value };
        setDraftContent({ ...draftContent, videos: newVideos });
    };

    const addVideo = () => {
        const newVideos = [...videos, { id: Date.now(), title: '', description: '', videoUrl: '' }];
        setDraftContent({ ...draftContent, videos: newVideos });
    };

    const removeVideo = (index) => {
        const newVideos = [...videos];
        newVideos.splice(index, 1);
        setDraftContent({ ...draftContent, videos: newVideos });
    };

    const handleSave = async () => {
        try {
            await updateSection(activePage.id, section.id, { content: draftContent });
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: draftContent } : s));
            toast.success("Video Carousel saved!");
            setEditingSectionId(null);
        } catch (error) { toast.error("Failed to save changes."); }
    };

    return (
        <div className="animate-faderrout">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setEditingSectionId(null)} className="p-2 rounded-full hover:bg-gray-200 mr-2"><HiOutlineArrowLeft className="h-6 w-6" /></button>
                    <h2 className="text-2xl font-bold text-prym-dark-green">Edit Video Carousel</h2>
                </div>
                <button onClick={handleSave} className="bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-sm">Save & Close</button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Carousel Title (e.g. "My YouTube Videos")</label>
                 <input 
                    type="text" 
                    placeholder="Title" 
                    value={draftContent.title || ''} 
                    onChange={(e) => setDraftContent({...draftContent, title: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg"
                 />
            </div>

            <div className="space-y-4">
                {videos.map((video, index) => (
                    <div key={video.id || index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-semibold text-gray-700">Video #{index + 1}</p>
                            <button onClick={() => removeVideo(index)} className="text-gray-400 hover:text-red-500"><HiOutlineTrash className="h-5 w-5"/></button>
                        </div>
                        <div className="space-y-3">
                            <input type="text" placeholder="Video Title" value={video.title} onChange={(e) => updateVideoField(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
                            <input type="url" placeholder="YouTube URL" value={video.videoUrl} onChange={(e) => updateVideoField(index, 'videoUrl', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
                            <textarea placeholder="Description (optional)" value={video.description} onChange={(e) => updateVideoField(index, 'description', e.target.value)} rows="2" className="w-full px-3 py-2 border rounded-lg"></textarea>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={addVideo} className="w-full mt-4 py-3 border-2 border-dashed rounded-lg text-prym-dark-green font-semibold hover:bg-prym-green/10 hover:border-prym-green">
                + Add Video
            </button>
        </div>
    );
};

export default EditVideoCarouselBlock;
