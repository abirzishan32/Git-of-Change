import { HandCoins, ShieldCheck } from 'lucide-react';
import { CAUSES } from '../../constants/causes';
import { formatCents, formatNumber } from '../../lib/format';
import { CauseIcon } from '../causes/CauseArt';

const TOP_CAUSE_COUNT = 3;

/** Live totals from the API, shown in the home page hero. */
export function ImpactCard({ stats, isLoading }) {
  const raisedByCause = new Map(
    (stats?.byCategory ?? []).map((entry) => [entry.category, entry.totalRaised]),
  );
  const topCauses = CAUSES.map((cause) => ({ cause, raised: raisedByCause.get(cause.slug) ?? 0 }))
    .sort((a, b) => b.raised - a.raised)
    .slice(0, TOP_CAUSE_COUNT);
  const largest = Math.max(1, topCauses[0].raised);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="absolute -inset-4 rounded-[2.5rem] bg-linear-to-br from-brand-200/70 via-sky-100/60 to-amber-100/70 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8 sm:pb-14">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Raised on Gift of Change</p>
            {isLoading ? (
              <div className="mt-2 h-10 w-40 animate-pulse rounded bg-slate-100" />
            ) : (
              <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-900">
                {stats ? formatCents(stats.totalRaised) : '–'}
              </p>
            )}
          </div>
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-700 text-white">
            <HandCoins className="size-6" aria-hidden="true" />
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
          <div>
            <dt className="text-xs text-slate-500">Donations</dt>
            <dd className="mt-0.5 text-lg font-semibold text-slate-900">
              {stats ? formatNumber(stats.donationCount) : '–'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Donors</dt>
            <dd className="mt-0.5 text-lg font-semibold text-slate-900">
              {stats ? formatNumber(stats.donorCount) : '–'}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Top causes
        </p>
        <ul className="mt-3 space-y-4">
          {topCauses.map(({ cause, raised }) => (
            <li key={cause.slug} className="flex items-center gap-3">
              <CauseIcon cause={cause} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-slate-800">{cause.title}</span>
                  <span className="text-slate-600 tabular-nums">{formatCents(raised)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${cause.theme.bar}`}
                    style={{ width: `${(raised / largest) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200 sm:flex">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Payments by Stripe</p>
          <p className="text-xs text-slate-500">Card details never reach our servers</p>
        </div>
      </div>
    </div>
  );
}
