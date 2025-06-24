'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/lib/store';
import { Pencil, Trash2, Calendar, Tag, Save, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { updateTask, deleteTask } = useTaskStore();

  const handleStatusChange = async (checked: boolean) => {
    const newStatus = checked ? 'completed' : 'pending';
    await updateTask(task.id, {
      status: newStatus,
      isCompleted: checked
    });
  };

  const handleCategoryChange = async (category: string) => {
    await updateTask(task.id, { category: category as any });
  };

  const handleEdit = async () => {
    if (isEditing) {
      await updateTask(task.id, { title: editTitle });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': 
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'in_progress': 
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          icon: Clock,
          label: 'In Progress'
        };
      default: 
        return {
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          icon: AlertCircle,
          label: 'Pending'
        };
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'personal': return '👤';
      case 'work': return '💼';
      case 'education': return '📚';
      case 'health': return '🏥';
      default: return '📋';
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card className="backdrop-blur-lg bg-white/5 border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/10">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Checkbox */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-1"
            >
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={handleStatusChange}
                className="border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleEdit}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                        variant="outline"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCancelEdit}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                        variant="outline"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <h3 className={`font-medium text-white text-sm leading-5 ${
                      task.status === 'completed' ? 'line-through opacity-60' : ''
                    }`}>
                      {task.title}
                    </h3>
                  )}

                  {task.description && (
                    <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center space-x-3 mt-2">
                    {/* Status */}
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusConfig.bgColor}`}>
                      <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                      <span className={statusConfig.color}>{statusConfig.label}</span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <span>{getCategoryEmoji(task.category)}</span>
                      <span className="capitalize">{task.category}</span>
                    </div>

                    {/* Date */}
                    {task.createdAt && (
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {!isEditing && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEdit}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDelete}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Category Selector */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Select value={task.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white text-xs">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
      case 'in_progress': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'education': return '📚';
      case 'health': return '🏥';
      default: return '📋';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${task.isCompleted ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.isCompleted}
            onCheckedChange={handleStatusChange}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-base font-medium border-none outline-none bg-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                autoFocus
              />
            ) : (
              <h3 className={`text-base font-medium ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
            )}
            
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <Select value={task.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-6 w-auto border-none p-0 text-xs">
                    <SelectValue>
                      <span className="flex items-center space-x-1">
                        <span>{getCategoryIcon(task.category)}</span>
                        <span className="capitalize">{task.category}</span>
                      </span>
                    </SelectValue>
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
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className={`flex items-center space-x-1 ${getStatusColor(task.status)}`}>
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <span className="capitalize">{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
