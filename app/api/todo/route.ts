import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import Todo from "@/models/todo.model";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    const { title, description, completed, status, priority } = await request.json();
    const { sessionClaims } = getAuth(request);
    const metadata = sessionClaims?.metadata as { userId?: string };
    const userId = metadata.userId;   

    try {
        await dbConnect();
        const newTodo = await Todo.create({ title, description, completed, status, priority, userId });
        return NextResponse.json({ message: "Todo created successfully", todo: newTodo }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { sessionClaims } = getAuth(request);
    const metadata = sessionClaims?.metadata as { userId?: string };
    const userId = metadata.userId;

    try {
        await dbConnect();
        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ todos });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { id, title, description, completed, status, priority } = await request.json();
    const { sessionClaims } = getAuth(request);
    const metadata = sessionClaims?.metadata as { userId?: string };
    const userId = metadata.userId;

    try {
        await dbConnect();
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, userId },
            { title, description, completed, status, priority },
            { new: true }
        );
        if (!updatedTodo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    const { sessionClaims } = getAuth(request);
    const metadata = sessionClaims?.metadata as { userId?: string };
    const userId = metadata.userId;

    try {
        await dbConnect();
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });
        if (!deletedTodo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
