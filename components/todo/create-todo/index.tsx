'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TodoFormProps {
    onSuccess?: () => void;
    initialData?: {
        _id?: string;
        title: string;
        description: string;
        completed: boolean;
    };
}

export default function TodoForm({ onSuccess, initialData }: TodoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        completed: initialData?.completed || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const url = initialData?._id 
                ? `/api/todos/${initialData._id}`
                : '/api/todos';
                
            const method = initialData?._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: 'your-user-id-here', // Replace with actual user ID
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save todo');
            }

            setFormData({
                title: '',
                description: '',
                completed: false,
            });
            
            router.refresh();
            onSuccess?.();
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label 
                    htmlFor="title" 
                    className="block text-sm font-medium text-gray-700"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        title: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label 
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        description: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                    required
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        completed: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label 
                    htmlFor="completed"
                    className="ml-2 block text-sm text-gray-700"
                >
                    Completed
                </label>
            </div>

            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? 'Saving...' : (initialData?._id ? 'Update' : 'Create')}
            </button>
        </form>
    );
}