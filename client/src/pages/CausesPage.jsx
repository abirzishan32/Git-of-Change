import { CauseGrid } from '../components/causes/CauseCard';
import { useApiQuery } from '../hooks/useApiQuery';

export default function CausesPage() {
  const { data: stats } = useApiQuery('/api/donations/stats');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <title>Choose a cause | Gift of Change</title>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose a cause</h1>
        <p className="mt-3 text-lg text-slate-600">
          Every donation goes to the cause you pick. Choose one to continue to checkout.
        </p>
      </div>
      <div className="mt-10">
        <CauseGrid stats={stats} />
      </div>
    </div>
  );
}
