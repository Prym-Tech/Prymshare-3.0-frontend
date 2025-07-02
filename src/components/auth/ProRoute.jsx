import { Navigate, Outlet } from 'react-router-dom';
import { userAtom } from '../../state/authAtoms.js';
import { useAtomValue } from 'jotai';
import { toast } from 'react-hot-toast';

const ProRoute = () => {
    const user = useAtomValue(userAtom);

    if (user?.user_type === 'pro') {
        return <Outlet />;
    } else {
        // Redirect and show a message for non-pro users
        toast.error("Upgrade to Pro to access this feature!");
        return <Navigate to="/me/appearance" replace />;
    }
};

export default ProRoute;