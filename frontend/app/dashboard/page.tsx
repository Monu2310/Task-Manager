'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useTaskStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskGenerator } from '@/components/TaskGenerator';
import { TaskItem } from '@/components/TaskItem';
import { HydrationWrapper } from '@/components/HydrationWrapper';
import { LogOut, Plus, Filter, BarChart3 } from 'lucide-react';

function DashboardContent() {
  const { user, logout } = useAuthStore();
  const { tasks, stats, isLoading, fetchTasks, fetchStats, setFilter, filter } = useTaskStore();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', category: 'other' });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Rehydrate the auth store manually
    useAuthStore.persist.rehydrate();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    fetchTasks();
    fetchStats();
  }, [user, router, fetchTasks, fetchStats, filter, isInitialized]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleFilterChange = (type: 'status' | 'category', value: string) => {
    const newFilter = { ...filter };
    if (value === 'all') {
      delete newFilter[type];
    } else {
      newFilter[type] = value;
    }
    setFilter(newFilter);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    try {
      await useTaskStore.getState().createTask({
        title: newTask.title,
        description: newTask.description || undefined,
        category: newTask.category as any,
        status: 'pending'
      });
      setNewTask({ title: '', description: '', category: 'other' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Panel */}
          {stats && (
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Tasks</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="font-medium text-blue-600">{stats.inProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-medium text-orange-600">{stats.pending}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-medium">{stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Task Generator */}
            <TaskGenerator />

            {/* Manual Task Creation Form */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter task title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select 
                        value={newTask.category} 
                        onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">👤 Personal</SelectItem>
                          <SelectItem value="work">💼 Work</SelectItem>
                          <SelectItem value="education">📚 Education</SelectItem>
                          <SelectItem value="health">🏥 Health</SelectItem>
                          <SelectItem value="other">📋 Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit">Create Task</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={filter.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select value={filter.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="personal">👤 Personal</SelectItem>
                        <SelectItem value="work">💼 Work</SelectItem>
                        <SelectItem value="education">📚 Education</SelectItem>
                        <SelectItem value="health">🏥 Health</SelectItem>
                        <SelectItem value="other">📋 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>
                  {tasks.length === 0 ? 'No tasks found' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks found. Create your first task or generate some with AI!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <HydrationWrapper>
      <DashboardContent />
    </HydrationWrapper>
  );
}
