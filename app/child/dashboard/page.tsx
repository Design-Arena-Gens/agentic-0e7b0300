'use client';

import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { Trophy, LogOut, Star, Gift, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ChildDashboard() {
  const router = useRouter();
  const { family, currentUserId, logout, completeTask, requestRedemption, getChild, getChildCompletedTasks } = useFamilyStore();

  if (!family || !currentUserId) {
    router.push('/');
    return null;
  }

  const child = getChild(currentUserId);
  if (!child) {
    router.push('/');
    return null;
  }

  const completedTasks = getChildCompletedTasks(currentUserId);
  const todayTasks = completedTasks.filter(ct =>
    format(new Date(ct.completedAt), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(currentUserId, taskId);
  };

  const handleRequestReward = (rewardId: string) => {
    const reward = family.rewards.find(r => r.id === rewardId);
    if (reward && child.points >= reward.pointsCost) {
      requestRedemption(currentUserId, rewardId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{child.avatar}</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hi, {child.name}! 👋</h1>
                <p className="text-sm text-gray-500">Let's earn some points!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Points Display */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 mb-8 text-white text-center shadow-lg">
          <div className="flex justify-center mb-3">
            <Trophy className="w-16 h-16" />
          </div>
          <div className="text-6xl font-bold mb-2">{child.points}</div>
          <div className="text-xl text-primary-100">Total Points</div>
          {todayTasks.length > 0 && (
            <div className="mt-4 bg-white/20 rounded-lg py-2 px-4 inline-block">
              <p className="text-sm">✨ {todayTasks.length} tasks completed today!</p>
            </div>
          )}
        </div>

        {/* Available Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success-500" />
            Available Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {family.tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{task.icon}</div>
                  <div className="flex items-center gap-1 bg-warning-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-warning-500 fill-current" />
                    <span className="font-bold text-warning-600">+{task.points}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{task.duration} minutes</span>
                </div>
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="w-full bg-success-500 hover:bg-success-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Mark as Complete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6 text-warning-500" />
            Rewards Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {family.rewards.map((reward) => {
              const canAfford = child.points >= reward.pointsCost;
              return (
                <div key={reward.id} className={`bg-white rounded-xl p-6 shadow-sm ${canAfford ? 'ring-2 ring-warning-500' : 'opacity-75'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{reward.icon}</div>
                    <div className="flex items-center gap-1 bg-warning-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-warning-500 fill-current" />
                      <span className="font-bold text-warning-600">{reward.pointsCost}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{reward.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  <button
                    onClick={() => handleRequestReward(reward.id)}
                    disabled={!canAfford}
                    className={`w-full font-semibold py-2 px-4 rounded-lg transition-all ${
                      canAfford
                        ? 'bg-warning-500 hover:bg-warning-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Request Reward' : `Need ${reward.pointsCost - child.points} more points`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
