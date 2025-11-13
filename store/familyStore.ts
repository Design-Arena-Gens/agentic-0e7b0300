import { create } from 'zustand';

export type UserRole = 'parent' | 'child';

export interface Child {
  id: string;
  name: string;
  pin: string;
  points: number;
  avatar: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  points: number;
  duration: number; // in minutes
  icon: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  icon: string;
}

export interface RewardRedemption {
  id: string;
  childId: string;
  rewardId: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
}

export interface CompletedTask {
  id: string;
  childId: string;
  taskId: string;
  completedAt: Date;
  pointsEarned: number;
}

export interface Family {
  id: string;
  name: string;
  parentEmail: string;
  trialStartDate: Date;
  children: Child[];
  tasks: Task[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  completedTasks: CompletedTask[];
}

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  currentUserId: string | null;
  family: Family | null;
}

interface FamilyStore extends AuthState {
  // Auth actions
  loginParent: (email: string) => void;
  loginChild: (childId: string, pin: string) => boolean;
  logout: () => void;

  // Family setup
  createFamily: (name: string, email: string) => void;
  addChild: (name: string, pin: string) => void;

  // Task management
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Reward management
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, reward: Partial<Reward>) => void;
  deleteReward: (id: string) => void;

  // Child actions
  completeTask: (childId: string, taskId: string) => void;
  requestRedemption: (childId: string, rewardId: string) => void;

  // Parent actions
  approveRedemption: (redemptionId: string) => void;
  denyRedemption: (redemptionId: string) => void;

  // Getters
  getChild: (childId: string) => Child | undefined;
  getPendingRedemptions: () => RewardRedemption[];
  getChildCompletedTasks: (childId: string) => CompletedTask[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useFamilyStore = create<FamilyStore>()((set, get) => ({
  isAuthenticated: false,
  userRole: null,
  currentUserId: null,
  family: null,

      loginParent: (email: string) => {
        const family = get().family;
        if (family && family.parentEmail === email) {
          set({ isAuthenticated: true, userRole: 'parent', currentUserId: family.id });
        }
      },

      loginChild: (childId: string, pin: string) => {
        const family = get().family;
        if (!family) return false;

        const child = family.children.find(c => c.id === childId && c.pin === pin);
        if (child) {
          set({ isAuthenticated: true, userRole: 'child', currentUserId: childId });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, userRole: null, currentUserId: null });
      },

      createFamily: (name: string, email: string) => {
        const family: Family = {
          id: generateId(),
          name,
          parentEmail: email,
          trialStartDate: new Date(),
          children: [],
          tasks: [
            {
              id: generateId(),
              name: 'Clean Room',
              description: 'Tidy up bedroom and make bed',
              points: 10,
              duration: 10,
              icon: '🛏️'
            },
            {
              id: generateId(),
              name: 'Homework',
              description: 'Complete daily homework',
              points: 15,
              duration: 30,
              icon: '📚'
            },
            {
              id: generateId(),
              name: 'Dishes',
              description: 'Help with dishes after dinner',
              points: 10,
              duration: 15,
              icon: '🍽️'
            }
          ],
          rewards: [
            {
              id: generateId(),
              name: '30min Screen Time',
              description: 'Extra 30 minutes of screen time',
              pointsCost: 20,
              icon: '📱'
            },
            {
              id: generateId(),
              name: 'Choose Dinner',
              description: 'Pick what we have for dinner',
              pointsCost: 30,
              icon: '🍕'
            },
            {
              id: generateId(),
              name: 'Stay Up Late',
              description: '30 minutes past bedtime',
              pointsCost: 25,
              icon: '🌙'
            }
          ],
          redemptions: [],
          completedTasks: []
        };
        set({ family, isAuthenticated: true, userRole: 'parent', currentUserId: family.id });
      },

      addChild: (name: string, pin: string) => {
        set(state => {
          if (!state.family) return state;

          const avatars = ['👦', '👧', '🧒', '👶', '🧑'];
          const child: Child = {
            id: generateId(),
            name,
            pin,
            points: 0,
            avatar: avatars[state.family.children.length % avatars.length]
          };

          return {
            family: {
              ...state.family,
              children: [...state.family.children, child]
            }
          };
        });
      },

      addTask: (task) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              tasks: [...state.family.tasks, { ...task, id: generateId() }]
            }
          };
        });
      },

      updateTask: (id, task) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              tasks: state.family.tasks.map(t => t.id === id ? { ...t, ...task } : t)
            }
          };
        });
      },

      deleteTask: (id) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              tasks: state.family.tasks.filter(t => t.id !== id)
            }
          };
        });
      },

      addReward: (reward) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              rewards: [...state.family.rewards, { ...reward, id: generateId() }]
            }
          };
        });
      },

      updateReward: (id, reward) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              rewards: state.family.rewards.map(r => r.id === id ? { ...r, ...reward } : r)
            }
          };
        });
      },

      deleteReward: (id) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              rewards: state.family.rewards.filter(r => r.id !== id)
            }
          };
        });
      },

      completeTask: (childId, taskId) => {
        set(state => {
          if (!state.family) return state;

          const task = state.family.tasks.find(t => t.id === taskId);
          if (!task) return state;

          const completedTask: CompletedTask = {
            id: generateId(),
            childId,
            taskId,
            completedAt: new Date(),
            pointsEarned: task.points
          };

          return {
            family: {
              ...state.family,
              children: state.family.children.map(c =>
                c.id === childId ? { ...c, points: c.points + task.points } : c
              ),
              completedTasks: [...state.family.completedTasks, completedTask]
            }
          };
        });
      },

      requestRedemption: (childId, rewardId) => {
        set(state => {
          if (!state.family) return state;

          const child = state.family.children.find(c => c.id === childId);
          const reward = state.family.rewards.find(r => r.id === rewardId);

          if (!child || !reward || child.points < reward.pointsCost) return state;

          const redemption: RewardRedemption = {
            id: generateId(),
            childId,
            rewardId,
            status: 'pending',
            requestedAt: new Date()
          };

          return {
            family: {
              ...state.family,
              redemptions: [...state.family.redemptions, redemption]
            }
          };
        });
      },

      approveRedemption: (redemptionId) => {
        set(state => {
          if (!state.family) return state;

          const redemption = state.family.redemptions.find(r => r.id === redemptionId);
          if (!redemption) return state;

          const reward = state.family.rewards.find(r => r.id === redemption.rewardId);
          if (!reward) return state;

          return {
            family: {
              ...state.family,
              children: state.family.children.map(c =>
                c.id === redemption.childId
                  ? { ...c, points: c.points - reward.pointsCost }
                  : c
              ),
              redemptions: state.family.redemptions.map(r =>
                r.id === redemptionId ? { ...r, status: 'approved' as const } : r
              )
            }
          };
        });
      },

      denyRedemption: (redemptionId) => {
        set(state => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              redemptions: state.family.redemptions.map(r =>
                r.id === redemptionId ? { ...r, status: 'denied' as const } : r
              )
            }
          };
        });
      },

      getChild: (childId) => {
        const family = get().family;
        return family?.children.find(c => c.id === childId);
      },

      getPendingRedemptions: () => {
        const family = get().family;
        return family?.redemptions.filter(r => r.status === 'pending') || [];
      },

      getChildCompletedTasks: (childId) => {
        const family = get().family;
        return family?.completedTasks.filter(ct => ct.childId === childId) || [];
      }
}));
