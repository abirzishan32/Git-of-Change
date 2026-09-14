import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { StatusPage } from '../../pages/StatusPage';
import { PageLoader } from '../ui/Spinner';

/** Renders child routes only for signed-in users, optionally limited to some roles. */
export function ProtectedRoute({ roles }) {
  const { user, isRestoringSession } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return <PageLoader />;
  }

  if (!user) {
    // Remember the destination so the login page can send them back here
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <StatusPage
        code="403"
        title="You don't have access to this page"
        description="This area is only available to administrators."
      />
    );
  }

  return <Outlet />;
}
