import { useAuth } from '../../hooks/useAuth.js';
import { useAtom } from 'jotai';
import { activePageAtom } from '../../state/pageAtoms.js';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HiChevronDown, HiPlus } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const PageSwitcher = ({ pages, isMobile = false }) => {
    const { user } = useAuth();
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const navigate = useNavigate();

    const handlePageSwitch = (page) => {
        setActivePage(page);
    };

    const handleCreateNewPage = () => {
        if (user?.user_type === 'pro' || pages.length === 0) {
            setActivePage(null);
            navigate('/onboarding');
        } else {
            toast.error("Upgrade to Pro to create more pages.");
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left w-full">
            <div>
                <Menu.Button className={`inline-flex w-full justify-between items-center rounded-md px-4 py-2 text-sm font-bold hover:bg-gray-200/50 ${isMobile ? 'text-prym-dark-green' : 'bg-gray-100'}`}>
                    <span className="truncate">{activePage ? activePage.brand_name : "Select a Page"}</span>
                    <HiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="px-1 py-1">
                        {pages.map(page => (
                            <Menu.Item key={page.id}>
                                {({ active }) => (
                                    <button onClick={() => handlePageSwitch(page)} className={`${ active ? 'bg-prym-green text-white' : 'text-gray-900' } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                        {page.brand_name}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button onClick={handleCreateNewPage} className={`${ active ? 'bg-prym-green text-white' : 'text-gray-900' } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    <HiPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                                    Create New Page
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default PageSwitcher;
