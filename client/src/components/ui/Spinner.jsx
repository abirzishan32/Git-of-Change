import { LoaderCircle } from 'lucide-react';

export function Spinner({ label = 'Loading', className = '' }) {
  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-2 text-slate-500 ${className}`}
    >
      <LoaderCircle className="size-5 animate-spin text-brand-600" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function PageLoader() {
  return <Spinner className="min-h-[50vh]" />;
}
