import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient from '../lib/api.js';
import Spinner from '../components/ui/Spinner.jsx';

const ActivateAccountPage = () => {
    const { key } = useParams(); // Changed from uid, token to key
    const navigate = useNavigate();
    const [status, setStatus] = useState('activating');

    useEffect(() => {
        const activate = async () => {
            if (!key) {
                setStatus('error');
                return;
            }
            try {
                // dj-rest-auth's verification endpoint expects a POST with the key
                await apiClient.post('/auth/registration/verify-email/', { key });
                setStatus('success');
                toast.success('Account activated successfully!');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                toast.error('Activation link is invalid or has expired.');
            }
        };
        activate();
    }, [key, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center bg-white p-10 rounded-lg shadow-md">
                {status === 'activating' && (
                    <>
                        <Spinner />
                        <h1 className="text-2xl font-bold mt-4">Activating your account...</h1>
                    </>
                )}
                {status === 'success' && (
                     <>
                        <h1 className="text-2xl font-bold text-prym-green">Account Activated!</h1>
                        <p className="mt-2">You will be redirected to the login page shortly.</p>
                    </>
                )}
                {status === 'error' && (
                     <>
                        <h1 className="text-2xl font-bold text-red-500">Activation Failed</h1>
                        <p className="mt-2">This link is invalid or has expired.</p>
                        <Link to="/register" className="mt-4 inline-block text-prym-pink">Try signing up again</Link>
                    </>
                )}
            </div>
        </div>
    );
};
export default ActivateAccountPage;