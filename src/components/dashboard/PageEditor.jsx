import { useState, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { pageSectionsAtom, activePageAtom, editingSectionIdAtom } from '../../state/pageAtoms.js';
import { usePages } from '../../hooks/usePages.js';
import DraggableSection from './DraggableSection.jsx';
import AddBlockModal from './AddBlockModal.jsx';
import Spinner from '../ui/Spinner.jsx';
// --- CHANGE START ---
import { updateSectionOrder, deleteSection } from '../../services/sectionService.js';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal.jsx';
// --- CHANGE END ---
import { updatePageDetails } from '../../services/pageService.js';
import { toast } from 'react-hot-toast';
import EditHeaderBlock from './editors/EditHeaderBlock.jsx';
import EditLinkBlock from './editors/EditLinkBlock.jsx';
import EditVideoCarouselBlock from './editors/EditVideoCarouselBlock.jsx';
import EditImageCarouselBlock from './editors/EditImageCarouselBlock.jsx';
import EditDigitalProductBlock from './editors/EditDigitalProductBlock.jsx';
import EditAppointmentsBlock from './editors/EditAppointmentsBlock.jsx';
import EditPaywallBlock from './editors/EditPaywallBlock.jsx';
import EditEventsBlock from './editors/EditEventsBlock.jsx';
import EditLeadCaptureBlock from './editors/EditLeadCaptureBlock.jsx';

import { useAuth } from '../../hooks/useAuth.js';
import PremiumIcon from '../../assets/images/premium.png'; // Assuming this path is correct
import { HiOutlineEye, HiOutlineShare } from 'react-icons/hi';

import DashboardTabs from './DashboardTabs.jsx';

const PageEditor = () => {
    const { pages, loading: pagesLoading } = usePages();
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const [editingSectionId, setEditingSectionId] = useAtom(editingSectionIdAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // --- CHANGE START ---
    const [deletingSectionId, setDeletingSectionId] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    // --- CHANGE END ---
    const editingSection = editingSectionId ? sections.find(s => s.id === editingSectionId) : null;

    const { user } = useAuth();
    const isProUser = user?.user_type === 'pro';

    useEffect(() => {
        if (!pagesLoading && pages.length > 0 && !activePage) {
            setActivePage(pages[0]);
            setSections(pages[0].sections);
        }
    }, [pages, pagesLoading, activePage, setActivePage, setSections]);

    const handleDisplayModeChange = async (mode) => {
        const originalPage = activePage;
        setActivePage(current => ({ ...current, display_mode: mode }));
        try {
            await updatePageDetails(activePage.id, { display_mode: mode });
            toast.success(`Display mode updated.`);
        } catch (error) {
            toast.error("Failed to update setting.");
            setActivePage(originalPage);
        }
    }

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const draggableSections = sections.filter(s => s.section_type !== 'header');
            const oldIndex = draggableSections.findIndex((s) => s.id === active.id);
            const newIndex = draggableSections.findIndex((s) => s.id === over.id);
            const reordered = arrayMove(draggableSections, oldIndex, newIndex);
            const headerSection = sections.find(s => s.section_type === 'header');
            const newFullSectionList = [headerSection, ...reordered].filter(Boolean);
            setSections(newFullSectionList);
            const sectionIds = newFullSectionList.map(s => s.id);
            try {
                if(activePage) {
                    await updateSectionOrder(activePage.id, sectionIds);
                    toast.success('Order saved!');
                }
            } catch (error) {
                toast.error('Failed to save order.');
                setSections(sections);
            }
        }
    };

    // --- CHANGE START ---
    const handleConfirmDelete = async () => {
        if (!deletingSectionId) return;

        setIsDeleteLoading(true);
        try {
            await deleteSection(activePage.id, deletingSectionId);
            setSections(prev => prev.filter(s => s.id !== deletingSectionId));
            toast.success("Block deleted!");
        } catch (error) {
            toast.error("Failed to delete block.");
        } finally {
            setIsDeleteLoading(false);
            setDeletingSectionId(null);
        }
    };
    // --- CHANGE END ---

    if (!activePage) {
        return <div className="flex justify-center items-center h-full"><Spinner /> <span className="ml-2">Loading...</span></div>;
    }

    if (editingSection) {
        switch (editingSection.section_type) {
            case 'header': return <EditHeaderBlock section={editingSection} />;
            case 'links': return <EditLinkBlock section={editingSection} />;
            case 'video_carousel': return <EditVideoCarouselBlock section={editingSection} />;
            case 'carousel': return <EditImageCarouselBlock section={editingSection} />;
            case 'digital_product': return <EditDigitalProductBlock section={editingSection} />;
            case 'appointments': return <EditAppointmentsBlock section={editingSection} />;
            case 'paywall': return <EditPaywallBlock section={editingSection} />;
            case 'events':
            case 'masterclass': // --- ADD THIS CASE ---
                return <EditEventsBlock section={editingSection} />;
            case 'lead_capture': return <EditLeadCaptureBlock section={editingSection} />;
            default: return <div>Editing for "{editingSection.section_type}" not implemented. <button onClick={() => setEditingSectionId(null)} className="text-prym-pink font-semibold">Go Back</button></div>;
        }
    }
    
    const headerSection = sections.find(s => s.section_type === 'header');
    const draggableSections = sections.filter(s => s.section_type !== 'header');

    const displayOptions = [
        { id: 'page_only', label: 'Page Only' },
        { id: 'store_only', label: 'Store Only' },
        { id: 'both', label: 'Both' },
    ];

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
            <DashboardTabs />
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-prym-dark-green">{activePage?.brand_name}</h1>
                    <a href={activePage ? `//${activePage.slug}.prymshare.co` : '#'} target="_blank" rel="noopener noreferrer" className="text-prym-pink hover:underline">prymshare.co/{activePage?.slug}</a>
                </div>
                <button className="bg-prym-green text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-colors w-full sm:w-auto">
                    Share
                </button>
            </div> */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-700">Your live page:</span>
                    <a href={activePage ? `//${activePage.slug}.prymshare.co` : '#'} target="_blank" rel="noopener noreferrer" className="text-prym-pink hover:underline font-medium truncate">
                        prymshare.co/{activePage?.slug}
                    </a>
                </div>
                <div className="flex items-center gap-2">
                     <button className="bg-gray-100 text-gray-700 font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
                        <HiOutlineEye/> <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button className="bg-prym-dark-green text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm">
                        <HiOutlineShare/> <span className="hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>
            {/* --- END CHANGE --- */}

            {/* --- CHANGE START: Go Prime Banner --- */}
            {!isProUser && (
                 <div className="bg-prym-dark-green text-white p-6 rounded-2xl flex items-center justify-between gap-6 mb-6">
                    <div>
                        <h2 className="font-bold text-xl sm:text-2xl">Go Prime With Pro</h2>
                        <p className="text-white/80 mt-1 text-sm">Explore customizations, events management, coaching sessions, and much more.</p>
                        <a href="#" className="mt-4 inline-block bg-white text-prym-dark-green font-bold py-2 px-4 rounded-lg text-sm">
                            Go pro now!
                        </a>
                    </div>
                    <img src={PremiumIcon} alt="Go Pro" className="h-24 hidden sm:block" />
                 </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <p className="font-semibold text-prym-dark-green mb-3">Page Display Options</p>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {displayOptions.map(option => (
                        <button 
                            key={option.id}
                            onClick={() => handleDisplayModeChange(option.id)}
                            className={`w-1/3 rounded-md py-2 text-sm font-semibold transition-all ${activePage.display_mode === option.id ? 'bg-white shadow text-prym-pink' : 'text-gray-600 hover:bg-white/50'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="space-y-4">
                {headerSection && <DraggableSection section={headerSection} isDraggable={false} />}
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={draggableSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {draggableSections.map(section => (
                           <DraggableSection 
                                key={section.id} 
                                section={section} 
                                // --- CHANGE START ---
                                onDeleteClick={setDeletingSectionId} 
                                // --- CHANGE END ---
                           />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="mt-6">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-prym-pink/10 border-2 border-dashed border-prym-pink/30 rounded-lg py-4 text-center text-prym-pink hover:bg-prym-pink/20 hover:border-prym-pink transition-all focus:outline-none"
                >
                    <span className="font-semibold text-base sm:text-lg">+ Add Block</span>
                </button>
            </div>

            <AddBlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            {/* --- CHANGE START --- */}
            <ConfirmDeleteModal
                isOpen={deletingSectionId !== null}
                onClose={() => setDeletingSectionId(null)}
                onConfirm={handleConfirmDelete}
                loading={isDeleteLoading}
                title="Delete Block"
                message="Are you sure you want to delete this block? This action cannot be undone."
            />
            {/* --- CHANGE END --- */}
        </div>
    );
};
export default PageEditor;
