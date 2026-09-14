import { GraduationCap, HeartPulse, LifeBuoy, PawPrint, Soup } from 'lucide-react';

// `slug` is what the API stores. Keep in sync with server/src/constants/donations.js
export const CAUSES = [
  {
    slug: 'education',
    title: 'Education',
    description:
      'Scholarships, books and school supplies for children who would otherwise go without.',
    icon: GraduationCap,
    theme: {
      gradient: 'from-sky-400 to-indigo-600',
      accent: 'text-indigo-600',
      bar: 'bg-indigo-500',
    },
  },
  {
    slug: 'health',
    title: 'Health & Medicine',
    description: 'Medical aid, vaccinations and mental health support where care is hard to reach.',
    icon: HeartPulse,
    theme: { gradient: 'from-rose-400 to-pink-600', accent: 'text-rose-600', bar: 'bg-rose-500' },
  },
  {
    slug: 'poverty',
    title: 'Poverty & Hunger',
    description: 'Food, shelter and clean water for families going through hard times.',
    icon: Soup,
    theme: {
      gradient: 'from-amber-300 to-orange-500',
      accent: 'text-orange-600',
      bar: 'bg-orange-500',
    },
  },
  {
    slug: 'disaster-relief',
    title: 'Disaster Relief',
    description: 'Emergency aid for communities hit by floods, earthquakes and conflict.',
    icon: LifeBuoy,
    theme: { gradient: 'from-teal-300 to-cyan-600', accent: 'text-cyan-700', bar: 'bg-cyan-500' },
  },
  {
    slug: 'animal-welfare',
    title: 'Animal Welfare',
    description: 'Rescue shelters, veterinary care and protection for wildlife at risk.',
    icon: PawPrint,
    theme: {
      gradient: 'from-lime-400 to-emerald-600',
      accent: 'text-emerald-700',
      bar: 'bg-emerald-500',
    },
  },
];

const causesBySlug = new Map(CAUSES.map((cause) => [cause.slug, cause]));

export function getCause(slug) {
  return causesBySlug.get(slug);
}

export function getCauseTitle(slug) {
  return causesBySlug.get(slug)?.title ?? slug;
}
