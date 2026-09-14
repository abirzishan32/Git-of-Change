const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const numberFormatter = new Intl.NumberFormat('en-US');
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

/** Amounts travel through the app in cents, the way Stripe and the API store them. */
export function formatCents(cents) {
  return currencyFormatter.format(cents / 100);
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}
