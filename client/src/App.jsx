import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { GuestRoute } from './components/routing/GuestRoute';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { ScrollToTop } from './components/routing/ScrollToTop';
import AccountPage from './pages/AccountPage';
import CausesPage from './pages/CausesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyDonationsPage from './pages/MyDonationsPage';
import RegisterPage from './pages/RegisterPage';
import { NotFoundPage } from './pages/StatusPage';

// Split out the pages that pull in Stripe or are only used by admins
const DonatePage = lazy(() => import('./pages/DonatePage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="donate" element={<CausesPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="donate/:causeSlug" element={<DonatePage />} />
            <Route path="my-donations" element={<MyDonationsPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          <Route path="admin" element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </>
  );
}
