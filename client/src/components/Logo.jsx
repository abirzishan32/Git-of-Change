import { HeartHandshake } from 'lucide-react';
import { Link } from 'react-router';

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-700 text-white">
        <HeartHandshake className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Gift of <span className="text-brand-700">Change</span>
      </span>
    </Link>
  );
}
