'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore, useTaskStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskGenerator } from '@/components/TaskGenerator';
import { TaskItem } from '@/components/TaskItem';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { HydrationWrapper } from '@/components/HydrationWrapper';
import { 
  LogOut, 
  Plus, 
  Filter, 
  BarChart3, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  User,
  TrendingUp,
  X
} from 'lucide-react';

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

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: AlertCircle,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen relative">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/10 border-b border-white/10 shadow-lg sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    TaskAI Dashboard
                  </h1>
                  <p className="text-sm text-gray-300 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Welcome back, {user.name}!
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="backdrop-blur-lg bg-white/10 border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Completion Rate Card */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-8"
            >
              <Card className="backdrop-blur-lg bg-white/10 border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-white font-bold">{stats.completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.completionRate}%` }}
                      transition={{ duration: 1, delay: 1 }}
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full shadow-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Task Generator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="xl:col-span-2"
            >
              <TaskGenerator />
            </motion.div>

            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="space-y-6"
            >
              <Card className="backdrop-blur-lg bg-white/10 border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
                    <Select value={filter.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
                    <Select value={filter.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Manual Task Creation Form */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <Card className="backdrop-blur-lg bg-white/10 border-white/10 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Create New Task</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateForm(false)}
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Title</label>
                      <Input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter task title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Description (Optional)</label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
                      <Select 
                        value={newTask.category} 
                        onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                    <div className="flex space-x-3">
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      >
                        Create Task
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tasks List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8"
          >
            <Card className="backdrop-blur-lg bg-white/10 border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Your Tasks</CardTitle>
                <CardDescription className="text-gray-300">
                  {tasks.length === 0 ? 'No tasks found' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-300"></div>
                    </div>
                  </div>
                ) : tasks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-10 h-10 text-cyan-400" />
                    </div>
                    <p className="text-gray-300 text-lg mb-2">No tasks found</p>
                    <p className="text-gray-400 text-sm">Create your first task or generate some with AI!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TaskItem task={task} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <HydrationWrapper>
      <DashboardContent />
    </HydrationWrapper>
  );
}
