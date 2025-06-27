import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import apiClient from '../lib/api';
import FormInput from '../components/ui/FormInput';
import Spinner from '../components/ui/Spinner';

const ForgotPasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await apiClient.post('/auth/password/reset/', data);
            toast.success('If an account with that email exists, a password reset link has been sent.');
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <div className="text-left mb-10">
                <h1 className='text-4xl font-black text-prym-dark-green tracking-tighter'>FORGOT PASSWORD</h1>
                <p className='text-sm text-gray-500 mt-2'>Enter your email to receive a reset link.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput placeholder="Email address" {...register('email', { required: 'Email is required' })} error={errors.email} />
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 text-sm font-semibold text-white bg-prym-dark-green rounded-full hover:bg-opacity-90 disabled:bg-gray-400">
                    {loading ? <Spinner /> : 'Send Reset Link'}
                </button>
            </form>
        </>
    );
};
export default ForgotPasswordPage;
