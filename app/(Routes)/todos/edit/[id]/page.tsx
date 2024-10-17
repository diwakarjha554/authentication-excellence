'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}

export default function EditTodoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false,
    });
    const [updating, setUpdating] = useState(false);

    

    const fetchTodo = async () => {
        try {
            setLoading(true);
            setError(null);

            // Changed to GET request for fetching the todo
            const response = await fetch(`/api/todo/${params.id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todo');
            }

            const data = await response.json();
            setTodo(data);
            setFormData({
                title: data.title,
                description: data.description,
                completed: data.completed,
            });
        } catch (error) {
            console.error('Error fetching todo:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch todo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodo();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setUpdating(true);
            setError(null);

            const response = await fetch(`/api/todo/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Error updating todo:', error);
            setError(error instanceof Error ? error.message : 'Failed to update todo');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-center">{error}</p>
                        <div className="mt-4 flex justify-center">
                            <Link href="/" className="text-blue-500 hover:text-blue-600">
                                Return to Todos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!todo) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <div className="text-center">
                        <p className="text-gray-600">Todo not found</p>
                        <div className="mt-4">
                            <Link href="/" className="text-blue-500 hover:text-blue-600">
                                Return to Todos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Edit Todo</h1>
                    <Link href="/" className="text-blue-500 hover:text-blue-600">
                        Back to Todos
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={updating}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            required
                            disabled={updating}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="completed"
                            checked={formData.completed}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    completed: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={updating}
                        />
                        <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                            Mark as completed
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/')}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            type="submit"
                            disabled={updating}
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
