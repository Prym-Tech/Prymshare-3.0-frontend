import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineUsers, HiOutlineShoppingCart, HiOutlineCreditCard } from 'react-icons/hi';


const BottomNav = () => {
    const navItems = [
        { to: "/me/appearance", icon: <HiOutlineHome className="h-6 w-6" />, text: "Page" },
        { to: "/me/store", icon: <HiOutlineShoppingCart className="h-6 w-6" />, text: "Store" },
        { to: "/me/analytics", icon: <HiOutlineChartBar className="h-6 w-6" />, text: "Analytics" },
        { to: "/me/payments", icon: <HiOutlineCreditCard className="h-6 w-6" />, text: "Payments" },
        { to: "/me/customers", icon: <HiOutlineUsers className="h-6 w-6" />, text: "Customers" },
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
