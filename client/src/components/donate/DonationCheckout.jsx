import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { donationsApi } from '../../api/endpoints';
import { MIN_DONATION_CENTS, parseDonationAmount } from '../../lib/donation-amount';
import { getErrorMessage } from '../../lib/errors';
import { formatCents } from '../../lib/format';
import { isStripeTestMode, stripePromise } from '../../lib/stripe';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { AmountPicker } from './AmountPicker';

const DEFAULT_AMOUNT_CENTS = 2500;

const appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#047857',
    colorText: '#0f172a',
    fontFamily: 'Poppins, ui-sans-serif, system-ui, sans-serif',
    borderRadius: '8px',
  },
};
const fonts = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap' },
];

/**
 * Amount selection plus Stripe's Payment Element. Uses Stripe's "deferred
 * intent" flow: the PaymentIntent is only created on the server when the
 * donor presses Donate, with the amount validated there.
 */
export function DonationCheckout({ cause, onSuccess }) {
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_AMOUNT_CENTS);
  const [customAmount, setCustomAmount] = useState('');

  const custom = selectedPreset === null ? parseDonationAmount(customAmount) : null;
  const amount = custom ? custom.cents : selectedPreset;
  // Only complain about the custom amount once the donor has typed something
  const amountError = customAmount ? custom?.error : undefined;
  // Elements needs a valid amount even while the custom field is half-typed
  const elementsAmount = amount ?? MIN_DONATION_CENTS;

  const options = useMemo(
    () => ({ mode: 'payment', currency: 'usd', amount: elementsAmount, appearance, fonts }),
    [elementsAmount],
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        cause={cause}
        amount={amount}
        amountError={amountError}
        amountPicker={
          <AmountPicker
            selectedPreset={selectedPreset}
            customAmount={customAmount}
            error={amountError}
            onPresetChange={(cents) => {
              setSelectedPreset(cents);
              setCustomAmount('');
            }}
            onCustomChange={(value) => {
              setSelectedPreset(null);
              setCustomAmount(value);
            }}
          />
        }
        onSuccess={onSuccess}
      />
    </Elements>
  );
}

function PaymentForm({ cause, amount, amountError, amountPicker, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!amount) {
      setError(amountError ?? 'Choose an amount to donate');
      return;
    }
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    try {
      // Validate the card details before asking the server for a PaymentIntent
      const { error: detailsError } = await elements.submit();
      if (detailsError) {
        setError(detailsError.message);
        return;
      }

      const { clientSecret } = await donationsApi.createPaymentIntent({
        amount,
        category: cause.slug,
      });

      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/my-donations` },
        redirect: 'if_required',
      });

      if (paymentError) {
        setError(paymentError.message);
        return;
      }

      try {
        await donationsApi.syncPaymentIntent(paymentIntent.id);
      } catch {
        // The payment went through; the Stripe webhook will record the donation.
      }

      onSuccess({ amount: paymentIntent.amount, status: paymentIntent.status });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {amountPicker}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-800">Payment details</p>
        <PaymentElement
          onReady={() => setIsPaymentElementReady(true)}
          onLoadError={({ error: loadError }) =>
            setError(loadError?.message ?? "The payment form couldn't be loaded.")
          }
          options={{ layout: 'tabs' }}
        />
        {isStripeTestMode && (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Test mode: use card <span className="font-mono">4242 4242 4242 4242</span>, any future
            expiry date and any CVC.
          </p>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        disabled={!stripe || !isPaymentElementReady}
      >
        {!isSubmitting && <Lock className="size-4" aria-hidden="true" />}
        {amount ? `Donate ${formatCents(amount)}` : 'Donate'}
      </Button>
    </form>
  );
}
