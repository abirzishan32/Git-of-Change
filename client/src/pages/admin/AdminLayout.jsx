import { LayoutDashboard, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

const TABS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-sm font-semibold text-brand-700">Admin</p>
      <nav aria-label="Admin" className="mt-4 flex gap-6 border-b border-slate-200">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `-mb-px inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-brand-700 text-brand-800'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`
            }
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
