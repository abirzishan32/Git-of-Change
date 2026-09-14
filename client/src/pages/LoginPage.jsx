import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/errors';

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // On success GuestRoute redirects, so this page unmounts
      await login({ email, password });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to donate and see your giving history.">
      <title>Log in | Gift of Change</title>
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        New to Gift of Change?{' '}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
