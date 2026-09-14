import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { getDefaultPathFor } from '../../lib/routes';
import { PageLoader } from '../ui/Spinner';

/**
 * For the login and sign-up pages. Signed-in users are sent on to where they
 * were going, which is also how a successful login leaves the page.
 */
export function GuestRoute() {
  const { user, isRestoringSession } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to={location.state?.from ?? getDefaultPathFor(user)} replace />;
  }

  return <Outlet />;
}
