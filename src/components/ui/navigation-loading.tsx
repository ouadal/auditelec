'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingSpinner } from './loading-spinner';

export function NavigationLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    
    // Simuler un délai de chargement pour montrer l'animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <LoadingSpinner size="lg" text="Navigation en cours..." />
      </div>
    </div>
  );
}