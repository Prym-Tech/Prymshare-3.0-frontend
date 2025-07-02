import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { usePages } from '../../hooks/usePages.js';
import { activePageAtom, pageSectionsAtom } from '../../state/pageAtoms.js';
import Sidebar from '../dashboard/Sidebar.jsx';
import MobilePreview from '../dashboard/MobilePreview.jsx';
import BottomNav from '../dashboard/BottomNav.jsx';
import Spinner from '../ui/Spinner.jsx';
import PageSwitcher from '../dashboard/PageSwitcher.jsx';

const DashboardLayout = () => {
    const { pages, loading: pagesLoading } = usePages();
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const [, setSections] = useAtom(pageSectionsAtom);

    useEffect(() => {
        if (!pagesLoading && pages.length > 0 && (!activePage || !pages.find(p => p.id === activePage.id))) {
            const firstPage = pages[0];
            setActivePage(firstPage);
            setSections(firstPage.sections);
        } else if (activePage) {
             setSections(activePage.sections);
        }
    }, [pages, pagesLoading, activePage, setActivePage, setSections]);

    if (pagesLoading) {
        return <div className="flex h-screen w-screen items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar pages={pages} />
            </div>
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Mobile Header with Page Switcher */}
                <header className="lg:hidden sticky top-0 bg-white shadow-sm z-10 p-2">
                    <PageSwitcher pages={pages} isMobile={true} />
                </header>
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