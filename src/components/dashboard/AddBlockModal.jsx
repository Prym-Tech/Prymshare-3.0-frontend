import { useSetAtom, useAtomValue } from 'jotai';
import { pageSectionsAtom, activePageAtom, editingSectionIdAtom } from '../../state/pageAtoms.js';
import Modal from '../ui/Modal.jsx';
import { toast } from 'react-hot-toast';
import { createSection } from '../../services/sectionService.js';

// Custom, two-tone SVG Icons for a professional look
const ICONS = {
    links: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="#F84F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
    carousel: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#121B00" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" stroke="#F84F94" strokeWidth="2"/><polyline points="21 15 16 10 5 21" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
    video: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" stroke="#F84F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><polygon points="9.5 15.5 15.5 12 9.5 8.5 9.5 15.5" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polygon></svg> ),
    digital_product: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 10 12 15 17 10" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="#F84F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
    courses: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><line x1="12" y1="6" x2="12" y2="18" stroke="#00D37F" strokeWidth="2" strokeLinecap="round"></line></svg> ),
    appointments: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect><line x1="16" y1="2" x2="16" y2="6" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></line><line x1="8" y1="2" x2="8" y2="6" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></line><line x1="3" y1="10" x2="21" y2="10" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></line><path d="m9 16 2 2 4-4" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
    paywall: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#F84F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="12" cy="16" r="1" fill="#00D37F" stroke="#00D37F" strokeWidth="1"></circle></svg> ),
    subscriptions: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect><path d="M12 12h.01" stroke="#F84F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="m15 16-3-3-3 3" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
    events: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><polyline points="13 2 13 9 20 9" stroke="#F84F94" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline><path d="M8 17h.01" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 17h.01" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17h.01" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> ),
    lead_capture: ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#121B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><polyline points="22,6 12,13 2,6" stroke="#00D37F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline></svg> ),
};

const blockGroups = [
    {
        title: 'Content & Links',
        blocks: [
            { type: 'links', text: 'Links', icon: ICONS.links },
            { type: 'carousel', text: 'Carousel', icon: ICONS.carousel },
            { type: 'video_carousel', text: 'Video Carousel', icon: ICONS.video },
        ]
    },
    {
        title: 'Monetization',
        blocks: [
            { type: 'digital_product', text: 'Digital Product', icon: ICONS.digital_product },
            { type: 'courses', text: 'eCourse', icon: ICONS.courses },
            { type: 'appointments', text: '1-on-1 Session', icon: ICONS.appointments },
            { type: 'subscriptions', text: 'Subscription', icon: ICONS.subscriptions },
            { type: 'paywall', text: 'Gated Content', icon: ICONS.paywall },
        ]
    },
    {
        title: 'Community & Events',
        blocks: [
            { type: 'events', text: 'Event Tickets', icon: ICONS.events },
            { type: 'lead_capture', text: 'Collect Emails', icon: ICONS.lead_capture },
        ]
    }
];

const BlockTypeCard = ({ type, text, icon, onClick }) => (
    <button
        onClick={() => onClick(type)}
        className="w-full p-4 bg-gray-50 rounded-xl text-left hover:ring-2 hover:ring-prym-pink transition-all group"
    >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-prym-green/10 mb-3">
           {icon}
        </div>
        <p className="font-semibold text-sm text-prym-dark-green">{text}</p>
    </button>
);

const AddBlockModal = ({ isOpen, onClose }) => {
    const setSections = useSetAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);

    const handleAddBlock = async (blockType) => {
        if (!activePage) {
            toast.error("No active page selected.");
            return;
        }
        const newBlockData = {
            section_type: blockType,
            content: blockType === 'links' ? { links: [] } : {},
        };
        try {
            const createdSection = await createSection(activePage.id, newBlockData);
            setSections(prevSections => [...prevSections, createdSection]);
            toast.success(`"${blockType}" block added!`);
            setEditingSectionId(createdSection.id);
        } catch (error) {
            toast.error("Failed to add block.");
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Block">
            <div className="mt-4 space-y-6">
                {blockGroups.map(group => (
                    <div key={group.title}>
                        <h4 className="font-bold text-prym-dark-green mb-3">{group.title}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {group.blocks.map(block => (
                                <BlockTypeCard key={block.type} {...block} onClick={handleAddBlock} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default AddBlockModal;