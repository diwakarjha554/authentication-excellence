'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, Trash2, Send, Edit2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { type Message, type ChatbotSession } from '@/types/chatbot';

const Chatbot: React.FC = () => {
    const [sessions, setSessions] = useState<ChatbotSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    useEffect(() => {
        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
        if (API_KEY) {
            const genAI = new GoogleGenerativeAI(API_KEY);
            setGenAI(genAI);
        }
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/chatbot');
            if (!response.ok) throw new Error('Failed to fetch sessions');
            const data = await response.json();
            setSessions(data);
            if (data.length > 0) {
                setCurrentSessionId(data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setError('Failed to load chat sessions');
        }
    };

    const createNewSession = async () => {
        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'New Chat' }),
            });
            if (!response.ok) throw new Error('Failed to create session');
            const newSession = await response.json();
            setSessions((prev) => [newSession, ...prev]);
            setCurrentSessionId(newSession._id);
            return newSession._id;
        } catch (error) {
            console.error('Error creating session:', error);
            setError('Failed to create new chat');
            return null;
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !genAI || isLoading) return;

        setIsLoading(true);
        setError(null);

        let sessionId = currentSessionId;
        if (!sessionId) {
            sessionId = await createNewSession();
            if (!sessionId) {
                setIsLoading(false);
                return;
            }
        }

        const userMessage = { role: 'user' as const, content: input, timestamp: new Date() };

        // Immediately update the UI with the user's message
        setSessions((prev) =>
            prev.map((session) =>
                session._id === sessionId
                    ? {
                          ...session,
                          messages: [...session.messages, userMessage],
                          lastInteraction: new Date(),
                      }
                    : session
            )
        );

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(input);
            const response = await result.response;
            const text = response.text();

            if (text) {
                const botMessage = { role: 'bot' as const, content: text, timestamp: new Date() };

                await Promise.all([
                    fetch('/api/chatbot', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId, message: userMessage }),
                    }),
                    fetch('/api/chatbot', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId, message: botMessage }),
                    }),
                ]);

                setSessions((prev) =>
                    prev.map((session) =>
                        session._id === sessionId
                            ? {
                                  ...session,
                                  messages: [...session.messages, botMessage],
                                  lastInteraction: new Date(),
                              }
                            : session
                    )
                );
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        } finally {
            setInput('');
            setIsLoading(false);
        }
    };

    const deleteSession = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/chatbot?sessionId=${sessionId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete session');
            setSessions((prev) => prev.filter((session) => session._id !== sessionId));
            if (currentSessionId === sessionId) {
                setCurrentSessionId(sessions[0]?._id || null);
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            setError('Failed to delete chat');
        }
    };

    const updateSessionTitle = async () => {
        if (!currentSessionId || !editedTitle.trim()) return;

        try {
            const response = await fetch(`/api/chatbot`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: currentSessionId, title: editedTitle }),
            });
            if (!response.ok) throw new Error('Failed to update session title');
            setSessions((prev) =>
                prev.map((session) =>
                    session._id === currentSessionId ? { ...session, title: editedTitle } : session
                )
            );
            setIsEditingTitle(false);
        } catch (error) {
            console.error('Error updating session title:', error);
            setError('Failed to update chat title');
        }
    };

    const currentSession = sessions.find((session) => session._id === currentSessionId);

    return (
        <Card className="flex h-screen w-full">
            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? 'block' : 'hidden'
                } md:block w-64 min-w-[16rem] max-w-[20rem] border-r p-4 overflow-hidden flex flex-col`}
            >
                <Button onClick={createNewSession} className="mb-4" disabled={isLoading}>
                    New Chat
                </Button>
                <ScrollArea className="flex-grow">
                    {sessions.map((session) => (
                        <div key={session._id} className="flex items-center mb-2">
                            <Button
                                onClick={() => {
                                    setCurrentSessionId(session._id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`flex-grow justify-start ${
                                    currentSessionId === session._id ? 'bg-primary text-primary-foreground' : ''
                                }`}
                                variant="ghost"
                            >
                                {session.title}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="ml-2">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this chat.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteSession(session._id)}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col">
                <CardHeader className="border-b flex flex-row justify-between items-center p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu />
                    </Button>
                    {isEditingTitle ? (
                        <div className="flex items-center">
                            <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="mr-2"
                            />
                            <Button onClick={updateSessionTitle}>Save</Button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <CardTitle className="text-2xl font-bold mr-2">
                                {currentSession?.title || 'New Chat'}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setIsEditingTitle(true);
                                    setEditedTitle(currentSession?.title || '');
                                }}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full">
                        {error && <div className="p-4 text-red-500 text-center">{error}</div>}
                        {currentSession?.messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} p-4`}
                            >
                                <div
                                    className={`flex items-end ${
                                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    } max-w-[80%]`}
                                >
                                    <Card
                                        className={`mx-2 p-3 ${
                                            message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                        }`}
                                    >
                                        <CardContent className="p-0 whitespace-pre-wrap">{message.content}</CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start p-4">
                                <Card className="mx-2 p-3 bg-muted">
                                    <CardContent className="p-0">Thinking...</CardContent>
                                </Card>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>

                <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={isLoading}
                            className="flex-grow"
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-4">
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </div>
        </Card>
    );
};

export default Chatbot;
