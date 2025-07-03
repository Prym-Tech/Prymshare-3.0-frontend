import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { activePageAtom } from '../state/pageAtoms';
import { toast } from 'react-hot-toast';
import apiClient from '../lib/api';
import Spinner from '../components/ui/Spinner';
import { HiCheckCircle } from 'react-icons/hi';

const PaymentSettingsPage = () => {
    const [activePage, setActivePage] = useAtom(activePageAtom);
    const { register, handleSubmit, watch, setValue } = useForm();
    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [saving, setSaving] = useState(false);
    const [accountName, setAccountName] = useState('');

    const accountNumber = watch('account_number');
    const bankCode = watch('bank_code');

    // Fetch the list of Nigerian banks on component mount
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await apiClient.get('/payments/banks/');
                setBanks(response.data.data);
            } catch (error) {
                toast.error("Could not fetch bank list.");
            } finally {
                setLoadingBanks(false);
            }
        };
        fetchBanks();
    }, []);

    // Set form values when the active page loads
    useEffect(() => {
        if (activePage) {
            setValue('bank_code', activePage.bank_code);
            setValue('account_number', activePage.account_number);
            setAccountName(activePage.account_name || '');
        }
    }, [activePage, setValue]);

    // Automatically verify account when bank and account number are filled
    useEffect(() => {
        if (accountNumber && accountNumber.length === 10 && bankCode) {
            const verifyAccount = async () => {
                setVerifying(true);
                setAccountName('');
                try {
                    const response = await apiClient.post('/payments/resolve-account/', { account_number: accountNumber, bank_code: bankCode });
                    if (response.data.status) {
                        setAccountName(response.data.data.account_name);
                        toast.success("Account verified!");
                    } else {
                        toast.error(response.data.message || "Could not verify account.");
                    }
                } catch (error) {
                    toast.error("Account verification failed.");
                } finally {
                    setVerifying(false);
                }
            };
            verifyAccount();
        }
    }, [accountNumber, bankCode]);

    const onSubmit = async (data) => {
        if (!accountName) {
            toast.error("Please verify your account details first.");
            return;
        }
        setSaving(true);
        try {
            const response = await apiClient.post(`/pages/${activePage.id}/payment-settings/`, data);
            setActivePage(prev => ({ ...prev, ...response.data }));
            toast.success("Payment settings saved!");
        } catch (error) {
            toast.error("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-faderrout">
            <h1 className="text-3xl font-bold text-prym-dark-green mb-2">Payment Settings</h1>
            <p className="text-gray-500 mb-8">Set up your bank account to receive payouts.</p>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <div>
                        <label htmlFor="bank_code" className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                        <select
                            id="bank_code"
                            {...register('bank_code', { required: true })}
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            disabled={loadingBanks}
                        >
                            <option value="">{loadingBanks ? 'Loading banks...' : 'Select a bank'}</option>
                            {banks.map(bank => (
                                <option key={bank.code} value={bank.code}>{bank.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                            id="account_number"
                            type="text"
                            maxLength="10"
                            {...register('account_number', { required: true, minLength: 10, maxLength: 10 })}
                            className="w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    {verifying && <div className="flex items-center gap-2 text-gray-500"><Spinner/> Verifying account...</div>}
                    
                    {accountName && (
                        <div className="bg-prym-green/10 p-3 rounded-md flex items-center gap-2">
                            <HiCheckCircle className="h-5 w-5 text-prym-green" />
                            <p className="font-semibold text-prym-dark-green">{accountName}</p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving || verifying || !accountName}
                            className="bg-prym-dark-green text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                        >
                            {saving ? <Spinner /> : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentSettingsPage;