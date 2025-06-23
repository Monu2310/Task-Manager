export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'personal' | 'work' | 'education' | 'health' | 'other';
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  byCategory: {
    personal: number;
    work: number;
    education: number;
    health: number;
    other: number;
  };
  completionRate: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface TaskResponse {
  message: string;
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface GenerateTasksResponse {
  message: string;
  tasks: string[];
  topic: string;
}

export interface StatsResponse {
  stats: TaskStats;
}
