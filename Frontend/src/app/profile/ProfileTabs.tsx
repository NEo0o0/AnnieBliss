'use client';

import { useMemo, useState } from 'react';

type TabKey = 'bookings' | 'packages' | 'bundles';

export function ProfileTabs({
  bookings,
  packages,
  bundles,
}: {
  bookings: React.ReactNode;
  packages: React.ReactNode;
  bundles: React.ReactNode;
}) {
  const [active, setActive] = useState<TabKey>('bookings');

  const content = useMemo(() => {
    if (active === 'packages') return packages;
    if (active === 'bundles') return bundles;
    return bookings;
  }, [active, bookings, packages, bundles]);

  return (
    <div>
      <div className="flex gap-3 border-b border-[var(--color-sand)] mb-6">
        <button
          onClick={() => setActive('bookings')}
          className={`pb-3 px-2 transition-all duration-300 ${
            active === 'bookings'
              ? 'border-b-2 border-[var(--color-sage)] text-[var(--color-sage)]'
              : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setActive('packages')}
          className={`pb-3 px-2 transition-all duration-300 ${
            active === 'packages'
              ? 'border-b-2 border-[var(--color-sage)] text-[var(--color-sage)]'
              : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
          }`}
        >
          My Packages
        </button>
        <button
          onClick={() => setActive('bundles')}
          className={`pb-3 px-2 transition-all duration-300 ${
            active === 'bundles'
              ? 'border-b-2 border-[var(--color-sage)] text-[var(--color-sage)]'
              : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
          }`}
        >
          Buy Bundles
        </button>
      </div>

      {content}
    </div>
  );
}
