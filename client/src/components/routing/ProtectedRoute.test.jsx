import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AuthContext } from '../../context/auth-context';
import { ProtectedRoute } from './ProtectedRoute';

function LoginProbe() {
  const location = useLocation();
  return <p>Login page (from {location.state?.from?.pathname})</p>;
}

function renderAt(path, auth) {
  return render(
    <AuthContext value={{ isRestoringSession: false, ...auth }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<LoginProbe />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-donations" element={<p>My donations</p>} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<p>Admin dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext>,
  );
}

describe('ProtectedRoute', () => {
  it('waits for the session to be restored before deciding', () => {
    renderAt('/my-donations', { user: null, isRestoringSession: true });

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });

  it('sends visitors to the login page and remembers where they were going', () => {
    renderAt('/my-donations', { user: null });

    expect(screen.getByText('Login page (from /my-donations)')).toBeInTheDocument();
  });

  it('shows the page to signed-in users', () => {
    renderAt('/my-donations', { user: { name: 'Jane', role: 'user' } });

    expect(screen.getByText('My donations')).toBeInTheDocument();
  });

  it('blocks donors from admin pages', () => {
    renderAt('/admin', { user: { name: 'Jane', role: 'user' } });

    expect(screen.getByRole('heading', { name: /don't have access/i })).toBeInTheDocument();
    expect(screen.queryByText('Admin dashboard')).not.toBeInTheDocument();
  });

  it('lets admins into admin pages', () => {
    renderAt('/admin', { user: { name: 'Ada', role: 'admin' } });

    expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
  });
});
