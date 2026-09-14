const styles = {
  completed: 'bg-brand-50 text-brand-800 ring-brand-600/20',
  pending: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
};

const labels = { completed: 'Completed', pending: 'Pending', failed: 'Failed' };

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
