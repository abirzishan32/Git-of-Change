import { ChevronLeft, Lock, Receipt, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { CauseArt } from '../components/causes/CauseArt';
import { DonationCheckout } from '../components/donate/DonationCheckout';
import { DonationSuccess } from '../components/donate/DonationSuccess';
import { Alert } from '../components/ui/Alert';
import { getCause } from '../constants/causes';
import { isStripeConfigured } from '../lib/stripe';
import { NotFoundPage } from './StatusPage';

const ASSURANCES = [
  {
    icon: ShieldCheck,
    text: 'Card details go straight to Stripe and never touch our servers.',
  },
  {
    icon: Lock,
    text: 'The amount is confirmed with Stripe before a donation is recorded.',
  },
  {
    icon: Receipt,
    text: 'Every gift shows up in My donations as soon as the payment clears.',
  },
];

export default function DonatePage() {
  const { causeSlug } = useParams();
  const cause = getCause(causeSlug);
  const [completedPayment, setCompletedPayment] = useState(null);

  if (!cause) {
    return <NotFoundPage />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <title>{`Donate to ${cause.title} | Gift of Change`}</title>

      <Link
        to="/donate"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-700"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        All causes
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_27rem] lg:items-start">
        <section>
          <CauseArt cause={cause} iconSize="lg" className="aspect-[2/1] rounded-2xl shadow-sm" />
          <p className="mt-8 text-sm font-semibold text-brand-700">You're supporting</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{cause.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{cause.description}</p>

          <ul className="mt-8 space-y-4">
            {ASSURANCES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3 text-sm text-slate-700">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="pt-1.5">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-label="Donation form"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"
        >
          {completedPayment ? (
            <DonationSuccess
              cause={cause}
              amount={completedPayment.amount}
              status={completedPayment.status}
              onDonateAgain={() => setCompletedPayment(null)}
            />
          ) : isStripeConfigured ? (
            <DonationCheckout cause={cause} onSuccess={setCompletedPayment} />
          ) : (
            <Alert variant="info" title="Payments aren't set up">
              Add <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to <code>client/.env</code> to enable
              donations.
            </Alert>
          )}
        </section>
      </div>
    </div>
  );
}
