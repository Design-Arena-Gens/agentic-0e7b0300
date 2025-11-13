'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function ChildLogin() {
  const router = useRouter();
  const { loginChild, family } = useFamilyStore();
  const [selectedChildId, setSelectedChildId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginChild(selectedChildId, pin)) {
      router.push('/child/dashboard');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  if (!family || family.children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">No children added yet. Please ask your parent to add you first.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-primary-500 hover:text-primary-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-primary-500 rounded-2xl p-4">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Child Login</h2>
        <p className="text-gray-600 mb-8 text-center">Who are you?</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Name
            </label>
            <div className="grid grid-cols-2 gap-3">
              {family.children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => {
                    setSelectedChildId(child.id);
                    setError('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedChildId === child.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{child.avatar}</div>
                  <div className="font-semibold text-gray-900">{child.name}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedChildId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-3xl tracking-widest"
                placeholder="••••"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedChildId || pin.length !== 4}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
