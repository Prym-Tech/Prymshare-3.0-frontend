import { useAtomValue } from 'jotai';
import { pageSectionsAtom, pageThemeAtom, activePageAtom } from '../../state/pageAtoms.js';

const MobilePreview = () => {
    const sections = useAtomValue(pageSectionsAtom);
    const theme = useAtomValue(pageThemeAtom);
    const activePage = useAtomValue(activePageAtom);

    const renderSectionPreview = (section) => {
        switch (section.section_type) {
            case 'header':
                return (
                    <div className="p-6 text-center text-white" style={{ backgroundColor: theme.headerColor || '#121B00' }}>
                        <div className="w-20 h-20 rounded-full bg-prym-green mx-auto mb-2 border-4 border-white"></div>
                        <h1 className="font-bold">{activePage?.brand_name || '@yourbrand'}</h1>
                        <p className="text-sm">{activePage?.title || 'Your Title Here'}</p>
                        {/* --- Renders the new description field --- */}
                        <p className="text-xs mt-2 opacity-80">{section.content?.description || 'A short description about you!'}</p>
                    </div>
                );
            case 'links':
                return (
                    <div className="p-2 space-y-2">
                        {(section.content.links || []).map((link, index) => (
                            <div key={index} className="w-full p-3 bg-prym-dark-green text-white rounded-lg text-center font-semibold truncate">
                                {link.title || 'Your Link Title'}
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                     <div className="p-2">
                        <div className="w-full h-16 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-400 capitalize">
                           {section.section_type} Preview
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full max-w-[280px] h-[580px] bg-white rounded-[34px] shadow-2xl p-3 border-8 border-gray-800">
            <div className="w-full h-full bg-gray-50 rounded-[22px] overflow-y-auto">
                {sections.length > 0 ? (
                    sections.map(section => (
                        <div key={section.id}>{renderSectionPreview(section)}</div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full p-8 text-center text-gray-400">
                        <div>
                            <p className="font-semibold">Your page is empty!</p>
                            <p className="text-sm mt-1">Click the "+ Add Block" button to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobilePreview;

