import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar.jsx';
import MobilePreview from '../dashboard/MobilePreview.jsx';
import BottomNav from '../dashboard/BottomNav.jsx';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content & Page Editor */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex-1 p-4 md:p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">
                        <Outlet />
                    </div>
                </div>
                 {/* Mobile Bottom Navigation */}
                <BottomNav />
            </main>

            {/* Live Mobile Preview (hidden on screens smaller than lg) */}
            <aside className="hidden lg:flex w-full max-w-sm xl:max-w-md bg-white p-6 items-center justify-center border-l border-gray-200">
                <MobilePreview />
            </aside>
        </div>
    );
};

export default DashboardLayout;