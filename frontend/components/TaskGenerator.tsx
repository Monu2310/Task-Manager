'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/lib/store';

export function TaskGenerator() {
  const [topic, setTopic] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateTasks, createTask } = useTaskStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const tasks = await generateTasks(topic);
      setGeneratedTasks(tasks);
    } catch (error) {
      console.error('Failed to generate tasks:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTask = async (taskTitle: string) => {
    try {
      await createTask({
        title: taskTitle,
        category: 'other',
        status: 'pending'
      });
      // Remove the saved task from the generated list
      setGeneratedTasks(prev => prev.filter(task => task !== taskTitle));
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleSaveAll = async () => {
    try {
      const promises = generatedTasks.map(taskTitle =>
        createTask({
          title: taskTitle,
          category: 'other',
          status: 'pending'
        })
      );
      await Promise.all(promises);
      setGeneratedTasks([]);
    } catch (error) {
      console.error('Failed to save all tasks:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Generator</CardTitle>
        <CardDescription>
          Enter a topic and let AI generate 5 actionable tasks for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a topic (e.g., Learn Python, Improve Fitness)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {generatedTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Generated Tasks for "{topic}"</h3>
              <Button onClick={handleSaveAll} size="sm">
                Save All
              </Button>
            </div>
            
            <div className="space-y-2">
              {generatedTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{task}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSaveTask(task)}
                  >
                    Save
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
