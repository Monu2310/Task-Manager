'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/lib/store';
import { Sparkles, Brain, Plus, Save, Wand2 } from 'lucide-react';

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
    <Card className="backdrop-blur-lg bg-white/10 border-white/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          AI Task Generator
        </CardTitle>
        <CardDescription className="text-gray-300">
          Enter a topic and let AI generate 5 actionable tasks for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              placeholder="Enter a topic (e.g., Learn Python, Improve Fitness)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Generate
                </div>
              )}
            </Button>
          </div>
          
          {/* Sample suggestions */}
          <div className="flex flex-wrap gap-2">
            {['Learn React', 'Fitness Plan', 'Career Growth', 'Meal Prep'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-full border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {generatedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Generated Tasks
              </h3>
              <Button
                onClick={handleSaveAll}
                size="sm"
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                variant="outline"
              >
                <Save className="w-3 h-3 mr-1" />
                Save All
              </Button>
            </div>
            
            <div className="space-y-2">
              {generatedTasks.map((task, index) => (
                <motion.div
                  key={task}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <span className="text-gray-200 text-sm flex-1">{task}</span>
                  <Button
                    onClick={() => handleSaveTask(task)}
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
                    variant="outline"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Brain className="w-3 h-3" />
                Powered by Google Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
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
