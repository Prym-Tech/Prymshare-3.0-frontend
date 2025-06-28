import { useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { pageSectionsAtom, activePageAtom, editingSectionIdAtom } from '../../state/pageAtoms.js';
import { usePages } from '../../hooks/usePages.js';
import DraggableSection from './DraggableSection.jsx';
import AddBlockModal from './AddBlockModal.jsx';
import Spinner from '../ui/Spinner.jsx';
import EditLinkBlock from './editors/EditLinkBlock.jsx';
import EditHeaderBlock from './editors/EditHeaderBlock.jsx'; // Import the new editor
import { updateSectionOrder } from '../../services/sectionService.js';
import { toast } from 'react-hot-toast';

const PageEditor = () => {
    const { pages, loading: pagesLoading } = usePages();
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const [editingSectionId, setEditingSectionId] = useAtom(editingSectionIdAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const editingSection = editingSectionId ? sections.find(s => s.id === editingSectionId) : null;

    useEffect(() => {
        if (!pagesLoading && pages.length > 0 && !activePage) {
            setActivePage(pages[0]);
            setSections(pages[0].sections);
        }
    }, [pages, pagesLoading, activePage, setActivePage, setSections]);

    const handleDragEnd = async (event) => { /* ... (unchanged) ... */ };

    if (pagesLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner /> <span className="ml-2">Loading your page...</span></div>;
    }

    if (editingSection) {
        switch (editingSection.section_type) {
            case 'header':
                return <EditHeaderBlock section={editingSection} />;
            case 'links':
                return <EditLinkBlock section={editingSection} />;
            default:
                return <div>Editing for "{editingSection.section_type}" not implemented. <button onClick={() => setEditingSectionId(null)} className="text-prym-pink font-semibold">Go Back</button></div>;
        }
    }
    
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-prym-dark-green">{activePage?.brand_name}</h1>
                    <a href={activePage ? `//${activePage.slug}.prymshare.co` : '#'} target="_blank" rel="noopener noreferrer" className="text-prym-pink hover:underline">prymshare.co/{activePage?.slug}</a>
                </div>
                <button className="bg-prym-green text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-colors w-full sm:w-auto">
                    Share
                </button>
            </div>
            
            <div className="min-h-[300px]">
                {sections.length > 0 ? (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                                {sections.map(section => (
                                   <DraggableSection key={section.id} section={section} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 font-semibold">Your page is empty!</p>
                        <p className="text-sm text-gray-400 mt-1">Click "+ Add Block" to get started.</p>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-center text-gray-500 hover:bg-gray-50 hover:border-prym-pink hover:text-prym-pink transition-all focus:outline-none focus:ring-2 focus:ring-prym-pink"
                >
                    <span className="font-semibold text-lg">+ Add Block</span>
                </button>
            </div>

            <AddBlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default PageEditor;