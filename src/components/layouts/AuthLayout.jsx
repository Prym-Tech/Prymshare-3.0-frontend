import { Outlet, Link } from 'react-router-dom';
import LoginPic from '../../assets/images/login-pic.png';
import Logo from '../../assets/images/new_logo.png'; // Corrected logo path

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Section - Image (UI Improved) */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-12">
                <img 
                    src={LoginPic} 
                    alt="Prymshare Monetization" 
                    className="max-w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
            </div>

            {/* Right Section - Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/"><img className='h-10 w-auto' src={Logo} alt="Prymshare" /></Link>
                </div>

                <div className="my-auto max-w-md w-full mx-auto">
                    <Outlet /> {/* This will render Login or Signup pages */}
                </div>

                <div className="mt-auto text-center text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Prymshare. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
