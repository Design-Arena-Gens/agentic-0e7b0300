'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function ParentLogin() {
  const router = useRouter();
  const { loginParent, family } = useFamilyStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (family && email === family.parentEmail) {
      loginParent(email);
      router.push('/parent/dashboard');
    } else {
      setError('Invalid email address');
    }
  };

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

        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Parent Login</h2>
        <p className="text-gray-600 mb-8 text-center">Welcome back!</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="parent@example.com"
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
