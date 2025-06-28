import { useAtomValue } from 'jotai';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticatedAtom, authLoadingAtom } from '../../state/authAtoms.js';

const PrivateRoute = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const authLoading = useAtomValue(authLoadingAtom);

  // If the initial check is still loading, don't render anything yet.
  if (authLoading) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
