import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { User, Task, TaskStats, AuthResponse, TaskResponse, TasksResponse, GenerateTasksResponse, StatsResponse } from '@/lib/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

interface TaskStore {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  filter: {
    status?: string;
    category?: string;
  };
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  generateTasks: (topic: string) => Promise<string[]>;
  fetchStats: () => Promise<void>;
  setFilter: (filter: { status?: string; category?: string }) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/login', { email, password });
          const { user, token } = response.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/register', { email, password, name });
          const { user, token } = response.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ user: null, token: null });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
      skipHydration: true, // Skip hydration to prevent mismatch
    }
  )
);

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  stats: null,
  isLoading: false,
  filter: {},

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const { filter } = get();
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.category) params.append('category', filter.category);
      
      const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
      set({ tasks: response.data.tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTask: async (taskData: Partial<Task>) => {
    set({ isLoading: true });
    try {
      const response = await api.post<TaskResponse>('/tasks', taskData);
      const { tasks } = get();
      set({ tasks: [response.data.task, ...tasks], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    set({ isLoading: true });
    try {
      const response = await api.put<TaskResponse>(`/tasks/${id}`, updates);
      const { tasks } = get();
      const updatedTasks = tasks.map(task => 
        task.id === id ? response.data.task : task
      );
      set({ tasks: updatedTasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true });
    try {
      await api.delete(`/tasks/${id}`);
      const { tasks } = get();
      const filteredTasks = tasks.filter(task => task.id !== id);
      set({ tasks: filteredTasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  generateTasks: async (topic: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post<GenerateTasksResponse>('/tasks/generate', { topic });
      set({ isLoading: false });
      return response.data.tasks;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const response = await api.get<StatsResponse>('/tasks/stats/overview');
      set({ stats: response.data.stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  setFilter: (filter: { status?: string; category?: string }) => {
    set({ filter });
  },
}));
