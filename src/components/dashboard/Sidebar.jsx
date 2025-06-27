import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../../assets/images/logo-main.png';
import {
    HiOutlineHome, HiOutlinePencilAlt, HiOutlineChartBar, HiOutlineUsers,
    HiOutlineCog, HiOutlineLogout
} from 'react-icons/hi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: "/me/appearance", icon: <HiOutlineHome className="h-6 w-6" />, text: "My Page" },
        { to: "/me/analytics", icon: <HiOutlineChartBar className="h-6 w-6" />, text: "Analytics" },
        { to: "/me/customers", icon: <HiOutlineUsers className="h-6 w-6" />, text: "Customers" },
    ];

    const NavItem = ({ to, icon, text }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors duration-200 ${
                isActive
                    ? 'bg-prym-green text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`
            }
        >
            {icon}
            <span className="font-medium">{text}</span>
        </NavLink>
    );

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
            <div className="flex items-center space-x-2 p-2 mb-8">
                <img src={Logo} alt="Prymshare" className="h-8 w-auto" />
                <span className="font-bold text-lg text-prym-dark-green">prymshare</span>
            </div>
            
            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
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

