import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineUsers, HiOutlinePlusCircle } from 'react-icons/hi';

const BottomNav = () => {
    const navItems = [
        { to: "/me/appearance", icon: <HiOutlineHome className="h-6 w-6" />, text: "My Page" },
        { to: "/me/analytics", icon: <HiOutlineChartBar className="h-6 w-6" />, text: "Analytics" },
        // This middle button can be used for a primary action, like "Add Block"
        // For now, it links to the main editor page.
        { to: "/me/appearance", icon: <HiOutlinePlusCircle className="h-8 w-8 text-prym-pink -mt-2" />, text: "Add" },
        { to: "/me/customers", icon: <HiOutlineUsers className="h-6 w-6" />, text: "Customers" },
        // Add another link here, perhaps for settings or income
        { to: "/me/settings", icon: <HiOutlineUsers className="h-6 w-6" />, text: "Settings" },
    ];

    const NavItem = ({ to, icon, text }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
                isActive
                    ? 'text-prym-dark-green'
                    : 'text-gray-400 hover:text-prym-dark-green'
                }`
            }
        >
            {icon}
            <span className="text-xs mt-1">{text}</span>
        </NavLink>
    );

    return (
        <div className="lg:hidden sticky bottom-0 w-full bg-white border-t border-gray-200 flex justify-around">
            {navItems.map(item => <NavItem key={item.to} {...item} />)}
        </div>
    );
};

export default BottomNav;
