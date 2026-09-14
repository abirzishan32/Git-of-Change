const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

/** Turns an axios (or any) error into a message that can be shown to the user. */
export function getErrorMessage(error, fallback = FALLBACK_MESSAGE) {
  const serverMessage = error?.response?.data?.message;
  if (typeof serverMessage === 'string' && serverMessage) return serverMessage;

  if (error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.';
  }
  if (error?.isAxiosError && !error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }

  return fallback;
}

/** Field-level messages returned by the API's validation layer, keyed by field name. */
export function getFieldErrors(error) {
  const details = error?.response?.data?.details ?? [];
  return Object.fromEntries(details.map(({ field, message }) => [field, message]));
}
