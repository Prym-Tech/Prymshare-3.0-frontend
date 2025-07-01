import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSetAtom } from 'jotai';
import { editingSectionIdAtom } from '../../state/pageAtoms.js';
import { HiChevronDown } from 'react-icons/hi';
import { Disclosure } from '@headlessui/react';
import BlockPreview from './BlockPreview.jsx';

const DraggableSection = ({ section, isDraggable = true }) => {
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
        <div ref={setNodeRef} style={style} {...attributes}>
            <Disclosure>
                {({ open }) => (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="flex items-center p-4 text-left">
                            {isDraggable && (
                                // This is now the dedicated drag handle
                                <span {...listeners} className="text-gray-400 font-mono text-xl leading-none select-none cursor-grab active:cursor-grabbing mr-4">::</span>
                            )}
                            {/* This button now only controls the accordion */}
                            <Disclosure.Button className="flex-grow flex items-center justify-between">
                                <p className="font-semibold text-prym-dark-green capitalize">{section.section_type}</p>
                                <HiChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                            </Disclosure.Button>
                        </div>
                        
                        <Disclosure.Panel className="px-4 pb-4 border-t border-gray-100">
                           <BlockPreview section={section} />
                           <div className="mt-2 text-right">
                               <button onClick={() => setEditingSectionId(section.id)} className="text-sm font-semibold text-prym-pink hover:underline">
                                   Edit Block
                               </button>
                           </div>
                        </Disclosure.Panel>
                    </div>
                )}
            </Disclosure>
        </div>
    );
};

export default DraggableSection;