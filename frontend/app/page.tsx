'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { HydrationWrapper } from '@/components/HydrationWrapper';

function HomeContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Rehydrate the store manually to prevent hydration mismatch
    useAuthStore.persist.rehydrate();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!user) {
      router.push('/auth/login');
    } else {
      router.push('/dashboard');
    }
  }, [user, router, isInitialized]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <HydrationWrapper>
      <HomeContent />
    </HydrationWrapper>
  );
}
