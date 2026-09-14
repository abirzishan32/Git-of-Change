import { CircleCheck, HeartHandshake } from 'lucide-react';
import { Logo } from '../Logo';

const STEPS = [
  'Create a free account',
  'Pick a cause you care about',
  'Donate securely and track your impact',
];

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <main className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>

      <aside className="relative hidden overflow-hidden bg-linear-to-br from-brand-700 via-brand-800 to-brand-950 lg:block">
        <div
          className="absolute -top-24 -right-24 size-96 rounded-full bg-white/5"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -left-32 size-80 rounded-full bg-white/5"
          aria-hidden="true"
        />
        <div
          className="absolute right-16 bottom-1/3 size-40 rounded-full bg-brand-500/20 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <HeartHandshake className="size-7" aria-hidden="true" />
          </span>

          <div>
            <p className="max-w-md text-3xl leading-tight font-semibold">
              Every gift, however small, adds up to real change.
            </p>
            <ul className="mt-8 space-y-3">
              {STEPS.map((step) => (
                <li key={step} className="flex items-center gap-3 text-brand-50">
                  <CircleCheck className="size-5 text-brand-200" aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
