import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../lib/api.js';
import FormInput from '../components/ui/FormInput.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        console.log("Submitting registration data:", data);
        
        // Ensure only the expected fields are sent to the backend
        const payload = {
            email: data.email,
            password: data.password,
            re_password: data.re_password
        };

        try {
            await apiClient.post('/auth/registration/', payload);
            toast.success('Registration successful! Please check your email to activate your account.');
            navigate('/login');
        } catch (error) {
            console.error("Registration failed:", error.response || error);
            const errorData = error.response?.data;
            let errorMsg = 'Registration failed. Please try again.';
            if (errorData) {
              // Flatten all error messages from the backend into one string
              errorMsg = Object.values(errorData).flat().join(' ');
            }
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // const googleOnSuccess = async (credentialResponse) => {
    //     setLoading(true);
    //     try {
    //         const response = await apiClient.post('/auth/google/login', { access_token: credentialResponse.credential });
    //         login(response.data.user, response.data.access_token);
    //         toast.success('Google sign up successful!');
    //     } catch (error) {
    //         toast.error('Google authentication failed.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const googleOnSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            // This now posts the access_token to our new, stable endpoint
            const response = await apiClient.post('/auth/google/', {
                access_token: credentialResponse.credential,
            });
            login(response.data.user, response.data.access_token);
            toast.success('Google sign up successful!');
        } catch (error) {
            toast.error('Google authentication failed.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <div className="text-left mb-8">
                <h1 className='text-4xl font-black text-prym-dark-green tracking-tighter'>JOIN PRYMSHARE</h1>
                <p className='text-sm text-gray-500 mt-2'>Sign up for free, and monetize fast and free.</p>
            </div>
             <p className="mb-4 bg-[#EEF1E8] text-[#505449] p-3 py-2 text-xs rounded-lg text-center">Already a Prymer? <Link to="/login" className='text-prym-pink font-semibold'>Sign in</Link></p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* NOTE: Brand name input is removed from initial signup. This is a critical
                  part of the bug fix. This field should be part of an onboarding
                  flow AFTER the user has successfully registered and logged in.
                */}
                <FormInput placeholder="Email address" {...register('email', { required: 'Email is required' })} error={errors.email} />
                <FormInput type="password" placeholder="Password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} error={errors.password} />
                <FormInput type="password" placeholder="Confirm Password" {...register('re_password', { required: 'Please confirm your password', validate: value => value === password || 'Passwords do not match' })} error={errors.re_password} />
                
                <p className="text-xs text-gray-500 pt-2">By creating an account, you agree to Prymshare's <a href="/terms-conditions" className='text-prym-pink font-semibold'>Terms of Service.</a></p>

                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 text-sm font-semibold text-white bg-prym-dark-green rounded-full hover:bg-opacity-90 disabled:bg-gray-400">
                    {loading ? <Spinner/> : 'Create account'}
                </button>
            </form>

            <div className='flex items-center my-6'><hr className='flex-grow'/><span className='mx-4 text-xs text-gray-500'>OR</span><hr className='flex-grow'/></div>
            <GoogleLogin onSuccess={googleOnSuccess} onError={() => toast.error('Google login failed.')} width="100%" theme="outline" size="large"/>
        </>
    );
};

export default SignupPage;

