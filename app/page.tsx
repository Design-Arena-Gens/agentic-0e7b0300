'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { Trophy, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, userRole, family } = useFamilyStore();

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'parent') {
        router.push('/parent/dashboard');
      } else {
        router.push('/child/dashboard');
      }
    }
  }, [isAuthenticated, userRole, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="bg-primary-500 rounded-3xl p-6 shadow-lg">
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            RewardSprint
            <Sparkles className="w-8 h-8 text-warning-500" />
          </h1>
          <p className="text-xl text-gray-600">
            Family Motivation & Rewards Engine
          </p>
        </div>

        <div className="space-y-4">
          {!family ? (
            <>
              <button
                onClick={() => router.push('/onboarding')}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                Start Free 30-Day Trial
              </button>
              <p className="text-sm text-gray-500">
                No credit card required • Full features unlocked
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/login/parent')}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all"
              >
                Parent Login
              </button>
              <button
                onClick={() => router.push('/login/child')}
                className="w-full bg-white hover:bg-gray-50 text-primary-600 font-semibold py-4 px-6 rounded-xl shadow-lg border-2 border-primary-500 transition-all"
              >
                Child Login
              </button>
            </>
          )}
        </div>

        <div className="pt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600">10min</div>
            <div className="text-xs text-gray-600 mt-1">Daily Tasks</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-success-600">+Points</div>
            <div className="text-xs text-gray-600 mt-1">Earn Rewards</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-warning-500">🎁</div>
            <div className="text-xs text-gray-600 mt-1">Redeem Fun</div>
          </div>
        </div>
      </div>
    </div>
  );
}
