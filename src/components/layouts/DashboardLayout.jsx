import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar.jsx';
import MobilePreview from '../dashboard/MobilePreview.jsx';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content & Page Editor */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 lg:p-12">
                     {/* The Outlet will render the specific dashboard page (e.g., Appearance, Analytics) */}
                    <Outlet />
                </div>
            </main>

            {/* Live Mobile Preview */}
            <aside className="hidden lg:flex w-full max-w-sm xl:max-w-md 2xl:max-w-lg bg-white p-8 items-center justify-center">
                <MobilePreview />
            </aside>
        </div>
    );
};

export default DashboardLayout;