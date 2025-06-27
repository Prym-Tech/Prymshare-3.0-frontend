import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import apiClient from '../lib/api';
import Spinner from '../components/ui/Spinner';

const ResetPasswordConfirmPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const new_password1 = watch('new_password1');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = { ...data, uid, token };
            await apiClient.post('/auth/password/reset/confirm/', payload);
            toast.success('Your password has been reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Invalid link or link has expired. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h1 className='text-2xl font-bold text-prym-dark-green text-center mb-6'>Set New Password</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="password" placeholder="New Password" {...register('new_password1', { required: 'Password is required' })} className="w-full p-3 border rounded"/>
                    {errors.new_password1 && <p className="text-red-500 text-xs">{errors.new_password1.message}</p>}
                    <input type="password" placeholder="Confirm New Password" {...register('new_password2', { required: 'Please confirm your password', validate: value => value === new_password1 || 'Passwords do not match' })} className="w-full p-3 border rounded"/>
                    {errors.new_password2 && <p className="text-red-500 text-xs">{errors.new_password2.message}</p>}
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 text-sm font-semibold text-white bg-prym-dark-green rounded-full">
                        {loading ? <Spinner /> : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordConfirmPage;