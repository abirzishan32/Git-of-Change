/** Where to send someone who just signed in and wasn't on their way somewhere else. */
export function getDefaultPathFor(user) {
  return user.role === 'admin' ? '/admin' : '/donate';
}
