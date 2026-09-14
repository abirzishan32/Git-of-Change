import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage, getFieldErrors } from '../lib/errors';

function validate({ name, password }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (event) => setValues({ ...values, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      // On success GuestRoute redirects, so this page unmounts
      await register(values);
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start giving to the causes you care about.">
      <title>Sign up | Gift of Change</title>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <TextField
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          value={values.name}
          onChange={update('name')}
          error={fieldErrors.name}
          required
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={update('email')}
          error={fieldErrors.email}
          required
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          value={values.password}
          onChange={update('password')}
          error={fieldErrors.password}
          required
        />
        {error && <Alert variant="error">{error}</Alert>}
        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
