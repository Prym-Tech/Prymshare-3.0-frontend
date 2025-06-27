import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import apiClient from '../lib/api.js';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // API call to the backend to create the first page
            await apiClient.post('/pages/', { brand_name: data.brand_name });
            toast.success('Your page has been created!');
            // Redirect to the main dashboard editor
            navigate('/me/appearance');
        } catch (error) {
            const errorMsg = error.response?.data?.brand_name?.[0] || 'This name is already taken.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-prym-dark-green flex flex-col items-center justify-center p-4">
            <div className="text-center text-white mb-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Welcome, {user?.first_name || 'Prymer'}!</h1>
                <p className="text-lg text-prym-green mt-2">Let's create your page.</p>
            </div>

            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-center text-prym-dark mb-2">Choose your Prymshare URL</h2>
                <p className="text-center text-gray-500 mb-6">This will be your unique link. You can change it later.</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 font-medium">prymshare.co/</span>
                        <input
                            {...register('brand_name', { 
                                required: 'A page name is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9_-]+$/,
                                    message: 'No spaces or special characters allowed.'
                                }
                            })}
                            placeholder="yourname"
                            className="w-full text-lg pl-32 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-prym-green focus:border-prym-green transition-all"
                        />
                    </div>
                    {errors.brand_name && <p className="text-red-500 text-xs text-center">{errors.brand_name.message}</p>}

                    <button type="submit" disabled={loading} className="w-full flex justify-center py-4 text-lg font-bold text-white bg-prym-pink rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 transition-colors shadow-lg">
                        {loading ? <Spinner /> : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;