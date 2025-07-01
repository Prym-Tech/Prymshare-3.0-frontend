import { NavLink } from 'react-router-dom';

const DashboardTabs = () => {
    const tabs = [
        { name: 'Page', href: '/me/appearance' },
        { name: 'Customize', href: '/me/customize' },
    ];

    return (
        <div className="mb-8">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.name}
                            to={tab.href}
                            end // Use `end` to prevent parent routes from matching
                            className={({ isActive }) =>
                                `whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                isActive
                                    ? 'border-prym-pink text-prym-pink'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default DashboardTabs;
