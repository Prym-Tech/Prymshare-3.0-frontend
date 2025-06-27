import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { useAuth } from '../../hooks/useAuth.js';
import { isAuthenticatedAtom } from '../../state/authAtoms.js';
import Logo from '../../assets/images/new_logo.png';
import { HiMenu, HiX } from 'react-icons/hi';

const NavLinks = ({ onClick }) => (
    <>
        <Link to='/features' onClick={onClick} className="hover:text-prym-pink">Features</Link>
        <Link to='/pricing' onClick={onClick} className="hover:text-prym-pink">Pricing</Link>
        <a href='mailto:prymshare.info@gmail.com' onClick={onClick} className="hover:text-prym-pink">Contact Us</a>
    </>
);

const Navbar = () => {
    // This state is still useful for reactivity once the app has loaded.
    const isAuthenticatedInState = useAtomValue(isAuthenticatedAtom);
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    // FIX: Add a direct check to localStorage to prevent race conditions on page load.
    // This ensures the correct UI is shown instantly.
    const tokenInStorage = localStorage.getItem('prymshare_token');
    const isAuthenticated = isAuthenticatedInState || (tokenInStorage && tokenInStorage !== 'null');

    return (
        <nav className='sticky top-0 z-50 p-4'>
            <div className='flex items-center justify-between max-w-6xl mx-auto bg-white/70 backdrop-blur-lg rounded-full shadow-md px-6 py-2'>
                <Link to="/" className='flex-shrink-0'>
                    <img src={Logo} className='h-8 w-auto' alt='Prymshare Logo' />
                </Link>

                <div className='hidden lg:flex items-center gap-6 text-prym-dark text-sm font-medium'>
                    <NavLinks />
                </div>

                <div className='hidden lg:flex items-center gap-2 text-sm font-medium'>
                    {isAuthenticated ? (
                        <>
                            <Link to='/me/appearance' className='px-5 py-2 text-prym-dark bg-white border-2 border-gray-200 rounded-full hover:bg-gray-100 transition-colors'>Dashboard</Link>
                            <button onClick={logout} className='px-5 py-2 text-white bg-prym-pink rounded-full hover:bg-opacity-90 transition-opacity'>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to='/login' className='px-5 py-2 text-prym-dark rounded-full hover:bg-gray-100 transition-colors'>Login</Link>
                            <Link to='/register' className='px-5 py-2.5 text-white bg-prym-dark-green rounded-full hover:bg-opacity-90 transition-opacity'>Join for Free</Link>
                        </>
                    )}
                </div>

                <div className='lg:hidden'>
                    <button onClick={toggleMenu} className="text-2xl text-prym-dark">
                        {isOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='lg:hidden mt-2 bg-white rounded-lg shadow-xl p-6 flex flex-col gap-5 text-center text-prym-dark font-medium'>
                    <NavLinks onClick={toggleMenu} />
                    <hr/>
                     {isAuthenticated ? (
                        <>
                            <Link to='/me/appearance' onClick={toggleMenu} className='w-full px-5 py-2 text-prym-dark bg-white border-2 border-gray-200 rounded-full hover:bg-gray-100 transition-colors'>Dashboard</Link>
                            <button onClick={() => { logout(); toggleMenu(); }} className='w-full px-5 py-2 text-white bg-prym-pink rounded-full hover:bg-opacity-90 transition-opacity'>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to='/login' onClick={toggleMenu} className='w-full py-2 rounded-full hover:bg-gray-100 transition-colors'>Login</Link>
                            <Link to='/register' onClick={toggleMenu} className='w-full py-2.5 text-white bg-prym-dark-green rounded-full hover:bg-opacity-90 transition-opacity'>Join for Free</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;