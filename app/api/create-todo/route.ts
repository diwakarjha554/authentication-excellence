import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConfig';
import Todo from '@/models/todo.model';

// CREATE - POST /api/todos
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const todo = await Todo.create(body);
        return NextResponse.json(todo, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// READ (Get All) - GET /api/todos
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const todos = await Todo.find(userId ? { userId } : {});
        return NextResponse.json(todos);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
