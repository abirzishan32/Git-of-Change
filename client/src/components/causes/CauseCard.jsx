import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { CAUSES } from '../../constants/causes';
import { formatCents } from '../../lib/format';
import { buttonClasses } from '../ui/button-styles';
import { CauseArt } from './CauseArt';

export function CauseCard({ cause, raisedCents }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md">
      <CauseArt cause={cause} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{cause.title}</h3>
        <p className="mt-1.5 flex-1 text-sm text-slate-600">{cause.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {raisedCents !== undefined && (
              <>
                <span className="font-semibold text-slate-900">{formatCents(raisedCents)}</span>{' '}
                raised
              </>
            )}
          </p>
          <Link
            to={`/donate/${cause.slug}`}
            className={buttonClasses({ size: 'sm' })}
            aria-label={`Donate to ${cause.title}`}
          >
            Donate
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** All causes, with the amount raised for each once stats have loaded. */
export function CauseGrid({ stats }) {
  const raisedByCause = new Map(
    (stats?.byCategory ?? []).map((entry) => [entry.category, entry.totalRaised]),
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CAUSES.map((cause) => (
        <CauseCard
          key={cause.slug}
          cause={cause}
          raisedCents={stats ? (raisedByCause.get(cause.slug) ?? 0) : undefined}
        />
      ))}
    </div>
  );
}
