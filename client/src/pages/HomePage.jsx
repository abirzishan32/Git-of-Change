import { ArrowRight, HandCoins, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { CauseGrid } from '../components/causes/CauseCard';
import { ImpactCard } from '../components/home/ImpactCard';
import { buttonClasses } from '../components/ui/button-styles';
import { useApiQuery } from '../hooks/useApiQuery';
import { useAuth } from '../hooks/useAuth';

const STEPS = [
  {
    icon: UserRound,
    title: 'Create your account',
    text: 'Sign up in under a minute. All you need is a name, an email and a password.',
  },
  {
    icon: HandCoins,
    title: 'Pick a cause and amount',
    text: 'Choose from five causes and give any amount from $1, with quick picks for common gifts.',
  },
  {
    icon: ShieldCheck,
    title: 'Pay securely, track everything',
    text: 'Stripe handles the payment. Your donation history and totals stay in your dashboard.',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useApiQuery('/api/donations/stats');

  return (
    <>
      <title>Gift of Change | Donate to causes that matter</title>

      <section className="bg-linear-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-brand-800 ring-1 ring-brand-200">
              <Sparkles className="size-4" aria-hidden="true" />
              Five causes, one simple checkout
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Small gifts, <span className="text-brand-700">real change.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Support education, healthcare, hunger relief, disaster response and animal welfare.
              Pay securely with Stripe and follow every donation from your own dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate" className={buttonClasses({ size: 'lg' })}>
                Choose a cause
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {user ? (
                <Link
                  to="/my-donations"
                  className={buttonClasses({ variant: 'secondary', size: 'lg' })}
                >
                  View my donations
                </Link>
              ) : (
                <Link
                  to="/register"
                  className={buttonClasses({ variant: 'secondary', size: 'lg' })}
                >
                  Create an account
                </Link>
              )}
            </div>
          </div>

          <ImpactCard stats={stats} isLoading={isLoading} />
        </div>
      </section>

      <section id="causes" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">Where your gift goes</h2>
          <p className="mt-3 text-slate-600">
            Pick the cause that matters most to you. Totals update as donations come in.
          </p>
        </div>
        <div className="mt-10">
          <CauseGrid stats={stats} />
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand-700 text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-brand-700">Step {index + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-brand-800 px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Ready to make a difference?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            It only takes a couple of minutes to support a cause you believe in.
          </p>
          <Link
            to="/donate"
            className={buttonClasses({ variant: 'light', size: 'lg', className: 'mt-8' })}
          >
            Donate now
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
