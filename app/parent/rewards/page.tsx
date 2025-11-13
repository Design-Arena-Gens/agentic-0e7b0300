'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { ArrowLeft, Plus, Trash2, Star } from 'lucide-react';

export default function RewardsManagement() {
  const router = useRouter();
  const { family, addReward, deleteReward } = useFamilyStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsCost: 20,
    icon: '🎁'
  });

  if (!family) {
    router.push('/');
    return null;
  }

  const handleAddReward = () => {
    if (newReward.name && newReward.description) {
      addReward(newReward);
      setNewReward({
        name: '',
        description: '',
        pointsCost: 20,
        icon: '🎁'
      });
      setShowAdd(false);
    }
  };

  const icons = ['🎁', '📱', '🍕', '🍦', '🎮', '🎬', '🌙', '🎨', '⚽', '🎵'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/parent/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Reward Bank</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="mb-6 bg-warning-500 hover:bg-warning-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New Reward
        </button>

        {showAdd && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Reward</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewReward({ ...newReward, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 ${
                        newReward.icon === icon ? 'border-warning-500 bg-warning-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Name</label>
                <input
                  type="text"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-warning-500"
                  placeholder="e.g., Extra Screen Time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-warning-500"
                  placeholder="e.g., 30 extra minutes of screen time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points Cost</label>
                <input
                  type="number"
                  value={newReward.pointsCost}
                  onChange={(e) => setNewReward({ ...newReward, pointsCost: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-warning-500"
                  min="1"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddReward}
                  className="bg-warning-500 hover:bg-warning-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Add Reward
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {family.rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl">{reward.icon}</div>
                <button
                  onClick={() => deleteReward(reward.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{reward.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
              <div className="flex items-center gap-1 text-warning-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-lg">{reward.pointsCost}</span>
                <span className="text-sm text-gray-600">points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
