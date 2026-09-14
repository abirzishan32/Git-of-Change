import { HandCoins, HeartHandshake, Receipt, Users } from 'lucide-react';
import { useState } from 'react';
import { CauseIcon } from '../../components/causes/CauseArt';
import { DonationTable } from '../../components/donations/DonationTable';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { Spinner } from '../../components/ui/Spinner';
import { StatCard } from '../../components/ui/StatCard';
import { CAUSES } from '../../constants/causes';
import { useApiQuery } from '../../hooks/useApiQuery';
import { formatCents, formatNumber } from '../../lib/format';

const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { value: '', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

export default function AdminDashboardPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const stats = useApiQuery('/api/donations/stats');
  const donations = useApiQuery('/api/donations', {
    params: { page, limit: PAGE_SIZE, ...(status && { status }) },
  });

  const totals = stats.data;
  const averageGift = totals?.donationCount ? totals.totalRaised / totals.donationCount : 0;

  return (
    <>
      <title>Admin overview | Gift of Change</title>
      <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-2 text-slate-600">Totals include completed donations only.</p>

      {stats.error && (
        <Alert variant="error" className="mt-6">
          {stats.error}
        </Alert>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total raised"
          icon={HandCoins}
          isLoading={stats.isLoading}
          value={formatCents(totals?.totalRaised ?? 0)}
        />
        <StatCard
          label="Donations"
          icon={HeartHandshake}
          isLoading={stats.isLoading}
          value={formatNumber(totals?.donationCount ?? 0)}
        />
        <StatCard
          label="Donors"
          icon={Users}
          isLoading={stats.isLoading}
          value={formatNumber(totals?.donorCount ?? 0)}
        />
        <StatCard
          label="Average gift"
          icon={Receipt}
          isLoading={stats.isLoading}
          value={formatCents(Math.round(averageGift))}
        />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-semibold">Raised by cause</h2>
        <RaisedByCause byCategory={totals?.byCategory} isLoading={stats.isLoading} />
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <h2 className="text-base font-semibold">Donations</h2>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white py-1.5 pr-8 pl-3 text-sm text-slate-800 focus:border-brand-600 focus:ring-3 focus:ring-brand-100 focus:outline-none"
            >
              {STATUS_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {donations.error ? (
          <div className="p-6">
            <Alert variant="error">{donations.error}</Alert>
          </div>
        ) : !donations.data ? (
          <Spinner className="py-14" label="Loading donations" />
        ) : donations.data.donations.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No donations found"
            description={status ? 'Try a different status filter.' : 'Donations will appear here.'}
          />
        ) : (
          <div className={donations.isLoading ? 'opacity-60 transition-opacity' : ''}>
            <DonationTable donations={donations.data.donations} showDonor />
            <Pagination
              pagination={donations.data.pagination}
              onPageChange={setPage}
              itemLabel="donations"
            />
          </div>
        )}
      </section>
    </>
  );
}

function RaisedByCause({ byCategory, isLoading }) {
  if (isLoading) {
    return <Spinner className="py-8" />;
  }

  const totalsByCause = new Map((byCategory ?? []).map((entry) => [entry.category, entry]));
  const largest = Math.max(1, ...(byCategory ?? []).map((entry) => entry.totalRaised));

  return (
    <ul className="mt-5 space-y-4">
      {CAUSES.map((cause) => {
        const entry = totalsByCause.get(cause.slug);
        const raised = entry?.totalRaised ?? 0;

        return (
          <li key={cause.slug} className="flex items-center gap-4">
            <CauseIcon cause={cause} className="size-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-slate-800">{cause.title}</span>
                <span className="text-slate-500 tabular-nums">
                  <span className="font-semibold text-slate-900">{formatCents(raised)}</span> ·{' '}
                  {formatNumber(entry?.donationCount ?? 0)} donations
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${cause.theme.bar}`}
                  style={{ width: `${(raised / largest) * 100}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
