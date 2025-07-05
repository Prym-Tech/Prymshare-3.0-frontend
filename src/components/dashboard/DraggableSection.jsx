import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSetAtom } from 'jotai';
import { editingSectionIdAtom } from '../../state/pageAtoms.js';
import { HiChevronDown, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { Disclosure } from '@headlessui/react';
import BlockPreview from './BlockPreview.jsx';

const DraggableSection = ({ section, isDraggable = true, onDeleteClick }) => {
    const setEditingSectionId = useSetAtom(editingSectionIdAtom);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: section.id, disabled: !isDraggable });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50">
            <Disclosure>
                {({ open }) => (
                    <>
                        <div className="flex items-center p-3 sm:p-4 text-left">
                            {isDraggable && (
                                <span {...listeners} className="text-gray-400 font-mono text-xl leading-none select-none cursor-grab active:cursor-grabbing mr-2 sm:mr-4">::</span>
                            )}
                            <div className="flex-grow">
                                <p className="font-semibold text-prym-dark-green capitalize text-sm sm:text-base">{section.section_type.replace('_', ' ')}</p>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button 
                                    onClick={() => setEditingSectionId(section.id)} 
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-prym-pink"
                                    title="Edit Block"
                                >
                                   <HiOutlinePencil className="h-5 w-5"/>
                               </button>
                               <button 
                                    onClick={() => onDeleteClick(section.id)} 
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500"
                                    hidden={section.section_type === 'header'}
                                    title="Delete Block"
                                >
                                   <HiOutlineTrash className="h-5 w-5"/>
                               </button>
                                <Disclosure.Button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                                    <HiChevronDown className={`h-5 w-5 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                                </Disclosure.Button>
                            </div>
                        </div>
                        
                        <Disclosure.Panel className="px-4 pb-4 border-t border-gray-100">
                           <BlockPreview section={section} />
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    );
};

export default DraggableSection;