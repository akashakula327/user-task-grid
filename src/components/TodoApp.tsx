import React, { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodo, setNewTodo] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-foreground mb-2">todos</h1>
          <p className="text-muted-foreground">A minimalistic task manager</p>
        </div>

        {/* Add Todo */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-12 px-4 text-lg border-2 rounded-xl transition-all duration-200 focus:border-primary"
            />
            <Button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-muted rounded-xl p-1">
            {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
                  filter === filterType
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filterType}
                {filterType === 'active' && activeTodosCount > 0 && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {activeTodosCount}
                  </span>
                )}
                {filterType === 'completed' && completedTodosCount > 0 && (
                  <span className="ml-1 text-xs bg-success text-success-foreground px-1.5 py-0.5 rounded-full">
                    {completedTodosCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {filter === 'completed' ? '🎉' : filter === 'active' ? '📝' : '✨'}
              </div>
              <p className="text-muted-foreground text-lg">
                {filter === 'completed' 
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'No active tasks'
                  : 'No tasks yet. Add one above!'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-3 p-4 bg-card rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-black/5 ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 rounded-lg border-2"
                />
                
                <span
                  className={`flex-1 text-lg transition-all duration-200 ${
                    todo.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </span>
                
                {todo.completed && (
                  <div className="flex items-center text-success">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 px-6 py-3 bg-muted rounded-xl text-sm text-muted-foreground">
              <span>{todos.length} total</span>
              <span>•</span>
              <span>{activeTodosCount} active</span>
              <span>•</span>
              <span>{completedTodosCount} completed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};