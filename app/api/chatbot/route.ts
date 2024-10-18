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
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title } = await request.json();
        const newSession = await createChatbotSession(title);
        return NextResponse.json(newSession);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { sessionId, message } = await request.json();
        const updatedSession = await addMessageToChatbotSession(sessionId, message);
        return NextResponse.json(updatedSession);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
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
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}