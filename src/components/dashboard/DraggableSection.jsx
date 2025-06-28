import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { editingSectionIdAtom, pageSectionsAtom, activePageAtom } from '../../state/pageAtoms.js';
import { deleteSection } from '../../services/sectionService.js';
import { toast } from 'react-hot-toast';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineDotsVertical } from 'react-icons/hi';

const DraggableSection = ({ section }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);
    const [sections, setSections] = useAtom(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this block?")) return;

        try {
            await deleteSection(activePage.id, section.id);
            setSections(sections.filter(s => s.id !== section.id)); // Update UI on success
            toast.success("Block deleted.");
        } catch (error) {
            toast.error("Failed to delete block.");
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button {...attributes} {...listeners} className="cursor-grab text-gray-400 focus:outline-none">
                    <HiOutlineDotsVertical className="h-5 w-5" />
                </button>
                <p className="font-medium text-prym-dark-green capitalize">{section.section_type}</p>
            </div>
            <div className="flex items-center space-x-3">
                <button onClick={() => setEditingSectionId(section.id)} className="text-gray-500 hover:text-prym-dark-green">
                    <HiOutlinePencilAlt className="h-5 w-5" />
                </button>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
                    <HiOutlineTrash className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default DraggableSection;