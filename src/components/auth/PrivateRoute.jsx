import { useAtomValue } from 'jotai';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticatedAtom } from '../../state/authAtoms';

const PrivateRoute = () => {
  // This check is now more robust. We check the atom first, but fall back
  // to a direct localStorage check. This prevents the race condition on
  // page load where the atom hasn't been hydrated from storage yet.
  const isAuthenticatedInState = useAtomValue(isAuthenticatedAtom);
  const tokenInStorage = localStorage.getItem('prymshare_token');

  return isAuthenticatedInState || tokenInStorage ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
