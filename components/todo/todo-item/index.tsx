import Link from 'next/link';

interface TodoItemProps {
    todo: {
        _id: string;
        title: string;
        description: string;
        completed: boolean;
    };
    onDelete: (id: string) => void;
    onToggleComplete: (id: string, completed: boolean) => void;
}

export default function TodoItem({ todo, onDelete, onToggleComplete }: TodoItemProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm w-full">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4 w-full">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggleComplete(todo._id, todo.completed)}
                        className="h-4 w-4"
                    />
                    <div>
                        <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                            {todo.title}
                        </h3>
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                            {todo.description}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Link
                        href={`/todos/edit/${todo._id}`}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(todo._id)}
                        className="text-red-500 hover:text-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}