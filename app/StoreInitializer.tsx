'use client';

import { useEffect } from 'react';
import { useFamilyStore } from '@/store/familyStore';

export default function StoreInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persistedState = localStorage.getItem('rewardsprint-storage');
      if (persistedState) {
        try {
          const parsed = JSON.parse(persistedState);
          useFamilyStore.setState(parsed);
        } catch (e) {
          console.error('Failed to hydrate store:', e);
        }
      }

      // Subscribe to changes and persist
      const unsubscribe = useFamilyStore.subscribe((state) => {
        try {
          localStorage.setItem('rewardsprint-storage', JSON.stringify(state));
        } catch (e) {
          console.error('Failed to persist store:', e);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return null;
}
