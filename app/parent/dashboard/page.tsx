'use client';

import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { Trophy, Users, ListTodo, Gift, LogOut, Calendar, CheckCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function ParentDashboard() {
  const router = useRouter();
  const { family, logout, getPendingRedemptions, approveRedemption, denyRedemption } = useFamilyStore();

  if (!family) {
    router.push('/');
    return null;
  }

  const pendingRedemptions = getPendingRedemptions();
  const trialDaysRemaining = 30 - differenceInDays(new Date(), new Date(family.trialStartDate));

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 rounded-xl p-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{family.name}</h1>
                <p className="text-sm text-gray-500">Parent Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Free Trial Active</h2>
              <p className="text-primary-100">Full features unlocked</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{trialDaysRemaining}</div>
              <div className="text-sm text-primary-100">days remaining</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-primary-500" />
              <h3 className="font-semibold text-gray-700">Children</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{family.children.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ListTodo className="w-6 h-6 text-success-500" />
              <h3 className="font-semibold text-gray-700">Tasks</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{family.tasks.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-6 h-6 text-warning-500" />
              <h3 className="font-semibold text-gray-700">Rewards</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{family.rewards.length}</p>
          </div>
        </div>

        {/* Children Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Children
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {family.children.map((child) => (
              <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{child.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-500">PIN: ••••</p>
                  </div>
                </div>
                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary-600">{child.points}</p>
                  <p className="text-xs text-primary-700">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Redemptions */}
        {pendingRedemptions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Pending Reward Requests
            </h2>
            <div className="space-y-3">
              {pendingRedemptions.map((redemption) => {
                const child = family.children.find(c => c.id === redemption.childId);
                const reward = family.rewards.find(r => r.id === redemption.rewardId);
                if (!child || !reward) return null;

                return (
                  <div key={redemption.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{child.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{child.name}</p>
                        <p className="text-sm text-gray-600">wants: {reward.icon} {reward.name}</p>
                        <p className="text-xs text-gray-500">{reward.pointsCost} points</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRedemption(redemption.id)}
                        className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => denyRedemption(redemption.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/parent/tasks')}
            className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-sm text-left transition-all"
          >
            <ListTodo className="w-8 h-8 text-success-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Tasks</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove tasks</p>
          </button>

          <button
            onClick={() => router.push('/parent/rewards')}
            className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-sm text-left transition-all"
          >
            <Gift className="w-8 h-8 text-warning-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Rewards</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove rewards</p>
          </button>
        </div>
      </div>
    </div>
  );
}
