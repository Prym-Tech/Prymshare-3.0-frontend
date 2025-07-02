import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { activePageAtom } from '../state/pageAtoms.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { updatePageDetails } from '../services/pageService.js';
import { toast } from 'react-hot-toast';
import { Disclosure } from '@headlessui/react';
import { HiChevronDown, HiRefresh, HiLockClosed } from 'react-icons/hi';
import { SketchPicker } from 'react-color';
import ImageUploader from '../components/ui/ImageUploader.jsx';
import { templates } from '../lib/templates.js';
import DashboardTabs from '../components/dashboard/DashboardTabs.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';


const ProFeatureWrapper = ({ children, isPro }) => {
    if (isPro) {
        return <>{children}</>;
    }
    return (
        <div className="relative">
            <div className="blur-[2px] pointer-events-none">{children}</div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/10 rounded-lg">
                <HiLockClosed className="h-8 w-8 text-prym-pink" />
                <span className="mt-2 text-sm font-semibold text-prym-dark-green">Available on Pro</span>
                <button className="mt-2 bg-prym-pink text-white text-xs font-bold py-1 px-3 rounded-full">Upgrade</button>
            </div>
        </div>
    );
};

const CustomizePage = () => {
    const { user } = useAuth();
    const isProUser = user?.user_type === 'pro';

    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [draftTheme, setDraftTheme] = useState(null);
    const [activeColorPicker, setActiveColorPicker] = useState(null);

    const debouncedTheme = useDebounce(draftTheme, 1000);
    const isInitialMount = useRef(true);

    // Effect to initialize or update the draft when the activePage changes
    useEffect(() => {
        if (activePage) {
            const newTheme = { ...templates.default.styles, ...(templates[activePage.theme_settings.template]?.styles || {}), ...activePage.theme_settings };
            setDraftTheme(newTheme);
        }
    }, [activePage]);

    // Effect to handle auto-saving
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const saveTheme = async () => {
            if (JSON.stringify(debouncedTheme) !== JSON.stringify(activePage.theme_settings)) {
                try {
                    const updatedPage = await updatePageDetails(activePage.id, { theme_settings: debouncedTheme });
                    setActivePage(updatedPage); // This is the single source of truth now
                    toast.success("Theme saved!");
                } catch (error) { 
                    toast.error("Failed to save theme."); 
                }
            }
        };

        if (debouncedTheme && activePage) {
            saveTheme();
        }
    }, [debouncedTheme, activePage, setActivePage]);

    if (!draftTheme) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    const handleColorChange = (color, name) => setDraftTheme(current => ({ ...current, [name]: color.hex }));
    const handleTemplateSelect = (templateId) => setDraftTheme({ ...templates[templateId].styles, template: templateId });
    const handleImageChange = (url) => setDraftTheme(current => ({...current, backgroundImageUrl: url }));
    const handleResetColor = (colorName) => {
        const templateId = draftTheme.template || 'default';
        const defaultValue = templates[templateId].styles[colorName];
        setDraftTheme(current => ({ ...current, [colorName]: defaultValue }));
    };

    const ColorInput = ({ label, colorName }) => (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-center gap-2">
                <div onClick={() => setActiveColorPicker(activeColorPicker === colorName ? null : colorName)}
                    className="w-10 h-10 rounded-md border cursor-pointer"
                    style={{ backgroundColor: draftTheme[colorName] }}
                ></div>
                <span className="text-sm text-gray-600 font-mono">{draftTheme[colorName]}</span>
                <button onClick={() => handleResetColor(colorName)} className="text-gray-400 hover:text-prym-dark-green"><HiRefresh/></button>
            </div>
            {activeColorPicker === colorName && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative">
                        <div className="fixed inset-0" onClick={() => setActiveColorPicker(null)} />
                        <div className="relative z-10">
                            <SketchPicker color={draftTheme[colorName]} onChangeComplete={(c) => handleColorChange(c, colorName)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="animate-faderrout">
            <DashboardTabs />
            <div className="space-y-4">
                <ProFeatureWrapper isPro={isProUser}>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-3">Templates</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {Object.entries(templates).map(([id, { name, previewStyles }]) => (
                                <div key={id} onClick={() => handleTemplateSelect(id)} className={`text-center rounded-lg cursor-pointer border-2 transition-all ${draftTheme.template === id ? 'border-prym-pink ring-2 ring-prym-pink' : 'border-transparent hover:border-prym-pink/50'}`}>
                                    <div className="h-32 rounded-t-md p-2" style={{ backgroundColor: previewStyles.bgColor }}>
                                        <div className="w-8 h-8 mx-auto rounded-full" style={{ backgroundColor: previewStyles.buttonColor }}></div>
                                        <div className="w-full h-4 mt-2 rounded-sm" style={{ backgroundColor: previewStyles.linkColor }}></div>
                                        <div className="w-full h-4 mt-1 rounded-sm" style={{ backgroundColor: previewStyles.linkColor }}></div>
                                    </div>
                                    <p className="text-sm font-medium p-2">{name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ProFeatureWrapper>
                <ProFeatureWrapper isPro={isProUser}>
                    <Disclosure>
                        {({ open }) => (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <Disclosure.Button className="w-full flex justify-between items-center"><span className="font-semibold">Background</span><HiChevronDown className={`h-5 w-5 ${open ? 'transform rotate-180' : ''}`} /></Disclosure.Button>
                                <Disclosure.Panel className="mt-4 pt-4 border-t">
                                    {draftTheme.template === 'image_bg' ? (
                                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label><ImageUploader existingImageUrl={draftTheme.backgroundImageUrl} onImageChange={handleImageChange} /></div>
                                    ) : ( <ColorInput label="Background Color" colorName="bgColor" /> )}
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                </ProFeatureWrapper>
                <ProFeatureWrapper isPro={isProUser}>
                    <Disclosure>
                        {({ open }) => (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <Disclosure.Button className="w-full flex justify-between items-center"><span className="font-semibold">Block Style</span><HiChevronDown className={`h-5 w-5 ${open ? 'transform rotate-180' : ''}`} /></Disclosure.Button>
                                <Disclosure.Panel className="mt-4 pt-4 border-t">
                                    <ColorInput label="Block Background Color" colorName="blockBgColor" />
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                </ProFeatureWrapper>
                <ProFeatureWrapper isPro={isProUser}>
                    <Disclosure>
                        {({ open }) => (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <Disclosure.Button className="w-full flex justify-between items-center"><span className="font-semibold">Link Style</span><HiChevronDown className={`h-5 w-5 ${open ? 'transform rotate-180' : ''}`} /></Disclosure.Button>
                                <Disclosure.Panel className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorInput label="Link Color" colorName="linkColor" />
                                    <ColorInput label="Link Text Color" colorName="linkTextColor" />
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                </ProFeatureWrapper>
                <ProFeatureWrapper isPro={isProUser}>
                    <Disclosure>
                        {({ open }) => (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <Disclosure.Button className="w-full flex justify-between items-center"><span className="font-semibold">Action Button Style</span><HiChevronDown className={`h-5 w-5 ${open ? 'transform rotate-180' : ''}`} /></Disclosure.Button>
                                <Disclosure.Panel className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorInput label="Button Color" colorName="actionButtonColor" />
                                    <ColorInput label="Button Text Color" colorName="actionButtonTextColor" />
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                </ProFeatureWrapper>
            </div>
        </div>
    );
};
export default CustomizePage;