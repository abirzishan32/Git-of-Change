import { Link } from 'react-router';
import { buttonClasses } from '../components/ui/button-styles';

export function StatusPage({ code, title, description }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <title>{`${title} | Gift of Change`}</title>
      <p className="text-sm font-semibold text-brand-700">{code}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
      <Link to="/" className={buttonClasses({ className: 'mt-8' })}>
        Back to home
      </Link>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
    />
  );
}
