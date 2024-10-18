'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
}

export default function EditTodoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Todo>({
        _id: '',
        title: '',
        description: '',
        completed: false,
        status: 'pending',
        priority: 'medium',
    });
    const [updating, setUpdating] = useState(false);

    const fetchTodo = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/todo/${params.id}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todo');
            }

            const data = await response.json();
            setTodo(data);
            setFormData(data);
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
                method: 'PUT',
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
                    <h1 className="text-3xl font-bold">Edit Todo</h1>
                    <Button variant="secondary" onClick={() => router.push('/')}>
                        Back to Todos
                    </Button>
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
                            minLength={2}
                            maxLength={100}
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
                            minLength={2}
                            maxLength={500}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: Todo['status']) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    status: value,
                                }))
                            }
                            disabled={updating}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value: Todo['priority']) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    priority: value,
                                }))
                            }
                            disabled={updating}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="completed"
                                checked={formData.completed}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        completed: checked === true,
                                    }))
                                }
                                disabled={updating}
                            />
                            <label
                                htmlFor="completed"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Mark as completed
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Cancel
                        </Button>
                        <Button variant="default" type="submit" disabled={updating}>
                            {updating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
