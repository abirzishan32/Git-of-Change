import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { formatCents } from '../../lib/format';
import { Button } from '../ui/Button';
import { buttonClasses } from '../ui/button-styles';

export function DonationSuccess({ cause, amount, status, onDonateAgain }) {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];

  return (
    <div className="py-6 text-center" role="status">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Check className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold">Thank you{firstName ? `, ${firstName}` : ''}!</h2>
      <p className="mt-2 text-slate-600">
        Your gift of <strong className="text-slate-900">{formatCents(amount)}</strong> to{' '}
        {cause.title}{' '}
        {status === 'processing'
          ? 'is being processed. It will show as completed once your bank confirms it.'
          : 'was received.'}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/my-donations" className={buttonClasses()}>
          View my donations
        </Link>
        <Button variant="secondary" onClick={onDonateAgain}>
          Make another donation
        </Button>
      </div>
    </div>
  );
}
