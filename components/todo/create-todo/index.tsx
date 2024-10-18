'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TodoFormData {
    title: string;
    description: string;
    completed: boolean;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
}

const CreateTodo = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<TodoFormData>({
        title: '',
        description: '',
        completed: false,
        status: 'pending',
        priority: 'medium',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setSuccess(false);
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setSuccess(false);
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            completed: checked,
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
            setFormData({ title: '', description: '', completed: false, status: 'pending', priority: 'medium' });
            console.log(data);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const generateDescription = async () => {
        if (!formData.title.trim()) {
            setError('Please enter a title first');
            return;
        }

        setIsGeneratingDescription(true);
        setError(null);

        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Generate a brief description for a todo task with the title: "${formData.title}". The description should be concise and relevant to the title.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const generatedDescription = response.text();

            setFormData((prev) => ({
                ...prev,
                description: generatedDescription,
            }));
        } catch (err) {
            setError('Failed to generate description. Please try again.');
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create New Todo</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <div className="flex space-x-2">
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter todo description (optional)"
                                disabled={isLoading || isGeneratingDescription}
                                className="min-h-[100px] flex-grow"
                            />
                            <Button
                                type="button"
                                onClick={generateDescription}
                                disabled={isLoading || isGeneratingDescription}
                                className="self-start"
                            >
                                {isGeneratingDescription ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Generate'
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value) => handleSelectChange('status', value)}
                            defaultValue={formData.status}
                        >
                            <SelectTrigger>
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

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            onValueChange={(value) => handleSelectChange('priority', value)}
                            defaultValue={formData.priority}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="completed" checked={formData.completed} onCheckedChange={handleSwitchChange} />
                        <Label htmlFor="completed">Completed</Label>
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
            </CardContent>
        </Card>
    );
};

export default CreateTodo;
