import { getCause, getCauseTitle } from '../../constants/causes';
import { formatCents, formatDate } from '../../lib/format';
import { CauseIcon } from '../causes/CauseArt';
import { StatusBadge } from '../ui/StatusBadge';

const headerCell =
  'px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase sm:px-6';
const cell = 'whitespace-nowrap px-4 py-3.5 sm:px-6';

export function DonationTable({ donations, showDonor = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className={headerCell}>
              Date
            </th>
            {showDonor && (
              <th scope="col" className={headerCell}>
                Donor
              </th>
            )}
            <th scope="col" className={headerCell}>
              Cause
            </th>
            <th scope="col" className={`${headerCell} text-right`}>
              Amount
            </th>
            <th scope="col" className={headerCell}>
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {donations.map((donation) => (
            <tr key={donation._id} className="hover:bg-slate-50/60">
              <td className={`${cell} text-slate-600`}>{formatDate(donation.createdAt)}</td>
              {showDonor && (
                <td className={cell}>
                  {donation.user ? (
                    <>
                      <p className="font-medium text-slate-900">{donation.user.name}</p>
                      <p className="text-slate-500">{donation.user.email}</p>
                    </>
                  ) : (
                    <span className="text-slate-400 italic">Deleted user</span>
                  )}
                </td>
              )}
              <td className={`${cell} text-slate-800`}>
                <span className="flex items-center gap-3">
                  {getCause(donation.category) && (
                    <CauseIcon cause={getCause(donation.category)} className="size-7" />
                  )}
                  {getCauseTitle(donation.category)}
                </span>
              </td>
              <td className={`${cell} text-right font-medium text-slate-900 tabular-nums`}>
                {formatCents(donation.amount)}
              </td>
              <td className={cell}>
                <StatusBadge status={donation.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
