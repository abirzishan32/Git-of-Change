export function StatCard({ label, value, icon: Icon, isLoading = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-100" aria-hidden="true" />
      ) : (
        <p className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{value}</p>
      )}
    </div>
  );
}
