import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { usePages } from '../../hooks/usePages.js';
import { activePageAtom, pageSectionsAtom } from '../../state/pageAtoms.js';
import Sidebar from '../dashboard/Sidebar.jsx';
import MobilePreview from '../dashboard/MobilePreview.jsx';
import BottomNav from '../dashboard/BottomNav.jsx';

const DashboardLayout = () => {
    // Centralize data loading here
    const { pages, loading: pagesLoading } = usePages();
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [, setSections] = useAtom(pageSectionsAtom);

    useEffect(() => {
        // When the pages data is loaded, set the first page as active if none is set.
        // This provides the necessary data to all child components like the preview.
        if (!pagesLoading && pages.length > 0 && !activePage) {
            const firstPage = pages[0];
            setActivePage(firstPage);
            setSections(firstPage.sections);
        }
        // If the activePage changes (e.g., from a save), update sections
        else if (activePage) {
             setSections(activePage.sections);
        }
    }, [pages, pagesLoading, activePage, setActivePage, setSections]);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar />
            </div>
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex-1 p-4 md:p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">
                        <Outlet />
                    </div>
                </div>
                <BottomNav />
            </main>
            <aside className="hidden lg:flex w-full max-w-sm xl:max-w-md bg-white p-6 items-center justify-center border-l border-gray-200">
                <MobilePreview />
            </aside>
        </div>
    );
};

export default DashboardLayout;