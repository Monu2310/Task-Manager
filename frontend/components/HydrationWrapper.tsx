'use client';

import { useEffect, useState } from 'react';

interface HydrationWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component to handle hydration mismatches
 * Prevents rendering until client-side hydration is complete
 */
export function HydrationWrapper({ children, fallback }: HydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
