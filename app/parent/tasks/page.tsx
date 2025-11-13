'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFamilyStore } from '@/store/familyStore';
import { ArrowLeft, Plus, Clock, Star, Trash2 } from 'lucide-react';

export default function TasksManagement() {
  const router = useRouter();
  const { family, addTask, deleteTask } = useFamilyStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    points: 10,
    duration: 10,
    icon: '✅'
  });

  if (!family) {
    router.push('/');
    return null;
  }

  const handleAddTask = () => {
    if (newTask.name && newTask.description) {
      addTask(newTask);
      setNewTask({
        name: '',
        description: '',
        points: 10,
        duration: 10,
        icon: '✅'
      });
      setShowAdd(false);
    }
  };

  const icons = ['✅', '🛏️', '📚', '🍽️', '🧹', '🗑️', '🌳', '🐕', '🚗', '🧺'];

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
            <h1 className="text-2xl font-bold text-gray-900">Task Bank</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="mb-6 bg-success-500 hover:bg-success-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>

        {showAdd && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 ${
                        newTask.icon === icon ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Clean Room"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Tidy up and make bed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                  <input
                    type="number"
                    value={newTask.points}
                    onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={newTask.duration}
                    onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddTask}
                  className="bg-success-500 hover:bg-success-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Add Task
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
          {family.tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl">{task.icon}</div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{task.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-warning-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{task.points}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{task.duration}min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
