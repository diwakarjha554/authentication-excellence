import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConfig';
import Todo from '@/models/todo.model';
import { getAuth } from '@clerk/nextjs/server';

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const { sessionClaims } = getAuth(request);
        const metadata = sessionClaims?.metadata as { userId?: string };
        const userId = metadata.userId;

        await dbConnect();

        const todo = await Todo.findOne({ _id: params.id, userId });

        if (!todo) {
            return new NextResponse('Todo not found', { status: 404 });
        }

        return NextResponse.json(todo);
    } catch (error) {
        console.error('Error fetching todo:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
    try {
        const { sessionClaims } = getAuth(request);
        const metadata = sessionClaims?.metadata as { userId?: string };
        const userId = metadata.userId;

        const body = await request.json();
        const { title, description, completed, status, priority } = body;

        await dbConnect();

        const todo = await Todo.findOneAndUpdate(
            { _id: params.id, userId },
            { title, description, completed, status, priority },
            { new: true, runValidators: true }
        );

        if (!todo) {
            return new NextResponse('Todo not found', { status: 404 });
        }

        return NextResponse.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const { sessionClaims } = getAuth(request);
        const metadata = sessionClaims?.metadata as { userId?: string };
        const userId = metadata.userId;

        await dbConnect();

        const todo = await Todo.findOneAndDelete({ _id: params.id, userId });

        if (!todo) {
            return new NextResponse('Todo not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}