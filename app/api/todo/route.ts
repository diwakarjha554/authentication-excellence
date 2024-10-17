import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import Todo from "@/models/todo.model";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    const { title, description } = await request.json();
    const { sessionClaims } = getAuth(request);
    const metadata = sessionClaims?.metadata as { userId?: string };
    const userId = metadata.userId;   

    try {
        await dbConnect();
        await Todo.create({ title, description, userId });
        return NextResponse.json({ message: "Todo created successfully" }, { status: 201 });
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
