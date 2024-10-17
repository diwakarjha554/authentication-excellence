import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import Todo from "@/models/todo.model";

// READ (Get One) - GET /api/todos/[id]
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const todo = await Todo.findById(params.id);
        
        if (!todo) {
            return NextResponse.json(
                { error: "Todo not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(todo);
        
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// UPDATE - PUT /api/todos/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();
        
        const todo = await Todo.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );
        
        if (!todo) {
            return NextResponse.json(
                { error: "Todo not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(todo);
        
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - DELETE /api/todos/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const todo = await Todo.findByIdAndDelete(params.id);
        
        if (!todo) {
            return NextResponse.json(
                { error: "Todo not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ message: "Todo deleted successfully" });
        
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}