import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../Logo';
import { buttonClasses } from '../ui/button-styles';

function navLinkClasses({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openedAt, setOpenedAt] = useState(null);

  // The mobile menu closes itself whenever the route changes
  const isMenuOpen = openedAt === location.key;

  const links = [
    { to: '/donate', label: 'Causes' },
    ...(user ? [{ to: '/my-donations', label: 'My donations' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <NavLink to="/account" className={navLinkClasses}>
                {user.name}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className={buttonClasses({ variant: 'ghost', size: 'sm' })}
              >
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={buttonClasses({ variant: 'ghost', size: 'sm' })}>
                Log in
              </Link>
              <Link to="/register" className={buttonClasses({ size: 'sm' })}>
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpenedAt(isMenuOpen ? null : location.key)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                {link.label}
              </NavLink>
            ))}
            {user && (
              <NavLink to="/account" className={navLinkClasses}>
                Account
              </NavLink>
            )}
          </nav>
          <div className="mt-3 flex gap-2 border-t border-slate-200 pt-3">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className={buttonClasses({ variant: 'secondary', className: 'w-full' })}
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={buttonClasses({ variant: 'secondary', className: 'flex-1' })}
                >
                  Log in
                </Link>
                <Link to="/register" className={buttonClasses({ className: 'flex-1' })}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
