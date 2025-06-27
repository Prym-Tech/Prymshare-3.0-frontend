import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout.jsx';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';
import DashboardLayout from './components/layouts/DashboardLayout.jsx'; // Import new layout

// Import Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage.jsx';
import ActivateAccountPage from './pages/ActivateAccountPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx'; // Import new page
import PageEditor from './components/dashboard/PageEditor.jsx'; // Import new component

function App() {
  return (
    <Routes>
      {/* Public Routes with the main navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Auth routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>
      
      <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
      <Route path="/activate/:key" element={<ActivateAccountPage />} />

      {/* Protected Routes for logged-in users */}
      <Route element={<PrivateRoute />}>
        {/* Onboarding route, does not use the main dashboard layout */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Main Dashboard routes, all nested under the DashboardLayout */}
        <Route element={<DashboardLayout />}>
            <Route path="/me/appearance" element={<PageEditor />} />
            {/* Add other dashboard routes like /me/analytics here */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;


