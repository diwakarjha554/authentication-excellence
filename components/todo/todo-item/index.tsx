import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    return (
        <div className="border rounded-lg p-4 shadow-sm w-full">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4 w-full">
                    <div>
                        <h3 className={`font-medium text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                            {todo.title}
                        </h3>
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                            {todo.description}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    <Checkbox
                        id={`todo-${todo._id}`}
                        checked={todo.completed}
                        onCheckedChange={() => onToggleComplete(todo._id, todo.completed)}
                        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <label
                        htmlFor={`todo-${todo._id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {todo.completed ? 'Completed' : 'Mark as complete'}
                    </label>
                    <Button
                        variant="secondary"
                        onClick={() => router.push(`/todos/edit/${todo._id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => onDelete(todo._id)}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}