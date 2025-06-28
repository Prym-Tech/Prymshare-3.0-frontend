import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import MainLayout from './components/layouts/MainLayout.jsx';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';
import DashboardLayout from './components/layouts/DashboardLayout.jsx';

// Import Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage.jsx';
import ActivateAccountPage from './pages/ActivateAccountPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import PageEditor from './components/dashboard/PageEditor.jsx';
import Spinner from './components/ui/Spinner.jsx';

function App() {
  const { authLoading, verifyAuth } = useAuth();

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // While the initial authentication check is running, show a loading screen
  // to prevent any content flicker or incorrect redirects.
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>
      <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
      <Route path="/activate/:key" element={<ActivateAccountPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<DashboardLayout />}>
            <Route path="/me/appearance" element={<PageEditor />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

