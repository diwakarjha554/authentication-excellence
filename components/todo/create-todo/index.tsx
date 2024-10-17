'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface TodoFormData {
    title: string;
    description: string;
}

const CreateTodo = () => {
    const [formData, setFormData] = useState<TodoFormData>({
        title: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setSuccess(false);
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (formData.title.length < 3) {
            setError('Title must be at least 3 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            const data = await response.json();
            setSuccess(true);
            setFormData({ title: '', description: '' });
            console.log(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Create New Todo</h2>
                <p className="text-sm text-gray-500">Add a new task to your todo list</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter todo title"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter todo description (optional)"
                        disabled={isLoading}
                        className="min-h-[100px]"
                    />
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="bg-green-50 text-green-700 border-green-200">
                        <AlertDescription>Todo created successfully!</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Todo'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CreateTodo;
