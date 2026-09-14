import { useState } from 'react';
import { authApi } from '../api/endpoints';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage, getFieldErrors } from '../lib/errors';

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <title>Account | Gift of Change</title>
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="mt-2 text-slate-600">Update your details and password.</p>
      <div className="mt-8 space-y-6">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}

function Card({ title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const isEmailChanged = email.trim().toLowerCase() !== user.email;

  async function handleSubmit(event) {
    event.preventDefault();
    setResult(null);
    setFieldErrors({});
    setIsSaving(true);

    try {
      const { user: updatedUser } = await authApi.updateMe({
        name,
        email,
        ...(isEmailChanged && { currentPassword }),
      });
      setUser(updatedUser);
      setCurrentPassword('');
      setResult({ variant: 'success', message: 'Your profile has been updated.' });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setResult({ variant: 'error', message: getErrorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card title="Profile" description="Your name appears on your donation receipts.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          required
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          required
        />
        {isEmailChanged && (
          <TextField
            label="Current password"
            type="password"
            autoComplete="current-password"
            hint="Confirm it's you before changing your email."
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            error={fieldErrors.currentPassword}
            required
          />
        )}
        {result && <Alert variant={result.variant}>{result.message}</Alert>}
        <Button type="submit" isLoading={isSaving}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const update = (field) => (event) => setValues({ ...values, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setResult(null);

    if (values.newPassword.length < 8) {
      setFieldErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setFieldErrors({ confirmPassword: "The passwords don't match" });
      return;
    }

    setFieldErrors({});
    setIsSaving(true);
    try {
      await authApi.updateMe({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setResult({ variant: 'success', message: 'Your password has been changed.' });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setResult({ variant: 'error', message: getErrorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card title="Password" description="Use at least 8 characters.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          label="Current password"
          type="password"
          autoComplete="current-password"
          value={values.currentPassword}
          onChange={update('currentPassword')}
          error={fieldErrors.currentPassword}
          required
        />
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={update('newPassword')}
          error={fieldErrors.newPassword}
          required
        />
        <TextField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={update('confirmPassword')}
          error={fieldErrors.confirmPassword}
          required
        />
        {result && <Alert variant={result.variant}>{result.message}</Alert>}
        <Button type="submit" isLoading={isSaving}>
          Change password
        </Button>
      </form>
    </Card>
  );
}
