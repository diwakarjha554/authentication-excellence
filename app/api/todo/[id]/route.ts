import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConfig';
import Todo from '@/models/todo.model';
import { getAuth } from '@clerk/nextjs/server';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { sessionClaims } = getAuth(request);
        const metadata = sessionClaims?.metadata as { userId?: string };
        const userId = metadata.userId;

        const { title, description, completed } = await request.json();

        await dbConnect();

        const todo = await Todo.findOneAndUpdate(
            { _id: params.id, userId },
            { title, description, completed },
            { new: true }
        );

        if (!todo) {
            return new NextResponse('Todo not found', { status: 404 });
        }

        return NextResponse.json(todo);
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
        return new NextResponse('Internal Error', { status: 500 });
    }
}
