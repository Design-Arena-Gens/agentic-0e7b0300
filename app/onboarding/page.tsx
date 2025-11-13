'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { Trophy, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const router = useRouter();
  const { createFamily, addChild } = useFamilyStore();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [children, setChildren] = useState<{ name: string; pin: string }[]>([]);
  const [currentChild, setCurrentChild] = useState({ name: '', pin: '' });

  const handleCreateFamily = () => {
    if (!email || !familyName) return;
    createFamily(familyName, email);
    setStep(2);
  };

  const handleAddChild = () => {
    if (!currentChild.name || currentChild.pin.length !== 4) return;
    setChildren([...children, currentChild]);
    setCurrentChild({ name: '', pin: '' });
  };

  const handleComplete = () => {
    children.forEach(child => {
      addChild(child.name, child.pin);
    });
    router.push('/parent/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-500 rounded-2xl p-4">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to RewardSprint!</h2>
              <p className="text-gray-600">Start your 30-day free trial</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="parent@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Name
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="The Smith Family"
                />
              </div>
            </div>

            <button
              onClick={handleCreateFamily}
              disabled={!email || !familyName}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-sm text-primary-900 font-medium">✨ Full features for 30 days</p>
              <p className="text-xs text-primary-700 mt-1">No credit card required</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Children</h2>
              <p className="text-gray-600">Create accounts for your kids</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={currentChild.name}
                  onChange={(e) => setCurrentChild({ ...currentChild, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4-Digit PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={currentChild.pin}
                  onChange={(e) => setCurrentChild({ ...currentChild, pin: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="••••"
                />
              </div>

              <button
                onClick={handleAddChild}
                disabled={!currentChild.name || currentChild.pin.length !== 4}
                className="w-full bg-success-500 hover:bg-success-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Add Child
              </button>
            </div>

            {children.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Added Children:</h3>
                {children.map((child, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                    <span className="font-medium">{child.name}</span>
                    <span className="text-gray-500">PIN: ••••</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleComplete}
              disabled={children.length === 0}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Complete Setup
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
