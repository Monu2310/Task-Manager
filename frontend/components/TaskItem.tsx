'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/lib/store';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
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
