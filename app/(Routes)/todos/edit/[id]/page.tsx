'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            completed: checked,
        }));
        setError(null);
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
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="mt-4 flex justify-center">
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            Return to Todos
                        </Link>
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
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Edit Todo</CardTitle>
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
                                disabled={updating}
                                required
                                minLength={2}
                                maxLength={100}
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
                                    placeholder="Enter todo description"
                                    disabled={updating || isGeneratingDescription}
                                    className="min-h-[100px] flex-grow"
                                    required
                                    minLength={2}
                                    maxLength={500}
                                />
                                <Button
                                    type="button"
                                    onClick={generateDescription}
                                    disabled={updating || isGeneratingDescription}
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
                                value={formData.status}
                                onValueChange={(value: Todo['status']) => handleSelectChange('status', value)}
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

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: Todo['priority']) => handleSelectChange('priority', value)}
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

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="completed"
                                checked={formData.completed}
                                onCheckedChange={handleSwitchChange}
                                disabled={updating}
                            />
                            <Label htmlFor="completed">Completed</Label>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => router.push('/')}>
                                Cancel
                            </Button>
                            <Button variant="default" type="submit" disabled={updating}>
                                {updating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
