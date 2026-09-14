import { CircleAlert, CircleCheck, Info } from 'lucide-react';

const styles = {
  error: { container: 'border-red-200 bg-red-50 text-red-800', Icon: CircleAlert },
  success: { container: 'border-brand-200 bg-brand-50 text-brand-900', Icon: CircleCheck },
  info: { container: 'border-sky-200 bg-sky-50 text-sky-900', Icon: Info },
};

export function Alert({ variant = 'info', title, children, className = '' }) {
  const { container, Icon } = styles[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${container} ${className}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
      </div>
    </div>
  );
}
