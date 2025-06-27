import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

import FormInput from '../components/ui/FormInput';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../lib/api';

const LoginPage = () => {
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/login/', data);
            login(response.data.user, response.data.access_token);
            toast.success('Login successful!');
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const googleOnSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/google/', { access_token: credentialResponse.credential });
            login(response.data.user, response.data.access_token);
            toast.success('Google login successful!');
        } catch (error) {
            toast.error('Google authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="text-left mb-10">
                <h1 className='text-4xl font-black text-prym-dark-green tracking-tighter'>WELCOME BACK</h1>
                <p className='text-sm text-gray-500 mt-2'>Login to your Prymshare account.</p>
            </div>
            <p className="mb-4 bg-[#EEF1E8] text-[#505449] p-3 py-2 text-xs rounded-lg text-center">Not a Prymer? <Link to="/register" className='text-prym-pink font-semibold'>Sign up</Link></p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput placeholder="Email address" {...register('email', { required: 'Email is required' })} error={errors.email} />
                <FormInput type="password" placeholder="Password" {...register('password', { required: 'Password is required' })} error={errors.password} />
                
                <div className="text-right">
                    <Link to='/forgot-password' className='text-xs text-prym-pink font-semibold'>Forgot password?</Link>
                </div>
                
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 text-sm font-semibold text-white bg-prym-dark-green rounded-full hover:bg-opacity-90 disabled:bg-gray-400 transition-colors">
                    {loading ? <Spinner /> : 'Log in'}
                </button>
            </form>

            <div className='flex items-center my-6'>
                <hr className='flex-grow border-t border-gray-300' />
                <span className='mx-4 text-xs text-gray-500'>OR</span>
                <hr className='flex-grow border-t border-gray-300' />
            </div>

            <GoogleLogin onSuccess={googleOnSuccess} onError={() => toast.error('Google login failed.')} width="100%" theme="outline" size="large" />
        </>
    );
};

export default LoginPage;

