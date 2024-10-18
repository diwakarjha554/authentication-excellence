'use server';

import { revalidatePath } from 'next/cache';
import ChatbotSession from '../models/chatbot.model';
import { dbConnect } from '@/lib/dbConfig';
import { auth } from '@clerk/nextjs/server';
import { Message } from '@/types/chatbot';

export async function getChatbotSessions() {
    const { userId } = auth();
    
    try {
        await dbConnect();
        if (!userId) {
            throw new Error('Unauthorized');
        }
        const sessions = await ChatbotSession.find({ userId }).sort({ lastInteraction: -1 });
        return JSON.parse(JSON.stringify(sessions)); // Serialize for Next.js
    } catch (error) {
        console.error('Error fetching chatbot sessions:', error);
        throw error;
    }
}

export async function createChatbotSession(title: string) {
    const { userId } = auth();
    
    try {
        await dbConnect();
        if (!userId) {
            throw new Error('Unauthorized');
        }
        const newSession = await ChatbotSession.create({ title, userId });
        revalidatePath('/chatbot');
        return JSON.parse(JSON.stringify(newSession));
    } catch (error) {
        console.error('Error creating chatbot session:', error);
        throw error;
    }
}

export async function addMessageToChatbotSession(
    sessionId: string,
    message: Message
) {
    const { userId } = auth();
    
    try {
        await dbConnect();
        if (!userId) {
            throw new Error('Unauthorized');
        }
        const updatedSession = await ChatbotSession.findOneAndUpdate(
            { _id: sessionId, userId },
            {
                $push: { messages: { ...message, timestamp: new Date() } },
                $set: { lastInteraction: new Date() },
            },
            { new: true }
        );
        if (!updatedSession) {
            throw new Error('Session not found or unauthorized');
        }
        revalidatePath('/chatbot');
        return JSON.parse(JSON.stringify(updatedSession));
    } catch (error) {
        console.error('Error adding message to chatbot session:', error);
        throw error;
    }
}

export async function deleteChatbotSession(sessionId: string) {
    const { userId } = auth();
    
    try {
        await dbConnect();
        if (!userId) {
            throw new Error('Unauthorized');
        }
        const deletedSession = await ChatbotSession.findOneAndDelete({ _id: sessionId, userId });
        if (!deletedSession) {
            throw new Error('Session not found or unauthorized');
        }
        revalidatePath('/chatbot');
        return { success: true };
    } catch (error) {
        console.error('Error deleting chatbot session:', error);
        throw error;
    }
}