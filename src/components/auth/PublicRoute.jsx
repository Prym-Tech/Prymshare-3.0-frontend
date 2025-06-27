import { useAtomValue } from 'jotai';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticatedAtom } from '../../state/authAtoms.js';

const PublicRoute = () => {
  // This state is still useful for reactivity once the app has loaded.
  const isAuthenticatedInState = useAtomValue(isAuthenticatedAtom);
  
  // FIX: Add a direct check to localStorage to prevent race conditions on page load.
  // This ensures the redirect happens instantly if a token exists.
  const tokenInStorage = localStorage.getItem('prymshare_token');
  const isAuthenticated = isAuthenticatedInState || (tokenInStorage && tokenInStorage !== 'null');

  return isAuthenticated ? <Navigate to="/me/appearance" replace /> : <Outlet />;
};

export default PublicRoute;