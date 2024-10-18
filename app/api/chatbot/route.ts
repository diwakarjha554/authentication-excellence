import { NextRequest, NextResponse } from 'next/server';
import {
    getChatbotSessions,
    createChatbotSession,
    addMessageToChatbotSession,
    deleteChatbotSession,
} from '@/actions/chatbot.action';

export async function GET() {
    try {
        const sessions = await getChatbotSessions();
        return NextResponse.json(sessions);
    } catch (error) {
        return NextResponse.json({ error: error, message: 'Failed to get chatbot sessions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title } = await request.json();
        const newSession = await createChatbotSession(title);
        return NextResponse.json(newSession);
    } catch (error) {
        return NextResponse.json({ error: error, message: 'Failed to create chatbot session' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { sessionId, message } = await request.json();
        const updatedSession = await addMessageToChatbotSession(sessionId, message);
        return NextResponse.json(updatedSession);
    } catch (error) {
        return NextResponse.json({ error: error, message: 'Failed to add message to chatbot session' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        if (!sessionId) {
            throw new Error('Session ID is required');
        }
        await deleteChatbotSession(sessionId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error, message: 'Failed to delete chatbot session' }, { status: 500 });
    }
}