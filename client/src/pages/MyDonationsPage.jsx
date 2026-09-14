import { HandCoins, HeartHandshake, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { donationsApi } from '../api/endpoints';
import { DonationTable } from '../components/donations/DonationTable';
import { Alert } from '../components/ui/Alert';
import { buttonClasses } from '../components/ui/button-styles';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { StatCard } from '../components/ui/StatCard';
import { useApiQuery } from '../hooks/useApiQuery';
import { useAuth } from '../hooks/useAuth';
import { formatCents, formatNumber } from '../lib/format';

const RETURN_NOTICES = {
  succeeded: { variant: 'success', text: 'Thank you! Your donation was received.' },
  processing: {
    variant: 'info',
    text: 'Your donation is being processed and will be marked completed once it clears.',
  },
  failed: {
    variant: 'error',
    text: "Your payment didn't go through, so you haven't been charged.",
  },
};

export default function MyDonationsPage() {
  const { user } = useAuth();
  const { data, error, isLoading, refetch } = useApiQuery('/api/donations/me');
  const [searchParams, setSearchParams] = useSearchParams();
  const [returnNotice, setReturnNotice] = useState(null);

  // Stripe sends donors back here after payment methods that need a redirect
  const returnedPaymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    if (!returnedPaymentIntent) return;

    setSearchParams({}, { replace: true });
    donationsApi
      .syncPaymentIntent(returnedPaymentIntent)
      .then(({ paymentStatus }) =>
        setReturnNotice(RETURN_NOTICES[paymentStatus] ?? RETURN_NOTICES.failed),
      )
      .catch(() => setReturnNotice(RETURN_NOTICES.failed))
      .finally(refetch);
  }, [returnedPaymentIntent, setSearchParams, refetch]);

  const donations = data?.donations ?? [];
  const completed = donations.filter((donation) => donation.status === 'completed');
  const totalGiven = completed.reduce((sum, donation) => sum + donation.amount, 0);
  const causesSupported = new Set(completed.map((donation) => donation.category)).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <title>My donations | Gift of Change</title>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My donations</h1>
          <p className="mt-2 text-slate-600">
            Thanks for giving, {user.name.split(' ')[0]}. Here's everything you've donated so far.
          </p>
        </div>
        <Link to="/donate" className={buttonClasses()}>
          Make a donation
        </Link>
      </div>

      {returnNotice && (
        <Alert variant={returnNotice.variant} className="mt-6">
          {returnNotice.text}
        </Alert>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total given"
          icon={HandCoins}
          isLoading={isLoading && !data}
          value={formatCents(totalGiven)}
        />
        <StatCard
          label="Completed donations"
          icon={HeartHandshake}
          isLoading={isLoading && !data}
          value={formatNumber(completed.length)}
        />
        <StatCard
          label="Causes supported"
          icon={LayoutGrid}
          isLoading={isLoading && !data}
          value={formatNumber(causesSupported)}
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <h2 className="border-b border-slate-200 px-4 py-4 text-base font-semibold sm:px-6">
          Donation history
        </h2>
        {error ? (
          <div className="p-6">
            <Alert variant="error">{error}</Alert>
          </div>
        ) : isLoading && !data ? (
          <Spinner className="py-14" label="Loading your donations" />
        ) : donations.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No donations yet"
            description="When you donate, your gifts and their status will show up here."
            action={
              <Link to="/donate" className={buttonClasses()}>
                Make your first donation
              </Link>
            }
          />
        ) : (
          <DonationTable donations={donations} />
        )}
      </section>
    </div>
  );
}
