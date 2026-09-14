import { Link } from 'react-router';
import { Logo } from '../Logo';

const REPOSITORY_URL = 'https://github.com/abirzishan32/donation-website';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            A donation platform for supporting the causes you care about and keeping track of every
            gift you make.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/donate" className="text-slate-600 hover:text-brand-700">
                Causes
              </Link>
            </li>
            <li>
              <Link to="/my-donations" className="text-slate-600 hover:text-brand-700">
                My donations
              </Link>
            </li>
            <li>
              <Link to="/account" className="text-slate-600 hover:text-brand-700">
                Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Project</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={REPOSITORY_URL} className="text-slate-600 hover:text-brand-700">
                Source code
              </a>
            </li>
            <li>
              <a
                href="https://docs.stripe.com/testing"
                className="text-slate-600 hover:text-brand-700"
              >
                Stripe test cards
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} Gift of Change. A portfolio project: payments run in Stripe
          test mode and no real money is charged.
        </p>
      </div>
    </footer>
  );
}
