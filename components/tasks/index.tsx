// components/TodoList.tsx
'use client';

import { useState, useEffect } from 'react';
import TodoItem from '../todo/todo-item';

interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}

export default function TodoList() {
    // Initialize todos as an empty array
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/todo');
            
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            
            const data = await response.json();

            const dataArray = Array.isArray(data.todos) ? data.todos : [data.todos].filter(Boolean);
            
            // Ensure data is an array
            if (!Array.isArray(dataArray)) {
                console.error('API response is not an array:', dataArray);
                setTodos([]);
                setError('Invalid data format received');
                return;
            }
            
            setTodos(dataArray);
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch todos');
            setTodos([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/todo/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete todo');
        }
    };

    const handleToggleComplete = async (id: string, completed: boolean) => {
        try {
            const todo = todos.find(t => t._id === id);
            if (!todo) return;

            const response = await fetch(`/api/todo/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...todo,
                    completed: !completed,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            setTodos(prevTodos => 
                prevTodos.map(t => t._id === id ? { ...t, completed: !completed } : t)
            );
        } catch (error) {
            console.error('Error updating todo:', error);
            setError(error instanceof Error ? error.message : 'Failed to update todo');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                {error}
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No todos found. Create your first todo!
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full px-5">
            {todos.map((todo) => (
                <TodoItem
                    key={todo._id}
                    todo={todo}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                />
            ))}
        </div>
    );
}



