import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useAtom } from 'jotai';
import { activePageAtom } from '../../state/pageAtoms.js';
import Logo from '../../assets/images/new_logo.png';
import {
    HiOutlineHome, HiOutlineChartBar, HiOutlineUsers, HiOutlineShoppingCart,
    HiOutlineCog, HiOutlineLogout, HiChevronDown, HiPlus, HiOutlineColorSwatch
} from 'react-icons/hi';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PageSwitcher from './PageSwitcher.jsx';

const Sidebar = ({ pages, refetchPages }) => {
    const { user, logout } = useAuth();
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePageSwitch = (page) => {
        setActivePage(page);
    };

    const navItems = [
        { to: "/me/appearance", icon: <HiOutlineHome />, text: "Page" },
        { to: "/me/store", icon: <HiOutlineShoppingCart />, text: "Store" },
        { to: "/me/analytics", icon: <HiOutlineChartBar />, text: "Analytics" },
        { to: "/me/customers", icon: <HiOutlineUsers />, text: "Customers" },
    ];
    
    const proNavItems = [
        { to: "/me/customize", icon: <HiOutlineColorSwatch />, text: "Customize" }
    ];

    const NavItem = ({ to, icon, text, isPro = false }) => {
        const isProFeature = isPro && user?.user_type !== 'pro';
        return (
            <NavLink
                to={isProFeature ? '#' : to}
                title={isProFeature ? "Upgrade to Pro to use this feature" : ""}
                className={({ isActive }) => `flex items-center justify-between rounded-lg px-3 py-2 transition-colors duration-200 ${ isProFeature ? 'text-gray-400 cursor-not-allowed' : isActive ? 'bg-prym-green text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200' }`}
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-medium">{text}</span>
                </div>
                {isProFeature && <span className="text-xs bg-prym-pink text-white font-bold px-2 py-0.5 rounded-full">PRO</span>}
            </NavLink>
        );
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
            {/* Page Switcher */}
            <div className="mb-8">
                <PageSwitcher pages={pages} />
            </div>
            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
                <hr className="my-4" />
                {proNavItems.map(item => <NavItem key={item.to} {...item} isPro={true} />)}
            </nav>

            <div className="mt-auto">
                <div className="p-2 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-prym-dark-green text-white flex items-center justify-center font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold truncate">{user?.email}</p>
                            <button onClick={handleLogout} className="text-xs text-prym-pink hover:underline">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
